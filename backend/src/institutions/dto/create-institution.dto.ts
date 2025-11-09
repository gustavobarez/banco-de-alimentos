import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateInstitutionDto {
  @ApiProperty({
    description: 'Nome da instituição',
    example: 'Casa de Acolhimento São José',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({
    description: 'CNPJ da instituição',
    example: '12.345.678/0001-90',
    pattern: '^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$',
  })
  @IsString()
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX',
  })
  cnpj: string;

  @ApiProperty({
    description: 'Email da instituição',
    example: 'contato@saojose.org.br',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Telefone da instituição',
    example: '(11) 3333-4444',
    pattern: '^\\([1-9]{2}\\) (?:9[1-9]|[2-9])[0-9]{3}-[0-9]{4}$',
  })
  @IsString()
  @Matches(/^\([1-9]{2}\) (?:9[1-9]|[2-9])[0-9]{3}-[0-9]{4}$/, {
    message: 'Telefone inválido. Use o formato (99) 99999-9999',
  })
  phone: string;

  @ApiProperty({
    description: 'Endereço da instituição',
    example: 'Av. Principal, 456 - São Paulo/SP',
    required: false,
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @Length(5, 500)
  address: string;

  @ApiProperty({
    description: 'Nome do responsável pela instituição',
    example: 'Maria Silva',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @Length(2, 255)
  responsiblePerson: string;
}
