import { IsString, Length } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;
}
