import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({
    description: 'ID do doador',
    example: 1,
    type: Number,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  donorId: number;

  @ApiProperty({
    description: 'ID da instituição',
    example: 1,
    type: Number,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  institutionId: number;

  @ApiProperty({
    description: 'Tipo de alimento',
    example: 'Arroz',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @Length(2, 255)
  foodType: string;

  @ApiProperty({
    description: 'Quantidade',
    example: 10.5,
    type: Number,
    minimum: 0.1,
  })
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  quantity: number;

  @ApiProperty({
    description: 'Unidade de medida',
    example: 'kg',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  unit: string;

  @ApiProperty({
    description: 'Data de validade',
    example: '2024-12-31',
    required: false,
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
