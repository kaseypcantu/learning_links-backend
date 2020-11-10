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

@Entity({ name: "links" })
export class Link extends BaseEntity {

  @PrimaryGeneratedColumn("uuid", { name: "link_id" })
  id!: string;

  @Column({ name: "link_title", nullable: false, type: "varchar" })
  title!: string;

  @Column({ name: "link_url", nullable: false, type: "varchar" })
  url!: string;

  @Column({ name: "link_topics", nullable: false, type: "text" })
  topics?: string;

  @Column({ name: "link_description", nullable: false, type: "text" })
  description?: string;

  @Column({ name: "programming_languages", nullable: true, type: "varchar" })
  programmingLanguages?: string;

  @CreateDateColumn({ name: "created_at", nullable: false, type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", nullable: false, type: "timestamptz" })
  updatedAt!: Date;
}
