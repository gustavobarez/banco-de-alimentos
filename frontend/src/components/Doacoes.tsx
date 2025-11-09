import { Gift } from "lucide-react";
import { useEffect, useState } from "react";

interface Doacao {
  id: number;
  doador: {
    id: number;
    name: string;
  };
  instituicao: {
    id: number;
    name: string;
  };
  foodType: string;
  quantity: number;
  unit: string;
  status: string;
  createdAt: string;
  expirationDate?: string;
}

export function Doacoes() {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoacoes();
  }, []);

  const fetchDoacoes = async () => {
    try {
      const response = await fetch("http://localhost:3000/donations");
      if (!response.ok) {
        throw new Error("Erro ao carregar doações");
      }
      const data = await response.json();
      setDoacoes(data);
      setLoading(false);
    } catch (error) {
      setError("Erro ao carregar as doações. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#2E7D32]">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-8 h-8 text-[#2E7D32]" />
          <h1 className="text-2xl font-semibold text-[#1B5E20]">Doações</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#E8F5E9] text-[#2E7D32]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Doador
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Instituição
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Alimento
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doacoes.map((doacao) => (
                <tr key={doacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doacao.doador.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doacao.instituicao.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doacao.foodType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doacao.quantity} {doacao.unit}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${
                        doacao.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                      ${
                        doacao.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                      ${
                        doacao.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : ""
                      }`}
                    >
                      {doacao.status === "pending" ? "Pendente" : ""}
                      {doacao.status === "completed" ? "Concluída" : ""}
                      {doacao.status === "cancelled" ? "Cancelada" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(doacao.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
