import { Injectable } from '@nestjs/common';
import { db } from '../db/database.module'; 
import { donors } from '../db/schema'; 
import { eq } from 'drizzle-orm';

@Injectable()
export class DonorsService {
  async findAll() {
    return await db.select().from(donors);
  }

  async findOne(id: number) {
    const result = await db.select().from(donors).where(eq(donors.id, id));
    return result[0];
  }

  async create(data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  }) {
    const result = await db.insert(donors).values(data).returning();
    return result[0];
  }

  async update(id: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) {
    const result = await db
      .update(donors)
      .set(data)
      .where(eq(donors.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    await db.delete(donors).where(eq(donors.id, id));
    return { message: 'Doador deletado com sucesso' };
  }
}