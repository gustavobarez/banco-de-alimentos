const API_BASE_URL = 'http://localhost:3000'; 
export interface Institution {
  id: number;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  responsiblePerson: string;
  createdAt?: string;
}

export interface CreateInstitutionDto {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  responsiblePerson: string;
}

export const institutionsService = {
  async getAll(): Promise<Institution[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/institutions/findAllInstitutions`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar instituições');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      throw error;
    }
  },

  async create(institution: CreateInstitutionDto): Promise<Institution> {
    try {
      const response = await fetch(`${API_BASE_URL}/institutions/createInstitution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(institution),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar instituição');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar instituição:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/institutions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar instituição');
      }
    } catch (error) {
      console.error('Erro ao deletar instituição:', error);
      throw error;
    }
  },

  async update(id: number, institution: Partial<CreateInstitutionDto>): Promise<Institution> {
    try {
      const response = await fetch(`${API_BASE_URL}/institutions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(institution),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar instituição');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar instituição:', error);
      throw error;
    }
  },
};