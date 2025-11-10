import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { donorsService, type Donor } from '../services/donors.service';

export function Doadores() {
  const [doadores, setDoadores] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    loadDoadores();
  }, []);

  const loadDoadores = async () => {
    setLoading(true);
    try {
      const data = await donorsService.getAll();
      setDoadores(data);
    } catch (error) {
      toast.error('Erro ao carregar doadores');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailExists = doadores.some((d) => d.email === email);
    if (emailExists) {
      toast.error('Este e-mail já está cadastrado!');
      return;
    }

    setSubmitting(true);
    try {
      await donorsService.create({
        name: nome,
        email,
        phone: telefone,
        address: endereco || undefined,
      });

      toast.success('Doador cadastrado com sucesso!');
      
      setNome('');
      setTelefone('');
      setEmail('');
      setEndereco('');
      
      await loadDoadores();
    } catch (error) {
      toast.error('Erro ao cadastrar doador');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Deseja realmente excluir o doador ${nome}?`)) {
      return;
    }

    try {
      await donorsService.delete(id);
      toast.success('Doador excluído com sucesso!');
      await loadDoadores();
    } catch (error) {
      toast.error('Erro ao excluir doador');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2E7D32]">Cadastro de Doadores</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <Card className="lg:col-span-1 shadow-md border-none">
          <CardHeader>
            <CardTitle>Novo Doador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Endereço completo (opcional)"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg shadow-md"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Doador'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Doadores */}
        <Card className="lg:col-span-2 shadow-md border-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Doadores Cadastrados ({doadores.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadDoadores}
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
            ) : doadores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#A5D6A7]">
                      <th className="text-left p-3 rounded-tl-lg">Nome</th>
                      <th className="text-left p-3">E-mail</th>
                      <th className="text-left p-3">Telefone</th>
                      <th className="text-left p-3">Endereço</th>
                      <th className="text-left p-3 rounded-tr-lg">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doadores.map((doador, index) => (
                      <tr key={doador.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}>
                        <td className="p-3 font-medium">{doador.name}</td>
                        <td className="p-3">{doador.email}</td>
                        <td className="p-3">{doador.phone}</td>
                        <td className="p-3">{doador.address || '-'}</td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doador.id, doador.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Nenhum doador cadastrado ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}