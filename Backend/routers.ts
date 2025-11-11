import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

// Helper to check admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Helper to check driver role
const driverProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'driver') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Driver access required' });
  }
  return next({ ctx });
});

// Helper to check customer role
const customerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'customer') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Customer access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Map key distribution by role
  maps: router({
    getKey: publicProcedure
      .input(z.object({ role: z.enum(['admin', 'driver', 'customer']) }))
      .query(({ input }) => {
        const keys: Record<string, string> = {
          admin: process.env.MAPTILER_ADMIN || '',
          driver: process.env.MAPTILER_DRIVER || '',
          customer: process.env.MAPTILER_CUSTOMER || '',
        };
        return { key: keys[input.role] || '' };
      }),
  }),

  // Product catalog
  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),
  }),

  // Orders
  orders: router({
    create: customerProcedure
      .input(z.object({
        items: z.array(z.object({ productId: z.number(), quantity: z.number(), price: z.number() })),
        totalAmount: z.number(),
        deliveryAddress: z.string(),
        deliveryLat: z.number(),
        deliveryLng: z.number(),
        windowStart: z.date().optional(),
        windowEnd: z.date().optional(),
        appliedPromoCode: z.string().optional(),
        appliedReferralCode: z.string().optional(),
        discount: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Validate order amount
        if (input.totalAmount < 10000) { // $100 minimum
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Minimum order is $100' });
        }
        if (input.totalAmount > 50000) { // $500 maximum
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Maximum order is $500' });
        }

        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const result = await db.createOrder({
          orderId,
          customerId: ctx.user.id,
          items: JSON.stringify(input.items),
          totalAmount: input.totalAmount,
          status: 'pending',
          deliveryAddress: input.deliveryAddress,
          deliveryLat: input.deliveryLat,
          deliveryLng: input.deliveryLng,
          windowStart: input.windowStart,
          windowEnd: input.windowEnd,
          appliedPromoCode: input.appliedPromoCode,
          appliedReferralCode: input.appliedReferralCode,
          discount: input.discount || 0,
        });

        return { orderId, success: true };
      }),

    list: customerProcedure.query(async ({ ctx }) => {
      return await db.getCustomerOrders(ctx.user.id);
    }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getOrderByOrderId(input.id);
      }),

    updateStatus: adminProcedure
      .input(z.object({ orderId: z.number(), status: z.string() }))
      .mutation(async ({ input }) => {
        return await db.updateOrderStatus(input.orderId, input.status);
      }),

    assignDriver: adminProcedure
      .input(z.object({ orderId: z.number(), driverId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.assignOrderToDriver(input.orderId, input.driverId);
      }),

    updateETA: protectedProcedure
      .input(z.object({ orderId: z.number(), eta: z.date() }))
      .mutation(async ({ input }) => {
        return await db.updateOrderETA(input.orderId, input.eta);
      }),
  }),

  // Driver management
  drivers: router({
    list: adminProcedure.query(async () => {
      return await db.getAllDrivers();
    }),

    getByUserId: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDriverByUserId(input.userId);
      }),

    updateLocation: driverProcedure
      .input(z.object({ lat: z.number(), lng: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const driver = await db.getDriverByUserId(ctx.user.id);
        if (!driver) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Driver not found' });
        }
        return await db.updateDriverLocation(driver.id, input.lat, input.lng);
      }),

    updateStatus: driverProcedure
      .input(z.object({ status: z.enum(['idle', 'enroute', 'delivering']) }))
      .mutation(async ({ ctx, input }) => {
        const driver = await db.getDriverByUserId(ctx.user.id);
        if (!driver) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Driver not found' });
        }
        return await db.updateDriverStatus(driver.id, input.status);
      }),
  }),

  // Referrals
  referrals: router({
    generate: customerProcedure.mutation(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user?.referralCode) {
        const code = `REF-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        // Update user with referral code (simplified - would need update function)
        return { code };
      }
      return { code: user.referralCode };
    }),

    applyCode: customerProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ input }) => {
        const referral = await db.getReferralByCode(input.code);
        if (!referral) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Referral code not found' });
        }
        return { creditAmount: referral.creditAmount };
      }),

    get: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        return await db.getReferralByCode(input.code);
      }),
  }),

  // Promotions
  promos: router({
    validateCode: publicProcedure
      .input(z.object({ code: z.string(), orderAmount: z.number() }))
      .query(async ({ input }) => {
        const promo = await db.getPromoByCode(input.code);
        if (!promo) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Promo code not found' });
        }
        if (promo.minOrderAmount && input.orderAmount < promo.minOrderAmount) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: `Minimum order ${promo.minOrderAmount} required` });
        }
        if (promo.maxUses && promo.currentUses >= promo.maxUses) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Promo code limit reached' });
        }
        return { valid: true, discount: promo.discountAmount, discountPercent: promo.discountPercent };
      }),
  }),

  // Addresses
  addresses: router({
    list: customerProcedure.query(async ({ ctx }) => {
      return await db.getUserAddresses(ctx.user.id);
    }),

    create: customerProcedure
      .input(z.object({
        label: z.string().optional(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        lat: z.number(),
        lng: z.number(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createAddress({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  // Transactions
  transactions: router({
    createTransaction: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        amount: z.number(),
        paymentMethod: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.createTransaction({
          orderId: input.orderId,
          amount: input.amount,
          currency: 'USD',
          status: 'pending',
          paymentMethod: input.paymentMethod,
        });
      }),

    getTransactionByOrderId: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return await db.getTransactionByOrderId(input.orderId);
      }),
  }),

  // Admin reporting
  reporting: router({
    getTodayStats: adminProcedure.query(async () => {
      const deliveries = await db.getTodayDeliveries();
      const totalDeliveries = deliveries.length;
      const totalRevenue = deliveries.reduce((sum, d) => sum + d.totalAmount, 0);
      return { totalDeliveries, totalRevenue };
    }),

    getRepeatCustomers: adminProcedure.query(async () => {
      // Simplified - would need more complex aggregation
      return { repeatCustomerRatio: 0.35 };
    }),
  }),
});

export type AppRouter = typeof appRouter;
