import { Controller, Get, Post, Body } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';

@Controller('institutions')
export class InstitutionsController {
    constructor(private readonly institutionsService: InstitutionsService) { }
    
        @Get('findAllInstitutions')
        getAll() {
            console.log('Doadores achados:', this.institutionsService.findAll())
            return this.institutionsService.findAll();
        }
    
        @Post('createInstitution')
        async create(@Body() body: any) {
            return this.institutionsService.create(body);
        }
}
