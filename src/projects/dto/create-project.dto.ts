import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProjectDto {
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
