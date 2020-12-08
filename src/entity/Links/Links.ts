import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  getRepository,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { ErrorResponse, PrettyError } from '../../utils/errorResponse';
import logger from '../../utils/logger';

@Entity({ name: 'links' })
@ObjectType()
export class Links extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'link_id' })
  @Field(() => ID)
  linkId!: string;

  @Column({ name: 'link_title', nullable: false, type: 'varchar' })
  @Field({ nullable: false })
  title!: string;

  @Column({ name: 'link_url', nullable: false, type: 'varchar' })
  @Field({ nullable: false })
  url!: string;

  @Column({ name: 'programming_language', nullable: true, type: 'varchar' })
  @Field({ nullable: false })
  programmingLanguage!: string;

  @Column({ name: 'link_description', nullable: false, type: 'text' })
  @Field({ nullable: false })
  description!: string;

  @CreateDateColumn({ name: 'created_at', nullable: false, type: 'timestamptz' })
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false, type: 'timestamptz' })
  @Field(() => Date)
  updatedAt!: Date;

  // TODO: Add graphql field(s) and db column(s) to show status of learning or completed.
}

export interface LinksRepository {
  createLink(
    title: string,
    url: string,
    programmingLanguage: string,
    description: string
  ): Promise<Links>;

  listLinks(): Promise<Links[]>;

  getLinkById(id: string): Promise<Links | string | undefined>;

  //TODO: Add remove by ID functionality here.
}

class PostgresLinksRepository implements LinksRepository {
  createLink(
    title: string,
    url: string,
    programmingLanguage: string,
    description: string
  ): Promise<Links> {
    const repository = getRepository(Links);

    const newLink = repository.create({
      title,
      url,
      programmingLanguage,
      description,
    });
    console.log(`creating new link instance: ${newLink.linkId}`);

    return repository
      .save(newLink)
      .then((linkData) => linkData)
      .catch((err) => {
        logger.error(err.message, err);
        const cleanError = PrettyError.fromError(err);
        console.log(cleanError);
        throw new ErrorResponse(500, 'create_link_failed', [cleanError]);
      });
  }

  listLinks(): Promise<Links[]> {
    return getRepository(Links).find();
  }

  getLinkById(id: string): Promise<Links | string | undefined> {
    return getRepository(Links).findOne({ where: { linkId: id } });
  }
}

export function createLinksRepository(): LinksRepository {
  return new PostgresLinksRepository();
}
