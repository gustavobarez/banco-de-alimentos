import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Building } from 'lucide-react';
import { toast } from 'sonner';

interface Doador {
  id: string;
  nome: string;
  tipo: 'PF' | 'PJ';
  telefone: string;
  email: string;
}

interface DoadoresProps {
  doadores: Doador[];
  onAddDoador: (doador: Omit<Doador, 'id'>) => void;
}

export function Doadores({ doadores, onAddDoador }: DoadoresProps) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'PF' | 'PJ'>('PF');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de duplicidade
    const emailExists = doadores.some((d) => d.email === email);
    if (emailExists) {
      toast.error('Este e-mail já está cadastrado!');
      return;
    }

    onAddDoador({ nome, tipo, telefone, email });
    toast.success('Doador cadastrado com sucesso!');
    
    // Limpar formulário
    setNome('');
    setTipo('PF');
    setTelefone('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-[#2E7D32]">Cadastro de Doadores</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <Card className="lg:col-span-1 shadow-md border-none">
          <CardHeader>
            <CardTitle>Novo Doador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setTipo('PF')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      tipo === 'PF'
                        ? 'border-[#2E7D32] bg-[#A5D6A7]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <User size={24} className={tipo === 'PF' ? 'text-[#2E7D32]' : 'text-gray-600'} />
                    <span className="text-sm">Pessoa Física</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo('PJ')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      tipo === 'PJ'
                        ? 'border-[#2E7D32] bg-[#A5D6A7]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Building size={24} className={tipo === 'PJ' ? 'text-[#2E7D32]' : 'text-gray-600'} />
                    <span className="text-sm">Pessoa Jurídica</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg shadow-md"
              >
                Cadastrar Doador
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Doadores */}
        <Card className="lg:col-span-2 shadow-md border-none">
          <CardHeader>
            <CardTitle>Doadores Cadastrados ({doadores.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {doadores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#A5D6A7]">
                      <th className="text-left p-3 rounded-tl-lg">Nome</th>
                      <th className="text-left p-3">Tipo</th>
                      <th className="text-left p-3">Telefone</th>
                      <th className="text-left p-3 rounded-tr-lg">E-mail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doadores.map((doador, index) => (
                      <tr key={doador.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}>
                        <td className="p-3">{doador.nome}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs text-white ${
                              doador.tipo === 'PF' ? 'bg-[#2E7D32]' : 'bg-[#FF9800]'
                            }`}
                          >
                            {doador.tipo}
                          </span>
                        </td>
                        <td className="p-3">{doador.telefone}</td>
                        <td className="p-3">{doador.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhum doador cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
