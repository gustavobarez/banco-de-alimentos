import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface Instituicao {
  id: string;
  nome: string;
  endereco: string;
  capacidade: number;
  limiteMensal: number;
}

interface InstituicoesProps {
  instituicoes: Instituicao[];
  onAddInstituicao: (instituicao: Omit<Instituicao, 'id'>) => void;
}

export function Instituicoes({ instituicoes, onAddInstituicao }: InstituicoesProps) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [limiteMensal, setLimiteMensal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddInstituicao({
      nome,
      endereco,
      capacidade: Number(capacidade),
      limiteMensal: Number(limiteMensal),
    });
    
    toast.success('Instituição cadastrada com sucesso!');
    
    // Limpar formulário
    setNome('');
    setEndereco('');
    setCapacidade('');
    setLimiteMensal('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-[#2E7D32]">Cadastro de Instituições Beneficiárias</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <Card className="lg:col-span-1 shadow-md border-none">
          <CardHeader>
            <CardTitle>Nova Instituição</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Instituição</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, bairro, cidade"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade de Recebimento (kg)</Label>
                <Input
                  id="capacidade"
                  type="number"
                  placeholder="Ex: 500"
                  value={capacidade}
                  onChange={(e) => setCapacidade(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="limiteMensal">Limite Mensal de Retirada (kg)</Label>
                <Input
                  id="limiteMensal"
                  type="number"
                  placeholder="Ex: 2000"
                  value={limiteMensal}
                  onChange={(e) => setLimiteMensal(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg shadow-md"
              >
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Instituições */}
        <Card className="lg:col-span-2 shadow-md border-none">
          <CardHeader>
            <CardTitle>Instituições Cadastradas ({instituicoes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {instituicoes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#A5D6A7]">
                      <th className="text-left p-3 rounded-tl-lg">Nome</th>
                      <th className="text-left p-3">Endereço</th>
                      <th className="text-left p-3">Capacidade (kg)</th>
                      <th className="text-left p-3 rounded-tr-lg">Limite Mensal (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instituicoes.map((instituicao, index) => (
                      <tr key={instituicao.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}>
                        <td className="p-3">{instituicao.nome}</td>
                        <td className="p-3">{instituicao.endereco}</td>
                        <td className="p-3">{instituicao.capacidade}</td>
                        <td className="p-3">{instituicao.limiteMensal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhuma instituição cadastrada ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
