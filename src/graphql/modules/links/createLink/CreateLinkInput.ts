import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';

// TODO: Add validation decorator for the URL field.
@InputType()
export class CreateLinkInput {
  @Field()
  @Length(1, 55)
  title!: string;

  @Field()
  @Length(1, 512)
  url!: string;

  @Field()
  @Length(1, 55)
  programmingLanguage!: string;

  @Field()
  @Length(1, 512)
  description!: string;
}
