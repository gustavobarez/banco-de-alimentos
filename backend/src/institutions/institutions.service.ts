import { Injectable } from '@nestjs/common';
import { InferInsertModel } from 'drizzle-orm';
import { db } from 'src/db/database.module';
import { institutions } from 'src/db/schema';

@Injectable()
export class InstitutionsService {
      async findAll() {
            return db.select().from(institutions)
        }
    
        async create(institutionsData: InferInsertModel <typeof institutions>) {
            const result = await db.insert(institutions).values(institutionsData).returning();
            return result[0];
        }
}
