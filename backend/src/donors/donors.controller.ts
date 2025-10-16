import { Body, Controller, Get, Post } from '@nestjs/common';
import { DonationsService } from 'src/donations/donations.service';
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

}
