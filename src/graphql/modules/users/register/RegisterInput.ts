import { MaxLength, Length, IsEmail, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyInUse, IsUsernameAlreadyInUse } from '../decorators/decorators';

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 50)
  firstName!: string;

  @Field()
  @Length(1, 50)
  lastName!: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyInUse({
    message: 'That e-mail is already in use, please use a different one.',
  })
  email!: string;

  @Field()
  @Length(1, 25)
  @IsUsernameAlreadyInUse({
    message: 'That username is already in use, please choose a different one.',
  })
  username!: string;

  @Field()
  @Length(5, 25)
  password!: string;
}
