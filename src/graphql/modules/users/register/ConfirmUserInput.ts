import { Field, InputType } from 'type-graphql';
import { IsValidUUID } from '../decorators/decorators';

@InputType()
export class ConfirmUserInput {
  @Field()
  @IsValidUUID({
    message: 'That value you passed is not a valid confirmation token, please try again.',
  })
  token!: string;
}
