import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';

@ApiTags('doadores')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorService: DonorsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os doadores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os doadores cadastrados',
    type: [CreateDonorDto],
  })
  async findAll() {
    const donors = await this.donorService.findAll();
    return donors;
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo doador' })
  @ApiBody({ type: CreateDonorDto })
  @ApiResponse({
    status: 201,
    description: 'Doador criado com sucesso',
    type: CreateDonorDto,
  })
  async create(@Body() donor: CreateDonorDto) {
    return this.donorService.create(donor);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.donorService.update(Number(id), body);
  }
}
