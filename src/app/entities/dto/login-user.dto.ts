import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly password: string;
}
