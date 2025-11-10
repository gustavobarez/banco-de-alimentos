const API_BASE_URL = 'http://localhost:3000'; 

export interface Donor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt?: string;
}

export interface CreateDonorDto {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export const donorsService = {
  async getAll(): Promise<Donor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/donors/findAllDonnors`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar doadores');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar doadores:', error);
      throw error;
    }
  },

  async create(donor: CreateDonorDto): Promise<Donor> {
    try {
      const response = await fetch(`${API_BASE_URL}/donors/createDonnor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donor),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar doador');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar doador:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar doador');
      }
    } catch (error) {
      console.error('Erro ao deletar doador:', error);
      throw error;
    }
  },

  async update(id: number, donor: Partial<CreateDonorDto>): Promise<Donor> {
    try {
      const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donor),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar doador');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar doador:', error);
      throw error;
    }
  },
};