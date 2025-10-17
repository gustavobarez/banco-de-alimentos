import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DonationsService } from './donations.service';
import type { InferInsertModel } from 'drizzle-orm';
import { donations } from 'src/db/schema';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  async findAll() {
    return this.donationsService.findAll();
  }

  @Get('donor/:id')
  async findByDonor(@Param('id') id: number) {
    return this.donationsService.findByDonor(Number(id));
  }

  @Get('institution/:id')
  async findByInstitution(@Param('id') id: number) {
    return this.donationsService.findByInstitution(Number(id));
  }

  @Post()
  async create(@Body() donationData: InferInsertModel<typeof donations>) {
    return this.donationsService.create(donationData);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.donationsService.updateStatus(Number(id), status);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.donationsService.delete(Number(id));
  }
}
