import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building2, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { institutionsService, type Institution } from '../services/institutions.service';

export function Instituicoes() {
  const [instituicoes, setInstituicoes] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [responsavel, setResponsavel] = useState('');

  // Carregar instituições ao montar o componente
  useEffect(() => {
    loadInstituicoes();
  }, []);

  const loadInstituicoes = async () => {
    setLoading(true);
    try {
      const data = await institutionsService.getAll();
      setInstituicoes(data);
    } catch (error) {
      toast.error('Erro ao carregar instituições');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }
    return value;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de duplicidade de CNPJ
    const cnpjExists = instituicoes.some((i) => i.cnpj === cnpj);
    if (cnpjExists) {
      toast.error('Este CNPJ já está cadastrado!');
      return;
    }

    // Validação de duplicidade de email
    const emailExists = instituicoes.some((i) => i.email === email);
    if (emailExists) {
      toast.error('Este e-mail já está cadastrado!');
      return;
    }

    setSubmitting(true);
    try {
      await institutionsService.create({
        name: nome,
        cnpj,
        email,
        phone: telefone,
        address: endereco,
        responsiblePerson: responsavel,
      });

      toast.success('Instituição cadastrada com sucesso!');

      // Limpar formulário
      setNome('');
      setCnpj('');
      setEmail('');
      setTelefone('');
      setEndereco('');
      setResponsavel('');

      // Recarregar lista
      await loadInstituicoes();
    } catch (error) {
      toast.error('Erro ao cadastrar instituição');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Deseja realmente excluir a instituição ${nome}?`)) {
      return;
    }

    try {
      await institutionsService.delete(id);
      toast.success('Instituição excluída com sucesso!');
      await loadInstituicoes();
    } catch (error) {
      toast.error('Erro ao excluir instituição');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2E7D32]">Cadastro de Instituições Beneficiárias</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <Card className="lg:col-span-1 shadow-md border-none">
          <CardHeader>
            <CardTitle>Nova Instituição</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Instituição *</Label>
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
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={handleCNPJChange}
                  required
                  disabled={submitting}
                  maxLength={18}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@instituicao.com"
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
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, bairro, cidade"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Pessoa Responsável *</Label>
                <Input
                  id="responsavel"
                  placeholder="Nome do responsável"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  required
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
                  'Salvar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Instituições */}
        <Card className="lg:col-span-2 shadow-md border-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Instituições Cadastradas ({instituicoes.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadInstituicoes}
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
            ) : instituicoes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#A5D6A7]">
                      <th className="text-left p-3 rounded-tl-lg">Nome</th>
                      <th className="text-left p-3">CNPJ</th>
                      <th className="text-left p-3">E-mail</th>
                      <th className="text-left p-3">Telefone</th>
                      <th className="text-left p-3">Responsável</th>
                      <th className="text-left p-3 rounded-tr-lg">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instituicoes.map((instituicao, index) => (
                      <tr
                        key={instituicao.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}
                      >
                        <td className="p-3 font-medium">{instituicao.name}</td>
                        <td className="p-3">{instituicao.cnpj}</td>
                        <td className="p-3">{instituicao.email}</td>
                        <td className="p-3">{instituicao.phone}</td>
                        <td className="p-3">{instituicao.responsiblePerson}</td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(instituicao.id, instituicao.name)}
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
                <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Nenhuma instituição cadastrada ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}