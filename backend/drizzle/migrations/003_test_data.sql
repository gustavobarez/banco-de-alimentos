-- Script de inserção de dados de teste
-- Inserir doadores
INSERT INTO
    donors (name, email, phone, address)
VALUES
    (
        'João Silva',
        'joao.silva@email.com',
        '(11) 98765-4321',
        'Rua A, 123 - São Paulo'
    ),
    (
        'Maria Santos',
        'maria.santos@email.com',
        '(11) 99876-5432',
        'Rua B, 456 - São Paulo'
    ),
    (
        'Pedro Costa',
        'pedro.costa@email.com',
        '(21) 98765-4321',
        'Rua C, 789 - Rio de Janeiro'
    ),
    (
        'Ana Oliveira',
        'ana.oliveira@email.com',
        '(31) 99876-5432',
        'Rua D, 101 - Belo Horizonte'
    ),
    (
        'Carlos Mendes',
        'carlos.mendes@email.com',
        '(41) 98765-4321',
        'Rua E, 202 - Curitiba'
    );

-- Inserir instituições
INSERT INTO
    institutions (
        name,
        cnpj,
        email,
        phone,
        address,
        responsible_person
    )
VALUES
    (
        'Casa de Acolhimento São José',
        '12.345.678/0001-90',
        'contato@saojose.org.br',
        '(11) 3333-4444',
        'Av. Paulista, 1000 - São Paulo',
        'Padre João'
    ),
    (
        'Instituto Esperança',
        '98.765.432/0001-10',
        'contato@esperanca.org.br',
        '(21) 3333-5555',
        'Rua do Ouvidor, 50 - Rio de Janeiro',
        'Diretora Maria'
    ),
    (
        'Associação Pão Nosso',
        '11.111.111/0001-11',
        'contato@paonosso.org.br',
        '(31) 3333-6666',
        'Av. Getúlio Vargas, 500 - Belo Horizonte',
        'Coordenador Pedro'
    ),
    (
        'Fundação Solidariedade',
        '22.222.222/0001-22',
        'contato@solidariedade.org.br',
        '(41) 3333-7777',
        'Rua Marechal Deodoro, 300 - Curitiba',
        'Presidente Ana'
    );

-- Inserir doações (últimos 90 dias)
-- Doações de Setembro
INSERT INTO
    donations (
        donor_id,
        institution_id,
        food_type,
        quantity,
        unit,
        expiration_date,
        status,
        created_at
    )
VALUES
    (
        1,
        1,
        'Arroz',
        50,
        'kg',
        '2025-12-31',
        'completed',
        NOW () - INTERVAL '60 days'
    ),
    (
        2,
        2,
        'Feijão',
        30,
        'kg',
        '2025-12-15',
        'completed',
        NOW () - INTERVAL '58 days'
    ),
    (
        3,
        3,
        'Leite em Pó',
        25,
        'kg',
        '2025-11-30',
        'completed',
        NOW () - INTERVAL '55 days'
    ),
    (
        4,
        4,
        'Açúcar',
        20,
        'kg',
        '2026-01-15',
        'pending',
        NOW () - INTERVAL '52 days'
    ),
    (
        5,
        1,
        'Óleo',
        15,
        'lt',
        '2025-12-20',
        'completed',
        NOW () - INTERVAL '50 days'
    );

-- Doações de Outubro
INSERT INTO
    donations (
        donor_id,
        institution_id,
        food_type,
        quantity,
        unit,
        expiration_date,
        status,
        created_at
    )
VALUES
    (
        1,
        2,
        'Pão',
        100,
        'un',
        '2025-11-15',
        'pending',
        NOW () - INTERVAL '30 days'
    ),
    (
        2,
        3,
        'Macarrão',
        40,
        'kg',
        '2026-02-01',
        'pending',
        NOW () - INTERVAL '28 days'
    ),
    (
        3,
        4,
        'Arroz',
        60,
        'kg',
        '2025-12-30',
        'pending',
        NOW () - INTERVAL '25 days'
    ),
    (
        4,
        1,
        'Feijão',
        35,
        'kg',
        '2025-12-10',
        'pending',
        NOW () - INTERVAL '22 days'
    ),
    (
        5,
        2,
        'Café',
        10,
        'kg',
        '2026-03-15',
        'pending',
        NOW () - INTERVAL '20 days'
    ),
    (
        1,
        3,
        'Açúcar',
        25,
        'kg',
        '2026-01-20',
        'pending',
        NOW () - INTERVAL '18 days'
    ),
    (
        2,
        4,
        'Leite em Pó',
        20,
        'kg',
        '2025-12-28',
        'pending',
        NOW () - INTERVAL '15 days'
    );

-- Doações de Novembro
INSERT INTO
    donations (
        donor_id,
        institution_id,
        food_type,
        quantity,
        unit,
        expiration_date,
        status,
        created_at
    )
VALUES
    (
        3,
        1,
        'Arroz',
        70,
        'kg',
        '2026-02-28',
        'pending',
        NOW () - INTERVAL '10 days'
    ),
    (
        4,
        2,
        'Feijão Preto',
        45,
        'kg',
        '2026-01-10',
        'pending',
        NOW () - INTERVAL '8 days'
    ),
    (
        5,
        3,
        'Lentilha',
        30,
        'kg',
        '2026-02-15',
        'pending',
        NOW () - INTERVAL '5 days'
    ),
    (
        1,
        4,
        'Óleo de Soja',
        20,
        'lt',
        '2026-05-01',
        'pending',
        NOW () - INTERVAL '3 days'
    ),
    (
        2,
        1,
        'Sal',
        15,
        'kg',
        '2026-12-31',
        'pending',
        NOW () - INTERVAL '2 days'
    ),
    (
        3,
        2,
        'Açúcar Cristal',
        40,
        'kg',
        '2026-01-25',
        'pending',
        NOW ()
    ),
    (
        4,
        3,
        'Café Moído',
        12,
        'kg',
        '2026-04-10',
        'pending',
        NOW ()
    ),
    (
        5,
        4,
        'Leite em Pó Integral',
        25,
        'kg',
        '2025-12-20',
        'pending',
        NOW ()
    );

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations (status);

CREATE INDEX IF NOT EXISTS idx_donations_expiration_date ON donations (expiration_date);

CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations (created_at);

CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations (donor_id);

CREATE INDEX IF NOT EXISTS idx_donations_institution_id ON donations (institution_id);

CREATE INDEX IF NOT EXISTS idx_donors_email ON donors (email);

CREATE INDEX IF NOT EXISTS idx_institutions_cnpj ON institutions (cnpj);