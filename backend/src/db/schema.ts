/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  date,
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const donors = pgTable(
  'donors',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    address: varchar('address', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('donors_email_idx').on(table.email),
  }),
);

export const institutions = pgTable(
  'institutions',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    cnpj: varchar('cnpj', { length: 18 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    address: varchar('address', { length: 500 }).notNull(),
    responsiblePerson: varchar('responsible_person', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    cnpjIdx: uniqueIndex('institutions_cnpj_idx').on(table.cnpj),
    emailIdx: uniqueIndex('institutions_email_idx').on(table.email),
  }),
);

export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  donorId: integer('donor_id')
    .notNull()
    .references(() => donors.id, { onDelete: 'cascade' }),
  institutionId: integer('institution_id')
    .notNull()
    .references(() => institutions.id, { onDelete: 'cascade' }),
  foodType: varchar('food_type', { length: 255 }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  expirationDate: date('expiration_date'),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
