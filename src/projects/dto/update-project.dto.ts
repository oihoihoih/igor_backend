import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  title: string;

  @IsNumber()
  @Type(() => Number) // Forzar a convertir 'year' a número
  year: number;

  @IsString()
  director: string;

  @IsString()
  dop: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsUrl()
  trailerUrl: string;
}
