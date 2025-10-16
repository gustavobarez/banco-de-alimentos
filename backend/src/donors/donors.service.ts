import { Injectable } from '@nestjs/common';
import { InferInsertModel } from 'drizzle-orm';
import { db } from 'src/db/database.module';
import { donors } from 'src/db/schema';

@Injectable()
export class DonorsService {

    async findAll() {
        return db.select().from(donors)
    }

    async create(donnorData: InferInsertModel <typeof donors>) {
        const result = await db.insert(donors).values(donnorData).returning();
        return result[0];
    }
}
