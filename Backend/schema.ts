import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with additional fields for cannabis delivery platform.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "driver", "customer"]).default("customer").notNull(),
  referralCode: varchar("referralCode", { length: 16 }).unique(),
  referredBy: varchar("referredBy", { length: 16 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for cannabis delivery catalog
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(), // indica, sativa, concentrate, vape
  description: text("description"),
  price: int("price").notNull(), // in cents
  quantity: varchar("quantity", { length: 64 }).notNull(), // 0.5 oz, 7g, 1g, etc
  imageUrl: text("imageUrl"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table for tracking customer orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderId: varchar("orderId", { length: 32 }).notNull().unique(), // Custom order ID
  customerId: int("customerId").notNull(),
  items: json("items").notNull(), // Array of {productId, quantity, price}
  totalAmount: int("totalAmount").notNull(), // in cents
  status: mysqlEnum("status", ["pending", "assigned", "enroute", "delivered", "cancelled"]).default("pending").notNull(),
  deliveryAddress: text("deliveryAddress").notNull(),
  deliveryLat: decimal("deliveryLat", { precision: 10, scale: 8 }),
  deliveryLng: decimal("deliveryLng", { precision: 11, scale: 8 }),
  windowStart: timestamp("windowStart"),
  windowEnd: timestamp("windowEnd"),
  assignedDriverId: int("assignedDriverId"),
  nextUpLinkToken: varchar("nextUpLinkToken", { length: 255 }),
  eta: timestamp("eta"),
  appliedPromoCode: varchar("appliedPromoCode", { length: 64 }),
  appliedReferralCode: varchar("appliedReferralCode", { length: 16 }),
  discount: int("discount").default(0), // in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Driver status and location tracking
 */
export const drivers = mysqlTable("drivers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  status: mysqlEnum("status", ["idle", "enroute", "delivering"]).default("idle").notNull(),
  currentOrderId: int("currentOrderId"),
  lat: decimal("lat", { precision: 10, scale: 8 }),
  lng: decimal("lng", { precision: 11, scale: 8 }),
  lastLocationUpdate: timestamp("lastLocationUpdate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = typeof drivers.$inferInsert;

/**
 * Referral tracking and credits
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 16 }).notNull().unique(),
  referrerId: int("referrerId").notNull(),
  referredUserIds: json("referredUserIds").notNull(), // Array of user IDs
  creditAmount: int("creditAmount").notNull(), // in cents
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Promo codes and promotions
 */
export const promos = mysqlTable("promos", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  discountAmount: int("discountAmount").notNull(), // in cents
  discountPercent: int("discountPercent").default(0), // percentage discount
  minOrderAmount: int("minOrderAmount").default(0), // in cents
  maxUses: int("maxUses"),
  currentUses: int("currentUses").default(0).notNull(),
  expiresAt: timestamp("expiresAt"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Promo = typeof promos.$inferSelect;
export type InsertPromo = typeof promos.$inferInsert;

/**
 * Saved addresses for customers
 */
export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  label: varchar("label", { length: 64 }), // Home, Work, etc
  street: text("street").notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 64 }).notNull(),
  zipCode: varchar("zipCode", { length: 16 }).notNull(),
  lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
  lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

/**
 * Payment transactions
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }), // helcim, card, etc
  transactionId: varchar("transactionId", { length: 255 }),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Delivery tracking history
 */
export const deliveryHistory = mysqlTable("deliveryHistory", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  driverId: int("driverId").notNull(),
  status: varchar("status", { length: 64 }).notNull(), // pending, assigned, started, enroute, delivered
  eta: timestamp("eta"),
  actualDeliveryTime: timestamp("actualDeliveryTime"),
  driverLat: decimal("driverLat", { precision: 10, scale: 8 }),
  driverLng: decimal("driverLng", { precision: 11, scale: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeliveryHistory = typeof deliveryHistory.$inferSelect;
export type InsertDeliveryHistory = typeof deliveryHistory.$inferInsert;
