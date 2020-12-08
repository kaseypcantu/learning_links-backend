import { MaxLength, Length, IsEmail, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(5, 25, {
    message: 'Password must be between 5-25 characters long.',
  })
  password!: string;
}
