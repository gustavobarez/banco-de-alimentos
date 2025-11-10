import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from '../db/database.module';

@Injectable()
export class StatisticsService {
  // Alimentos mais doados no mês
  async getTopFoodsByMonth() {
    const result = await db.execute(sql`
      SELECT 
        food_type,
        COUNT(*) as total_doacoes,
        SUM(CAST(quantity AS FLOAT)) as quantidade_total,
        unit,
        ROUND(AVG(CAST(quantity AS FLOAT))::numeric, 2) as quantidade_media
      FROM donations
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
      GROUP BY food_type, unit
      ORDER BY quantidade_total DESC
    `);
    return result;
  }

  // Saldo por lote
  async getInventoryByLot() {
    const result = await db.execute(sql`
      SELECT 
        id as lote_id,
        food_type,
        quantity,
        unit,
        expiration_date,
        CASE 
          WHEN expiration_date IS NULL THEN 'Indefinida'
          WHEN expiration_date > NOW()::date THEN 'Válido'
          ELSE 'Vencido'
        END as status_validade,
        (expiration_date - NOW()::date) as dias_restantes,
        status as status_doacao,
        created_at
      FROM donations
      WHERE status = 'pending'
      ORDER BY expiration_date ASC NULLS LAST
    `);
    return result;
  }

  // Distribuição por instituição
  async getDistributionByInstitution() {
    const result = await db.execute(sql`
      SELECT 
        i.name as instituicao,
        i.cnpj,
        COUNT(d.id) as total_doacoes_recebidas,
        SUM(CAST(d.quantity AS FLOAT)) as quantidade_total_recebida,
        ROUND(AVG(CAST(d.quantity AS FLOAT))::numeric, 2) as media_por_doacao,
        MAX(d.created_at) as ultima_doacao
      FROM institutions i
      LEFT JOIN donations d ON i.id = d.institution_id
        AND DATE_TRUNC('quarter', d.created_at) = DATE_TRUNC('quarter', NOW())
      GROUP BY i.id, i.name, i.cnpj
      ORDER BY quantidade_total_recebida DESC NULLS LAST
    `);
    return result;
  }

  // Doadores mais ativos
  async getTopDonors() {
    const result = await db.execute(sql`
      SELECT 
        d.name as doador,
        COUNT(don.id) as total_doacoes,
        SUM(CAST(don.quantity AS FLOAT)) as quantidade_total_doada,
        COUNT(DISTINCT don.institution_id) as instituicoes_atendidas,
        MAX(don.created_at) as ultima_doacao
      FROM donors d
      LEFT JOIN donations don ON d.id = don.donor_id
      GROUP BY d.id, d.name
      ORDER BY total_doacoes DESC
      LIMIT 10
    `);
    return result;
  }

  // Alimentos próximos ao vencimento
  async getExpiringItems() {
    const result = await db.execute(sql`
      SELECT 
        d.id,
        d.food_type,
        d.quantity,
        d.unit,
        d.expiration_date,
        (d.expiration_date - NOW()::date) as dias_restantes,
        i.name as instituicao_destino
      FROM donations d
      LEFT JOIN institutions i ON d.institution_id = i.id
      WHERE d.expiration_date IS NOT NULL
        AND d.expiration_date > NOW()::date
        AND d.expiration_date <= NOW()::date + INTERVAL '7 days'
        AND d.status = 'pending'
      ORDER BY d.expiration_date ASC
    `);
    return result;
  }

  // Resumo mensal
  async getMonthlySummary() {
    const result = await db.execute(sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as mes,
        COUNT(*) as total_doacoes,
        SUM(CAST(quantity AS FLOAT)) as quantidade_total,
        COUNT(DISTINCT donor_id) as doadores_unicos,
        COUNT(DISTINCT institution_id) as instituicoes_beneficiadas,
        ROUND(AVG(CAST(quantity AS FLOAT))::numeric, 2) as media_por_doacao
      FROM donations
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY mes DESC
    `);
    return result;
  }

  // Relatório de estoque
  async getInventoryReport() {
    const result = await db.execute(sql`
      SELECT 
        food_type,
        SUM(CAST(quantity AS FLOAT)) as quantidade_total,
        unit,
        COUNT(id) as numero_lotes,
        MIN(expiration_date) as proxima_validade,
        MAX(expiration_date) as ultima_validade,
        SUM(CASE WHEN expiration_date > NOW()::date THEN CAST(quantity AS FLOAT) ELSE 0 END) as quantidade_valida,
        SUM(CASE WHEN expiration_date <= NOW()::date THEN CAST(quantity AS FLOAT) ELSE 0 END) as quantidade_vencida
      FROM donations
      WHERE status = 'pending'
      GROUP BY food_type, unit
      ORDER BY quantidade_total DESC
    `);
    return result;
  }

  // Eficiência de distribuição
  async getDistributionEfficiency() {
    const result = await db.execute(sql`
      SELECT 
        i.name as instituicao,
        ROUND(100.0 * COUNT(CASE WHEN d.status = 'completed' THEN 1 END) / 
              NULLIF(COUNT(d.id), 0), 2) as taxa_conclusao_percent,
        COUNT(d.id) as total_doacoes_recebidas,
        COUNT(CASE WHEN d.status = 'completed' THEN 1 END) as doacoes_concluidas,
        COUNT(CASE WHEN d.status = 'pending' THEN 1 END) as doacoes_pendentes
      FROM institutions i
      LEFT JOIN donations d ON i.id = d.institution_id
      GROUP BY i.id, i.name
      ORDER BY taxa_conclusao_percent DESC NULLS LAST
    `);
    return result;
  }
}
