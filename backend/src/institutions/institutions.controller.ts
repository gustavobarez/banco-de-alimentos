import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { InstitutionsService } from './institutions.service';

@ApiTags('instituições')
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as instituições' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas as instituições cadastradas',
    type: [CreateInstitutionDto],
  })
  async findAll() {
    const institutions = await this.institutionsService.findAll();
    return institutions;
  }

  @Post()
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
}
