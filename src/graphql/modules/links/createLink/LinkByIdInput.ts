import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';

@InputType()
export class LinkByIdInput {
  @Field()
  @Length(1, 55)
  linkId!: string;
}
