import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  organisation_id: number;
  @IsNotEmpty()
  price: number;
  weight: number;
}
