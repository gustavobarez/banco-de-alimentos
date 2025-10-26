import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/database.module'; 
import { donations, donors, institutions } from '../db/schema'; 
import { eq } from 'drizzle-orm';

@Injectable()
export class DonationsService {
  async findAll() {
    try {
      const result = await db
        .select({
          id: donations.id,
          donorId: donations.donorId,
          institutionId: donations.institutionId,
          foodType: donations.foodType,
          quantity: donations.quantity,
          unit: donations.unit,
          expirationDate: donations.expirationDate,
          status: donations.status,
          createdAt: donations.createdAt,
          doador: {
            id: donors.id,
            name: donors.name,
          },
          instituicao: {
            id: institutions.id,
            name: institutions.name,
          },
        })
        .from(donations)
        .leftJoin(donors, eq(donations.donorId, donors.id))
        .leftJoin(institutions, eq(donations.institutionId, institutions.id))
        .orderBy(donations.createdAt);

      return result;
    } catch (error) {
      console.error('Erro ao buscar doações:', error);
      throw error;
    }
  }

  async findByDonor(donorId: number) {
    try {
      const result = await db
        .select({
          id: donations.id,
          donorId: donations.donorId,
          institutionId: donations.institutionId,
          foodType: donations.foodType,
          quantity: donations.quantity,
          unit: donations.unit,
          expirationDate: donations.expirationDate,
          status: donations.status,
          createdAt: donations.createdAt,
          doador: {
            id: donors.id,
            name: donors.name,
          },
          instituicao: {
            id: institutions.id,
            name: institutions.name,
          },
        })
        .from(donations)
        .leftJoin(donors, eq(donations.donorId, donors.id))
        .leftJoin(institutions, eq(donations.institutionId, institutions.id))
        .where(eq(donations.donorId, donorId))
        .orderBy(donations.createdAt);

      return result;
    } catch (error) {
      console.error(`Erro ao buscar doações do doador ${donorId}:`, error);
      throw error;
    }
  }

  async findByInstitution(institutionId: number) {
    try {
      const result = await db
        .select({
          id: donations.id,
          donorId: donations.donorId,
          institutionId: donations.institutionId,
          foodType: donations.foodType,
          quantity: donations.quantity,
          unit: donations.unit,
          expirationDate: donations.expirationDate,
          status: donations.status,
          createdAt: donations.createdAt,
          doador: {
            id: donors.id,
            name: donors.name,
          },
          instituicao: {
            id: institutions.id,
            name: institutions.name,
          },
        })
        .from(donations)
        .leftJoin(donors, eq(donations.donorId, donors.id))
        .leftJoin(institutions, eq(donations.institutionId, institutions.id))
        .where(eq(donations.institutionId, institutionId))
        .orderBy(donations.createdAt);

      return result;
    } catch (error) {
      console.error(
        `Erro ao buscar doações da instituição ${institutionId}:`,
        error,
      );
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await db
        .select({
          id: donations.id,
          donorId: donations.donorId,
          institutionId: donations.institutionId,
          foodType: donations.foodType,
          quantity: donations.quantity,
          unit: donations.unit,
          expirationDate: donations.expirationDate,
          status: donations.status,
          createdAt: donations.createdAt,
          doador: {
            id: donors.id,
            name: donors.name,
          },
          instituicao: {
            id: institutions.id,
            name: institutions.name,
          },
        })
        .from(donations)
        .leftJoin(donors, eq(donations.donorId, donors.id))
        .leftJoin(institutions, eq(donations.institutionId, institutions.id))
        .where(eq(donations.id, id));

      if (!result || result.length === 0) {
        throw new NotFoundException(`Doação com ID ${id} não encontrada`);
      }

      return result[0];
    } catch (error) {
      console.error(`Erro ao buscar doação ${id}:`, error);
      throw error;
    }
  }

  async create(data: {
    donorId: number;
    institutionId: number;
    foodType: string;
    quantity: number; 
    unit: string;
    expirationDate?: string;
  }) {
    try {
      const donor = await db
        .select()
        .from(donors)
        .where(eq(donors.id, data.donorId));
      if (!donor || donor.length === 0) {
        throw new NotFoundException(
          `Doador com ID ${data.donorId} não encontrado`,
        );
      }

      const institution = await db
        .select()
        .from(institutions)
        .where(eq(institutions.id, data.institutionId));
      if (!institution || institution.length === 0) {
        throw new NotFoundException(
          `Instituição com ID ${data.institutionId} não encontrada`,
        );
      }

      const result = await db
        .insert(donations)
        .values({
          donorId: data.donorId,
          institutionId: data.institutionId,
          foodType: data.foodType,
          quantity: data.quantity.toString(), 
          unit: data.unit, // ✅ ADICIONADO
          expirationDate: data.expirationDate || null,
          status: 'pending',
        })
        .returning();

      console.log('Doação criada:', result[0]);
      return result[0];
    } catch (error) {
      console.error('Erro ao criar doação:', error);
      throw error;
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      await this.findOne(id);

      const validStatuses = ['pending', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error(
          `Status inválido. Use: ${validStatuses.join(', ')}`,
        );
      }

      const result = await db
        .update(donations)
        .set({ status })
        .where(eq(donations.id, id))
        .returning();

      console.log(`Status da doação ${id} atualizado para ${status}`);
      return result[0];
    } catch (error) {
      console.error(`Erro ao atualizar status da doação ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number) {
    try {
      await this.findOne(id);

      await db.delete(donations).where(eq(donations.id, id));

      console.log(`Doação ${id} deletada com sucesso`);
      return {
        success: true,
        message: 'Doação deletada com sucesso',
      };
    } catch (error) {
      console.error(`Erro ao deletar doação ${id}:`, error);
      throw error;
    }
  }

  async getStatistics() {
    try {
      const allDonations = await db.select().from(donations);

      const stats = {
        total: allDonations.length,
        pending: allDonations.filter((d) => d.status === 'pending').length,
        completed: allDonations.filter((d) => d.status === 'completed').length,
        cancelled: allDonations.filter((d) => d.status === 'cancelled').length,
      };

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}