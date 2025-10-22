import React from 'react';
import { Users, Building2, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DashboardProps {
  stats: {
    totalDoadores: number;
    totalInstituicoes: number;
    produtosEstoque: number;
    ultimasMovimentacoes: number;
  };
  recentActivity: Array<{
    id: string;
    tipo: string;
    descricao: string;
    data: string;
  }>;
}

export function Dashboard({ stats, recentActivity }: DashboardProps) {
  const cards = [
    {
      title: 'Total de Doadores',
      value: stats.totalDoadores,
      icon: Users,
      color: 'text-[#2E7D32]',
      bgColor: 'bg-[#A5D6A7]',
    },
    {
      title: 'Instituições Beneficiárias',
      value: stats.totalInstituicoes,
      icon: Building2,
      color: 'text-[#FF9800]',
      bgColor: 'bg-[#FFE0B2]',
    },
    {
      title: 'Produtos em Estoque',
      value: stats.produtosEstoque,
      icon: Package,
      color: 'text-[#2E7D32]',
      bgColor: 'bg-[#A5D6A7]',
    },
    {
      title: 'Movimentações (mês)',
      value: stats.ultimasMovimentacoes,
      icon: TrendingUp,
      color: 'text-[#FF9800]',
      bgColor: 'bg-[#FFE0B2]',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-[#2E7D32]">Dashboard</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="shadow-md border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={card.color} size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-[#424242]">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Atividade Recente */}
      <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle>Últimas Doações e Distribuições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          activity.tipo === 'Doação'
                            ? 'bg-[#2E7D32]'
                            : 'bg-[#FF9800]'
                        }`}
                      >
                        {activity.tipo}
                      </span>
                    </div>
                    <p className="text-[#424242]">{activity.descricao}</p>
                  </div>
                  <div className="text-sm text-gray-600">{activity.data}</div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhuma movimentação recente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
