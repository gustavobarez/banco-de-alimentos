const API_BASE_URL = 'http://localhost:3000';

export interface Donation {
  id: number;
  donorId: number;
  institutionId: number;
  foodType: string;
  quantity: string;
  unit: string;
  expirationDate?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  doador?: {
    id: number;
    name: string;
  };
  instituicao?: {
    id: number;
    name: string;
  };
}

export interface CreateDonationDto {
  donorId: number;
  institutionId: number;
  foodType: string;
  quantity: number;
  unit: string;
  expirationDate?: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

export const donationsService = {
  // GET - Buscar todas as doações
  // Rota: GET /donations
  async getAll(): Promise<Donation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar doações');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar doações:', error);
      throw error;
    }
  },

  // GET - Buscar doações por doador
  // Rota: GET /donations/donor/:id
  async getByDonor(donorId: number): Promise<Donation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/donor/${donorId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar doações do doador');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar doações do doador:', error);
      throw error;
    }
  },

  // GET - Buscar doações por instituição
  // Rota: GET /donations/institution/:id
  async getByInstitution(institutionId: number): Promise<Donation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/institution/${institutionId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar doações da instituição');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar doações da instituição:', error);
      throw error;
    }
  },

  // POST - Criar nova doação
  // Rota: POST /donations
  async create(donation: CreateDonationDto): Promise<Donation> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donation),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar doação');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar doação:', error);
      throw error;
    }
  },

  // PATCH - Atualizar status da doação
  // Rota: PATCH /donations/:id
  async updateStatus(id: number, status: 'pending' | 'completed' | 'cancelled'): Promise<Donation> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar status da doação');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  // DELETE - Deletar doação
  // Rota: DELETE /donations/:id
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar doação');
      }
    } catch (error) {
      console.error('Erro ao deletar doação:', error);
      throw error;
    }
  },
};