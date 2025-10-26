import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';

@ApiTags('doacoes')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) { }

  @Get()
  @ApiOperation({ summary: 'Listar todas as doações' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de todas as doações cadastradas',
    type: [CreateDonationDto],
  })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.donationsService.findAll();
  }

  @Get('donor/:id')
  @ApiOperation({ summary: 'Buscar doações por doador' })
  @ApiParam({
    name: 'id',
    description: 'ID do doador',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de doações do doador',
    type: [CreateDonationDto],
  })
  @HttpCode(HttpStatus.OK)
  async findByDonor(@Param('id', ParseIntPipe) id: number) {
    return await this.donationsService.findByDonor(id);
  }

  @Get('institution/:id')
  @ApiOperation({ summary: 'Buscar doações por instituição' })
  @ApiParam({
    name: 'id',
    description: 'ID da instituição',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de doações da instituição',
    type: [CreateDonationDto],
  })
  @HttpCode(HttpStatus.OK)
  async findByInstitution(@Param('id', ParseIntPipe) id: number) {
    return await this.donationsService.findByInstitution(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova doação' })
  @ApiBody({ type: CreateDonationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Doação criada com sucesso',
    type: CreateDonationDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() donationData: CreateDonationDto) {
    return await this.donationsService.create(donationData);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar status de uma doação' })
  @ApiParam({
    name: 'id',
    description: 'ID da doação',
    type: 'number',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'aprovado',
          description: 'Novo status da doação',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status da doação atualizado com sucesso',
    type: CreateDonationDto,
  })
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return await this.donationsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma doação' })
  @ApiParam({
    name: 'id',
    description: 'ID da doação',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Doação excluída com sucesso',
    type: CreateDonationDto,
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.donationsService.delete(id);
  }
}
