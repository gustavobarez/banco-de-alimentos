import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Produto {
  id: string;
  nome: string;
  categoria: 'perecivel' | 'nao-perecivel';
  unidade: string;
  quantidade: number;
  dataValidade?: string;
}

interface Movimentacao {
  id: string;
  tipo: 'entrada' | 'saida';
  produto: string;
  quantidade: number;
  data: string;
  responsavel: string;
}

interface EstoqueProps {
  produtos: Produto[];
  movimentacoes: Movimentacao[];
  onAddProduto: (produto: Omit<Produto, 'id'>) => void;
  onAddMovimentacao: (movimentacao: Omit<Movimentacao, 'id'>) => void;
}

export function Estoque({ produtos, movimentacoes, onAddProduto, onAddMovimentacao }: EstoqueProps) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<'perecivel' | 'nao-perecivel'>('nao-perecivel');
  const [unidade, setUnidade] = useState('kg');
  const [quantidade, setQuantidade] = useState('');
  const [dataValidade, setDataValidade] = useState('');

  const [tipoMov, setTipoMov] = useState<'entrada' | 'saida'>('entrada');
  const [produtoMov, setProdutoMov] = useState('');
  const [quantidadeMov, setQuantidadeMov] = useState('');
  const [responsavel, setResponsavel] = useState('');

  const handleAddProduto = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddProduto({
      nome,
      categoria,
      unidade,
      quantidade: Number(quantidade),
      dataValidade: dataValidade || undefined,
    });
    
    toast.success('Produto cadastrado com sucesso!');
    
    setNome('');
    setCategoria('nao-perecivel');
    setUnidade('kg');
    setQuantidade('');
    setDataValidade('');
  };

  const handleAddMovimentacao = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddMovimentacao({
      tipo: tipoMov,
      produto: produtoMov,
      quantidade: Number(quantidadeMov),
      data: new Date().toLocaleDateString('pt-BR'),
      responsavel,
    });
    
    toast.success(`${tipoMov === 'entrada' ? 'Doação' : 'Distribuição'} registrada com sucesso!`);
    
    setProdutoMov('');
    setQuantidadeMov('');
    setResponsavel('');
  };

  const estoqueTotal = produtos.reduce((acc, p) => acc + p.quantidade, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[#2E7D32]">Controle de Estoque</h1>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
          <Package className="text-[#2E7D32]" size={20} />
          <span>Estoque Total: <strong>{estoqueTotal} kg</strong></span>
        </div>
      </div>

      <Tabs defaultValue="produtos" className="space-y-6">
        <TabsList className="bg-white shadow-md">
          <TabsTrigger value="produtos">Cadastro de Produtos</TabsTrigger>
          <TabsTrigger value="movimentacoes">Registro de Movimentações</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Cadastro de Produtos */}
        <TabsContent value="produtos">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-md border-none">
              <CardHeader>
                <CardTitle>Novo Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduto} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Arroz"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={categoria} onValueChange={(v) => setCategoria(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao-perecivel">Não Perecível</SelectItem>
                        <SelectItem value="perecivel">Perecível</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade de Medida</Label>
                    <Select value={unidade} onValueChange={setUnidade}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Quilograma (kg)</SelectItem>
                        <SelectItem value="un">Unidade (un)</SelectItem>
                        <SelectItem value="lt">Litro (lt)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      placeholder="Ex: 100"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      required
                      min="0"
                    />
                  </div>

                  {categoria === 'perecivel' && (
                    <div className="space-y-2">
                      <Label htmlFor="dataValidade">Data de Validade</Label>
                      <Input
                        id="dataValidade"
                        type="date"
                        value={dataValidade}
                        onChange={(e) => setDataValidade(e.target.value)}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg shadow-md"
                  >
                    Adicionar Produto
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-md border-none">
              <CardHeader>
                <CardTitle>Produtos em Estoque ({produtos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {produtos.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#A5D6A7]">
                          <th className="text-left p-3 rounded-tl-lg">Produto</th>
                          <th className="text-left p-3">Categoria</th>
                          <th className="text-left p-3">Quantidade</th>
                          <th className="text-left p-3">Unidade</th>
                          <th className="text-left p-3 rounded-tr-lg">Validade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produtos.map((produto, index) => (
                          <tr key={produto.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}>
                            <td className="p-3">{produto.nome}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded text-xs text-white ${
                                  produto.categoria === 'perecivel' ? 'bg-[#FF9800]' : 'bg-[#2E7D32]'
                                }`}
                              >
                                {produto.categoria === 'perecivel' ? 'Perecível' : 'Não Perecível'}
                              </span>
                            </td>
                            <td className="p-3">{produto.quantidade}</td>
                            <td className="p-3">{produto.unidade}</td>
                            <td className="p-3">{produto.dataValidade || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Nenhum produto cadastrado</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Registro de Movimentações */}
        <TabsContent value="movimentacoes">
          <Card className="shadow-md border-none max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Registrar Movimentação</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMovimentacao} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Movimentação</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTipoMov('entrada')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        tipoMov === 'entrada'
                          ? 'border-[#2E7D32] bg-[#A5D6A7]'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <ArrowDownCircle size={20} className={tipoMov === 'entrada' ? 'text-[#2E7D32]' : 'text-gray-600'} />
                      <span>Doação (Entrada)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoMov('saida')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        tipoMov === 'saida'
                          ? 'border-[#FF9800] bg-[#FFE0B2]'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <ArrowUpCircle size={20} className={tipoMov === 'saida' ? 'text-[#FF9800]' : 'text-gray-600'} />
                      <span>Distribuição (Saída)</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="produtoMov">Produto</Label>
                  <Input
                    id="produtoMov"
                    placeholder="Nome do produto"
                    value={produtoMov}
                    onChange={(e) => setProdutoMov(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidadeMov">Quantidade (kg)</Label>
                  <Input
                    id="quantidadeMov"
                    type="number"
                    placeholder="Ex: 50"
                    value={quantidadeMov}
                    onChange={(e) => setQuantidadeMov(e.target.value)}
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    placeholder="Nome do responsável"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className={`w-full ${
                    tipoMov === 'entrada'
                      ? 'bg-[#2E7D32] hover:bg-[#1B5E20]'
                      : 'bg-[#FF9800] hover:bg-[#F57C00]'
                  } text-white rounded-lg shadow-md`}
                >
                  Registrar {tipoMov === 'entrada' ? 'Doação' : 'Distribuição'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="historico">
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle>Histórico de Movimentações ({movimentacoes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {movimentacoes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#A5D6A7]">
                        <th className="text-left p-3 rounded-tl-lg">Tipo</th>
                        <th className="text-left p-3">Produto</th>
                        <th className="text-left p-3">Quantidade</th>
                        <th className="text-left p-3">Data</th>
                        <th className="text-left p-3 rounded-tr-lg">Responsável</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimentacoes.map((mov, index) => (
                        <tr key={mov.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs text-white ${
                                mov.tipo === 'entrada' ? 'bg-[#2E7D32]' : 'bg-[#FF9800]'
                              }`}
                            >
                              {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                            </span>
                          </td>
                          <td className="p-3">{mov.produto}</td>
                          <td className="p-3">{mov.quantidade} kg</td>
                          <td className="p-3">{mov.data}</td>
                          <td className="p-3">{mov.responsavel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhuma movimentação registrada</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
