import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Doadores } from './components/Doadores';
import { Instituicoes } from './components/Instituicoes';
import { Estoque } from './components/Estoque';
import { Historico } from './components/Historico';

interface Doador {
  id: string;
  nome: string;
  tipo: 'PF' | 'PJ';
  telefone: string;
  email: string;
}

interface Instituicao {
  id: string;
  nome: string;
  endereco: string;
  capacidade: number;
  limiteMensal: number;
}

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

interface Distribuicao {
  id: string;
  instituicao: string;
  dataEntrega: string;
  produtos: string;
  quantidade: number;
  status: 'entregue' | 'pendente' | 'em-transito';
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  console.log("Login renderizado");
  console.log("isAuthenticated:", isAuthenticated);



  // Estado dos dados
  const [doadores, setDoadores] = useState<Doador[]>([
    {
      id: '1',
      nome: 'Maria Silva',
      tipo: 'PF',
      telefone: '(11) 98765-4321',
      email: 'maria@email.com',
    },
    {
      id: '2',
      nome: 'Supermercado Bom Preço',
      tipo: 'PJ',
      telefone: '(11) 3456-7890',
      email: 'contato@bompreco.com',
    },
  ]);

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([
    {
      id: '1',
      nome: 'Casa de Apoio São Francisco',
      endereco: 'Rua das Flores, 123 - Centro',
      capacidade: 500,
      limiteMensal: 2000,
    },
    {
      id: '2',
      nome: 'Instituto Esperança',
      endereco: 'Av. Principal, 456 - Jardim América',
      capacidade: 800,
      limiteMensal: 3000,
    },
  ]);

  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: '1',
      nome: 'Arroz',
      categoria: 'nao-perecivel',
      unidade: 'kg',
      quantidade: 150,
    },
    {
      id: '2',
      nome: 'Feijão',
      categoria: 'nao-perecivel',
      unidade: 'kg',
      quantidade: 120,
    },
    {
      id: '3',
      nome: 'Leite',
      categoria: 'perecivel',
      unidade: 'lt',
      quantidade: 80,
      dataValidade: '2025-11-30',
    },
  ]);

  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([
    {
      id: '1',
      tipo: 'entrada',
      produto: 'Arroz',
      quantidade: 50,
      data: '08/11/2025',
      responsavel: 'João Santos',
    },
    {
      id: '2',
      tipo: 'saida',
      produto: 'Feijão',
      quantidade: 30,
      data: '07/11/2025',
      responsavel: 'Ana Costa',
    },
  ]);

  const [distribuicoes, setDistribuicoes] = useState<Distribuicao[]>([
    {
      id: '1',
      instituicao: 'Casa de Apoio São Francisco',
      dataEntrega: '05/11/2025',
      produtos: 'Arroz, Feijão, Açúcar',
      quantidade: 150,
      status: 'entregue',
    },
    {
      id: '2',
      instituicao: 'Instituto Esperança',
      dataEntrega: '06/11/2025',
      produtos: 'Leite, Café, Óleo',
      quantidade: 80,
      status: 'entregue',
    },
    {
      id: '3',
      instituicao: 'Casa de Apoio São Francisco',
      dataEntrega: '09/11/2025',
      produtos: 'Macarrão, Molho de Tomate',
      quantidade: 60,
      status: 'em-transito',
    },
  ]);

  const handleLogin = (email: string, password: string) => {
    console.log("isAuthenticated:", isAuthenticated);

    // Simulação de login
    setIsAuthenticated(true);
    setUserName(email.split('@')[0]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
  };

  const handleAddDoador = (doador: Omit<Doador, 'id'>) => {
    const newDoador = {
      ...doador,
      id: Date.now().toString(),
    };
    setDoadores([...doadores, newDoador]);
  };

  const handleAddInstituicao = (instituicao: Omit<Instituicao, 'id'>) => {
    const newInstituicao = {
      ...instituicao,
      id: Date.now().toString(),
    };
    setInstituicoes([...instituicoes, newInstituicao]);
  };

  const handleAddProduto = (produto: Omit<Produto, 'id'>) => {
    const newProduto = {
      ...produto,
      id: Date.now().toString(),
    };
    setProdutos([...produtos, newProduto]);
  };

  const handleAddMovimentacao = (movimentacao: Omit<Movimentacao, 'id'>) => {
    const newMovimentacao = {
      ...movimentacao,
      id: Date.now().toString(),
    };
    setMovimentacoes([...movimentacoes, newMovimentacao]);
  };

  const recentActivity = movimentacoes.slice(-5).reverse().map((mov) => ({
    id: mov.id,
    tipo: mov.tipo === 'entrada' ? 'Doação' : 'Distribuição',
    descricao: `${mov.produto} - ${mov.quantidade} kg (${mov.responsavel})`,
    data: mov.data,
  }));

  const stats = {
    totalDoadores: doadores.length,
    totalInstituicoes: instituicoes.length,
    produtosEstoque: produtos.reduce((acc, p) => acc + p.quantidade, 0),
    ultimasMovimentacoes: movimentacoes.length,
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    
    <Router>
      {!isAuthenticated ? (
        <>
          <Login onLogin={handleLogin} />
          <Toaster />
        </>
      ) : (
        <Layout userName={userName} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<Dashboard stats={stats} recentActivity={recentActivity} />}
            />
            <Route
              path="/doadores"
              element={<Doadores doadores={doadores} onAddDoador={handleAddDoador} />}
            />
            <Route
              path="/instituicoes"
              element={
                <Instituicoes
                  instituicoes={instituicoes}
                  onAddInstituicao={handleAddInstituicao}
                />
              }
            />
            <Route
              path="/estoque"
              element={
                <Estoque
                  produtos={produtos}
                  movimentacoes={movimentacoes}
                  onAddProduto={handleAddProduto}
                  onAddMovimentacao={handleAddMovimentacao}
                />
              }
            />
            <Route path="/historico" element={<Historico distribuicoes={distribuicoes} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      )}
      <Toaster />
    </Router>
  );
}

export default App;
