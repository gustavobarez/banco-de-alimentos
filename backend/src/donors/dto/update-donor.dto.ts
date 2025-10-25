import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateDonorDto {
  @ApiPropertyOptional({
    description: 'Nome do doador',
    example: 'João Silva',
    minLength: 2,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Email do doador',
    example: 'joao.silva@email.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone do doador',
    example: '(11) 99999-9999',
    pattern: '^\\([1-9]{2}\\) (?:9[1-9]|[2-9])[0-9]{3}-[0-9]{4}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\([1-9]{2}\) (?:9[1-9]|[2-9])[0-9]{3}-[0-9]{4}$/, {
    message: 'Telefone inválido. Use o formato (99) 99999-9999',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Endereço do doador',
    example: 'Rua das Flores, 123 - São Paulo/SP',
    minLength: 5,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(5, 500)
  address?: string;
}
