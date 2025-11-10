import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DonorsService } from './donors.service';

@Controller('donors')
export class DonorsController {
    constructor(private readonly donnorService: DonorsService) { }

    @Get('findAllDonnors')
    getAll() {
        console.log('Doadores achados:', this.donnorService.findAll())
        return this.donnorService.findAll();
    }

    @Post('createDonnor')
    async create(@Body() body: any) {
        return this.donnorService.create(body);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.donnorService.delete(Number(id));
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.donnorService.update(Number(id), body);
    }
}