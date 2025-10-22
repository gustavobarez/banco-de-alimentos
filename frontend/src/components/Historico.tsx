import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filter } from 'lucide-react';

interface Distribuicao {
  id: string;
  instituicao: string;
  dataEntrega: string;
  produtos: string;
  quantidade: number;
  status: 'entregue' | 'pendente' | 'em-transito';
}

interface HistoricoProps {
  distribuicoes: Distribuicao[];
}

export function Historico({ distribuicoes }: HistoricoProps) {
  const [filtroInstituicao, setFiltroInstituicao] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('');

  const instituicoesUnicas = Array.from(new Set(distribuicoes.map((d) => d.instituicao)));

  const distribuicoesFiltradas = distribuicoes.filter((dist) => {
    const matchInstituicao = filtroInstituicao === 'todas' || dist.instituicao === filtroInstituicao;
    const matchStatus = filtroStatus === 'todos' || dist.status === filtroStatus;
    const matchData = !filtroData || dist.dataEntrega.includes(filtroData);
    return matchInstituicao && matchStatus && matchData;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue':
        return 'bg-[#2E7D32]';
      case 'em-transito':
        return 'bg-[#FF9800]';
      case 'pendente':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'entregue':
        return 'Entregue';
      case 'em-transito':
        return 'Em Trânsito';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-[#2E7D32]">Histórico de Distribuições</h1>

      {/* Filtros */}
      <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtroInstituicao">Instituição</Label>
              <Select value={filtroInstituicao} onValueChange={setFiltroInstituicao}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {instituicoesUnicas.map((inst) => (
                    <SelectItem key={inst} value={inst}>
                      {inst}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtroStatus">Status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="em-transito">Em Trânsito</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtroData">Data</Label>
              <Input
                id="filtroData"
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Distribuições */}
      <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle>
            Distribuições ({distribuicoesFiltradas.length} de {distribuicoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {distribuicoesFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#A5D6A7]">
                    <th className="text-left p-3 rounded-tl-lg">Instituição</th>
                    <th className="text-left p-3">Data de Entrega</th>
                    <th className="text-left p-3">Produtos</th>
                    <th className="text-left p-3">Quantidade (kg)</th>
                    <th className="text-left p-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {distribuicoesFiltradas.map((dist, index) => (
                    <tr key={dist.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}>
                      <td className="p-3">{dist.instituicao}</td>
                      <td className="p-3">{dist.dataEntrega}</td>
                      <td className="p-3">{dist.produtos}</td>
                      <td className="p-3">{dist.quantidade}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(dist.status)}`}>
                          {getStatusLabel(dist.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Nenhuma distribuição encontrada com os filtros aplicados
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
