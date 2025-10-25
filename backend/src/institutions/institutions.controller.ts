import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { InstitutionsService } from './institutions.service';

@ApiTags('instituições')
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get('findAllInstitutions')
  @ApiOperation({ summary: 'Listar todas as instituições' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas as instituições cadastradas',
    type: [CreateInstitutionDto],
  })
  async getAll() {
    console.log('Instituições encontradas:', this.institutionsService.findAll());
    return this.institutionsService.findAll();
  }

  @Post('createInstitution')
  @ApiOperation({ summary: 'Criar uma nova instituição' })
  @ApiBody({ type: CreateInstitutionDto })
  @ApiResponse({
    status: 201,
    description: 'Instituição criada com sucesso',
    type: CreateInstitutionDto,
  })
  async create(@Body() institution: CreateInstitutionDto) {
    return this.institutionsService.create(institution);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma instituição' })
  @ApiResponse({
    status: 200,
    description: 'Instituição deletada com sucesso',
  })
  async delete(@Param('id') id: string) {
    return this.institutionsService.delete(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma instituição' })
  @ApiBody({ type: CreateInstitutionDto })
  @ApiResponse({
    status: 200,
    description: 'Instituição atualizada com sucesso',
    type: CreateInstitutionDto,
  })
  async update(@Param('id') id: string, @Body() body: CreateInstitutionDto) {
    return this.institutionsService.update(Number(id), body);
  }
}