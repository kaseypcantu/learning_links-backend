import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";


@Entity({ name: "links" })
@ObjectType()
export class Link extends BaseEntity {

  @PrimaryGeneratedColumn("uuid", { name: "link_id" })
  @Field(() => ID)
  id!: string;

  @Column({ name: "link_title", nullable: false, type: "varchar" })
  @Field({ nullable: false })
  title!: string;

  @Column({ name: "link_url", nullable: false, type: "varchar" })
  @Field({ nullable: false })
  url!: string;

  @Column({ name: "link_description", nullable: false, type: "text" })
  @Field({ nullable: false })
  description!: string;

  @Column({ name: "programming_languages", nullable: true, type: "varchar" })
  @Field({ nullable: false })
  programmingLanguages!: string;

  @CreateDateColumn({ name: "created_at", nullable: false, type: "timestamptz" })
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", nullable: false, type: "timestamptz" })
  @Field(() => Date)
  updatedAt!: Date;
}
