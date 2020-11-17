import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateLinkInput {
  @Field()
  @Length(1, 50)
  title!: string;

  @Field()
  @Length(1, 256)
  url!: string;

  @Field()
  @Length(1, 256)
  programmingLanguage!: string;

  @Field()
  @Length(1, 256)
  description!: string;
}
