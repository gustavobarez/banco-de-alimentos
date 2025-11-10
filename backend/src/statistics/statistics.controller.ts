import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('estatísticas')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('top-foods-month')
  @ApiOperation({ summary: 'Alimentos mais doados no mês' })
  @ApiResponse({
    status: 200,
    description: 'Lista dos alimentos mais doados no mês atual',
  })
  async getTopFoodsByMonth() {
    return this.statisticsService.getTopFoodsByMonth();
  }

  @Get('inventory-by-lot')
  @ApiOperation({ summary: 'Saldo por lote (alimentos com data de validade)' })
  @ApiResponse({
    status: 200,
    description: 'Relatório de estoque por lote',
  })
  async getInventoryByLot() {
    return this.statisticsService.getInventoryByLot();
  }

  @Get('distribution-by-institution')
  @ApiOperation({ summary: 'Distribuição por instituição no trimestre' })
  @ApiResponse({
    status: 200,
    description: 'Relatório de distribuição por instituição',
  })
  async getDistributionByInstitution() {
    return this.statisticsService.getDistributionByInstitution();
  }

  @Get('top-donors')
  @ApiOperation({ summary: 'Doadores mais ativos' })
  @ApiResponse({
    status: 200,
    description: 'Top 10 doadores mais ativos',
  })
  async getTopDonors() {
    return this.statisticsService.getTopDonors();
  }

  @Get('expiring-items')
  @ApiOperation({ summary: 'Alimentos próximos ao vencimento' })
  @ApiResponse({
    status: 200,
    description: 'Alimentos que vencem nos próximos 7 dias',
  })
  async getExpiringItems() {
    return this.statisticsService.getExpiringItems();
  }

  @Get('monthly-summary')
  @ApiOperation({ summary: 'Resumo mensal de doações (últimos 12 meses)' })
  @ApiResponse({
    status: 200,
    description: 'Resumo mensal do último ano',
  })
  async getMonthlySummary() {
    return this.statisticsService.getMonthlySummary();
  }

  @Get('inventory-report')
  @ApiOperation({ summary: 'Relatório de estoque atual' })
  @ApiResponse({
    status: 200,
    description: 'Relatório completo de estoque',
  })
  async getInventoryReport() {
    return this.statisticsService.getInventoryReport();
  }

  @Get('distribution-efficiency')
  @ApiOperation({ summary: 'Eficiência de distribuição por instituição' })
  @ApiResponse({
    status: 200,
    description: 'Taxa de conclusão e eficiência de distribuição',
  })
  async getDistributionEfficiency() {
    return this.statisticsService.getDistributionEfficiency();
  }
}
