import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateDonorDto {
  @ApiProperty({
    description: 'Nome do doador',
    example: 'João Silva',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({
    description: 'Email do doador',
    example: 'joao.silva@email.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Telefone do doador',
    example: '(11) 99999-9999',
    pattern: '^\\([1-9]{2}\\) (?:9[1-9]|[2-9])[0-9]{3}-[0-9]{4}$',
  })
  @IsString({ message: 'Telefone deve ser um texto' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\([1-9]{2}\) (?:9[1-9]|[2-9])[0-9]{3}-[0-9]{4}$/, {
    message: 'Telefone inválido. Use o formato (99) 99999-9999',
  })
  phone: string;

  @ApiProperty({
    description: 'Endereço do doador',
    example: 'Rua das Flores, 123 - São Paulo/SP',
    required: false,
    minLength: 5,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(5, 500)
  address?: string;
}
