import { eq, and, desc, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, orders, drivers, referrals, promos, addresses, transactions, deliveryHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.active, true));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Order queries
export async function createOrder(order: any) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(orders).values(order);
  return result;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByOrderId(orderId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCustomerOrders(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
}

export async function assignOrderToDriver(orderId: number, driverId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(orders).set({ assignedDriverId: driverId, status: 'assigned' }).where(eq(orders.id, orderId));
}

export async function updateOrderETA(orderId: number, eta: Date) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(orders).set({ eta }).where(eq(orders.id, orderId));
}

// Driver queries
export async function getDriverByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(drivers).where(eq(drivers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllDrivers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(drivers);
}

export async function updateDriverLocation(driverId: number, lat: number, lng: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(drivers).set({ lat: lat as any, lng: lng as any, lastLocationUpdate: new Date() }).where(eq(drivers.id, driverId));
}

export async function updateDriverStatus(driverId: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(drivers).set({ status: status as any }).where(eq(drivers.id, driverId));
}

// Referral queries
export async function getReferralByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(referrals).where(eq(referrals.code, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createReferral(referral: any) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(referrals).values(referral);
}

export async function updateReferralUsage(referralId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(referrals).set({ usageCount: (referrals.usageCount as any) + 1 }).where(eq(referrals.id, referralId));
}

// Promo queries
export async function getPromoByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(promos).where(and(eq(promos.code, code), eq(promos.active, true))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Address queries
export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(addresses).where(eq(addresses.userId, userId));
}

export async function createAddress(address: any) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(addresses).values(address);
}

// Transaction queries
export async function createTransaction(transaction: any) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(transactions).values(transaction);
}

export async function getTransactionByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(transactions).where(eq(transactions.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Delivery history queries
export async function createDeliveryHistory(history: any) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(deliveryHistory).values(history);
}

export async function getDeliveryHistoryByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(deliveryHistory).where(eq(deliveryHistory.orderId, orderId)).orderBy(desc(deliveryHistory.createdAt));
}

// Reporting queries
export async function getTodayDeliveries() {
  const db = await getDb();
  if (!db) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return await db.select().from(orders).where(and(
    gte(orders.createdAt, today),
    lte(orders.createdAt, tomorrow),
    eq(orders.status, 'delivered')
  ));
}

export async function getRepeatCustomers() {
  const db = await getDb();
  if (!db) return [];
  // This would require a more complex query, simplified for now
  return await db.select().from(orders);
}
