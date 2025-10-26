import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Gift, Trash2, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { donationsService, type Donation } from '../services/donations.service';
import { donorsService } from '../services/donors.service';
import { institutionsService } from '../services/institutions.service';

export function Doacoes() {
  const [doacoes, setDoacoes] = useState<Donation[]>([]);
  const [doadores, setDoadores] = useState<any[]>([]);
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states - De acordo com o schema
  const [donorId, setDonorId] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [expirationDate, setExpirationDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [doacoesData, doadoresData, instituicoesData] = await Promise.all([
        donationsService.getAll(),
        donorsService.getAll(),
        institutionsService.getAll(),
      ]);
      
      setDoacoes(doacoesData);
      setDoadores(doadoresData);
      setInstituicoes(instituicoesData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donorId || !institutionId) {
      toast.error('Selecione um doador e uma instituição');
      return;
    }

    setSubmitting(true);
    try {
      const donationData = {
        donorId: Number(donorId),
        institutionId: Number(institutionId),
        foodType,
        quantity: Number(quantity),
        unit,
        ...(expirationDate && { expirationDate }), // Só envia se tiver valor
      };
      
      console.log('Dados enviados:', donationData);
      
      await donationsService.create(donationData);

      toast.success('Doação registrada com sucesso!');

      // Limpar formulário
      setDonorId('');
      setInstitutionId('');
      setFoodType('');
      setQuantity('');
      setUnit('kg');
      setExpirationDate('');

      // Recarregar lista
      await loadData();
    } catch (error) {
      toast.error('Erro ao registrar doação');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: 'pending' | 'completed' | 'cancelled'
  ) => {
    try {
      await donationsService.updateStatus(id, status);
      toast.success('Status atualizado com sucesso!');
      await loadData();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir esta doação?')) {
      return;
    }

    try {
      await donationsService.delete(id);
      toast.success('Doação excluída com sucesso!');
      await loadData();
    } catch (error) {
      toast.error('Erro ao excluir doação');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        className: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="h-3 w-3 mr-1" />,
        text: 'Pendente',
      },
      completed: {
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        text: 'Concluída',
      },
      cancelled: {
        className: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-3 w-3 mr-1" />,
        text: 'Cancelada',
      },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2E7D32]">Gestão de Doações</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Cadastro */}
        <Card className="lg:col-span-1 shadow-md border-none">
          <CardHeader>
            <CardTitle>Nova Doação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo: Doador */}
              <div className="space-y-2">
                <Label htmlFor="doador">Doador *</Label>
                <select
                  id="doador"
                  value={donorId}
                  onChange={(e) => setDonorId(e.target.value)}
                  required
                  disabled={submitting || loading}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7D32] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione um doador</option>
                  {doadores.map((doador) => (
                    <option key={doador.id} value={doador.id}>
                      {doador.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo: Instituição */}
              <div className="space-y-2">
                <Label htmlFor="instituicao">Instituição Beneficiária *</Label>
                <select
                  id="instituicao"
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  required
                  disabled={submitting || loading}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7D32] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione uma instituição</option>
                  {instituicoes.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo: Tipo de Alimento */}
              <div className="space-y-2">
                <Label htmlFor="foodType">Tipo de Alimento *</Label>
                <Input
                  id="foodType"
                  placeholder="Ex: Arroz, Feijão, Leite, Óleo"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Campos: Quantidade e Unidade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade *</Label>
                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    required
                    disabled={submitting}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7D32] h-10"
                  >
                    <option value="kg">Quilogramas (kg)</option>
                    <option value="lt">Litros (lt)</option>
                    <option value="un">Unidades (un)</option>
                    <option value="cx">Caixas (cx)</option>
                    <option value="pc">Pacotes (pc)</option>
                  </select>
                </div>
              </div>

              {/* Campo: Data de Validade */}
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Data de Validade (opcional)</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  disabled={submitting}
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500">
                  Deixe em branco se o alimento não for perecível
                </p>
              </div>

              {/* Botão de Envio */}
              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg shadow-md"
                disabled={submitting || loading}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrar Doação'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Doações */}
        <Card className="lg:col-span-2 shadow-md border-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Doações Registradas ({doacoes.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Atualizar'
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />
              </div>
            ) : doacoes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#A5D6A7]">
                      <th className="text-left p-3 rounded-tl-lg">Doador</th>
                      <th className="text-left p-3">Instituição</th>
                      <th className="text-left p-3">Alimento</th>
                      <th className="text-left p-3">Quantidade</th>
                      <th className="text-left p-3">Validade</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Data</th>
                      <th className="text-left p-3 rounded-tr-lg">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doacoes.map((doacao, index) => (
                      <tr
                        key={doacao.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}
                      >
                        <td className="p-3 font-medium">
                          {doacao.doador?.name || 'N/A'}
                        </td>
                        <td className="p-3">
                          {doacao.instituicao?.name || 'N/A'}
                        </td>
                        <td className="p-3">{doacao.foodType}</td>
                        <td className="p-3">
                          {doacao.quantity} {doacao.unit}
                        </td>
                        <td className="p-3">
                          {doacao.expirationDate
                            ? new Date(doacao.expirationDate).toLocaleDateString('pt-BR')
                            : '-'}
                        </td>
                        <td className="p-3">{getStatusBadge(doacao.status)}</td>
                        <td className="p-3">
                          {new Date(doacao.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {doacao.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(doacao.id, 'completed')
                                  }
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Concluir"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(doacao.id, 'cancelled')
                                  }
                                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                  title="Cancelar"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(doacao.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Nenhuma doação registrada ainda</p>
                <p className="text-sm text-gray-400 mt-1">
                  Cadastre doadores e instituições primeiro
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}