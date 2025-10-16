import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorsModule } from './donors/donors.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { DonationsModule } from './donations/donations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DonorsModule, InstitutionsModule, DonationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
