import { IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  year: number;

  @IsString()
  director: string;

  @IsString()
  dop: string;

  @IsString()
  cathegory: string;

  @IsString()
  img: string;
}
