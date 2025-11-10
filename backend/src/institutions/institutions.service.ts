import { Injectable } from '@nestjs/common';
import { db } from '../db/database.module'; 
import { institutions } from '../db/schema'; 
import { eq } from 'drizzle-orm';

@Injectable()
export class InstitutionsService {
  async findAll() {
    try {
      return await db.select().from(institutions);
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await db
        .select()
        .from(institutions)
        .where(eq(institutions.id, id));
      
      if (!result || result.length === 0) {
        throw new Error(`Instituição com ID ${id} não encontrada`);
      }
      
      return result[0];
    } catch (error) {
      console.error(`Erro ao buscar instituição ${id}:`, error);
      throw error;
    }
  }

  async create(data: {
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    address: string;
    responsiblePerson: string;
  }) {
    try {
      const existingCnpj = await db
        .select()
        .from(institutions)
        .where(eq(institutions.cnpj, data.cnpj));
      
      if (existingCnpj && existingCnpj.length > 0) {
        throw new Error('CNPJ já cadastrado');
      }

      const existingEmail = await db
        .select()
        .from(institutions)
        .where(eq(institutions.email, data.email));
      
      if (existingEmail && existingEmail.length > 0) {
        throw new Error('E-mail já cadastrado');
      }

      const result = await db
        .insert(institutions)
        .values(data)
        .returning();
      
      console.log('Instituição criada:', result[0]);
      return result[0];
    } catch (error) {
      console.error('Erro ao criar instituição:', error);
      throw error;
    }
  }

  async update(id: number, data: {
    name?: string;
    cnpj?: string;
    email?: string;
    phone?: string;
    address?: string;
    responsiblePerson?: string;
  }) {
    try {
      await this.findOne(id);

      if (data.cnpj) {
        const existingCnpj = await db
          .select()
          .from(institutions)
          .where(eq(institutions.cnpj, data.cnpj));
        
        if (existingCnpj && existingCnpj.length > 0 && existingCnpj[0].id !== id) {
          throw new Error('CNPJ já cadastrado em outra instituição');
        }
      }

      if (data.email) {
        const existingEmail = await db
          .select()
          .from(institutions)
          .where(eq(institutions.email, data.email));
        
        if (existingEmail && existingEmail.length > 0 && existingEmail[0].id !== id) {
          throw new Error('E-mail já cadastrado em outra instituição');
        }
      }

      const result = await db
        .update(institutions)
        .set(data)
        .where(eq(institutions.id, id))
        .returning();
      
      console.log('Instituição atualizada:', result[0]);
      return result[0];
    } catch (error) {
      console.error(`Erro ao atualizar instituição ${id}:`, error);
      throw error;
    }
  }

  // Deletar instituição
  async delete(id: number) {
    try {
      await this.findOne(id);

      await db.delete(institutions).where(eq(institutions.id, id));
      
      console.log(`Instituição ${id} deletada com sucesso`);
      return { 
        success: true,
        message: 'Instituição deletada com sucesso' 
      };
    } catch (error) {
      console.error(`Erro ao deletar instituição ${id}:`, error);
      throw error;
    }
  }

  // Buscar por CNPJ
  async findByCnpj(cnpj: string) {
    try {
      const result = await db
        .select()
        .from(institutions)
        .where(eq(institutions.cnpj, cnpj));
      
      return result[0] || null;
    } catch (error) {
      console.error('Erro ao buscar instituição por CNPJ:', error);
      throw error;
    }
  }

  // Buscar por Email
  async findByEmail(email: string) {
    try {
      const result = await db
        .select()
        .from(institutions)
        .where(eq(institutions.email, email));
      
      return result[0] || null;
    } catch (error) {
      console.error('Erro ao buscar instituição por email:', error);
      throw error;
    }
  }
}