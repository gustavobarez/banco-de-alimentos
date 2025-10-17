import { Injectable } from '@nestjs/common';
import { InferInsertModel, eq } from 'drizzle-orm';
import { db } from 'src/db/database.module';
import { donations } from 'src/db/schema';

@Injectable()
export class DonationsService {
  async findAll() {
    return db.select().from(donations);
  }

  async findByInstitution(institutionId: number) {
    return db.select().from(donations).where(eq(donations.institutionId, institutionId));
  }

  async findByDonor(donorId: number) {
    return db.select().from(donations).where(eq(donations.donorId, donorId));
  }

  async create(donationData: InferInsertModel<typeof donations>) {
    const result = await db.insert(donations).values(donationData).returning();
    return result[0];
  }

  async updateStatus(id: number, status: string) {
    const result = await db
      .update(donations)
      .set({ status })
      .where(eq(donations.id, id))
      .returning();

    return result[0];
  }

  async delete(id: number) {
    const result = await db.delete(donations).where(eq(donations.id, id)).returning();
    return result[0];
  }
}
