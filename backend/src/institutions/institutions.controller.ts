import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';

@Controller('institutions')
export class InstitutionsController {
    constructor(private readonly institutionsService: InstitutionsService) { }
    
    @Get('findAllInstitutions')
    getAll() {
        console.log('Instituições encontradas:', this.institutionsService.findAll());
        return this.institutionsService.findAll();
    }

    @Post('createInstitution')
    async create(@Body() body: any) {
        return this.institutionsService.create(body);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.institutionsService.delete(Number(id));
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.institutionsService.update(Number(id), body);
    }
}