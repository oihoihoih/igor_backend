import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  title: string;

  @IsNumber()
  year: number;

  @IsString()
  director: string;

  @IsString()
  dop: string;

  @IsString()
  category: string;

  @IsUrl()
  img: string;

  @IsOptional()
  @IsUrl()
  trailerUrl: string;
}
