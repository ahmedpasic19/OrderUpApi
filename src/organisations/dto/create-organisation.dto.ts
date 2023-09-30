import { IsNotEmpty } from 'class-validator';

export class CreateOrganisationDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  user_id: string;
}
