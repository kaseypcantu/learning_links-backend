import * as bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  getRepository,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import logger from '../../utils/logger';
import { ErrorResponse, PrettyError } from '../../utils/errorResponse';

@Entity({ name: 'users' })
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  @Field(() => ID)
  userId!: string;

  @Column({ name: 'first_name', nullable: false, type: 'varchar', length: 25 })
  @Field({ nullable: false })
  firstName!: string;

  @Column({ name: 'last_name', nullable: false, type: 'varchar', length: 25 })
  @Field({ nullable: false })
  lastName!: string;

  @Column({ name: 'email', nullable: false, type: 'varchar', length: 50 })
  @Field({ nullable: false })
  email!: string;

  @Column({ name: 'varchar', nullable: false, type: 'varchar', length: 50 })
  @Field({ nullable: false })
  username!: string;

  @Column({ name: 'password', nullable: false, type: 'varchar' })
  password!: string;

  @Column({ name: 'account_confirmed', type: 'boolean', nullable: false, default: false })
  @Field(() => Boolean)
  accountConfirmed!: boolean;

  @Column({ name: 'forgot_password_locked', type: 'boolean', nullable: false, default: false })
  @Field(() => Boolean)
  forgotPasswordLocked!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', nullable: false })
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: false })
  @Field(() => Date)
  updatedAt!: Date;

  @BeforeInsert()
  async hashPasswordBeforeInsert(): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return (this.password = await bcrypt.hash(this.password, salt));
  }
}

export interface UsersRepository {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ): Promise<User>;

  listUsers(): Promise<User[]>;

  getUserById(id: string): Promise<User | undefined>; // TODO: this may not work in use, need to test, implement last.

  // getUserById(userToken: string): Promise<User>;

  // removeUser(userToken: string): Promise<User>;
}

class PostgresUsersRepository implements UsersRepository {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    const repository = getRepository(User);

    const newUser = repository.create({
      firstName,
      lastName,
      email,
      username,
      password,
    });
    console.log(`creating new user: ${newUser.userId}`);

    return repository
      .save(newUser)
      .then((userData) => userData)
      .catch((err) => {
        logger.error(err.message, err);
        const cleanError = PrettyError.fromError(err);
        console.log(cleanError);
        // TODO: determine if you want an IF here to check err.constraint
        // throw new Error(cleanError);
        throw new ErrorResponse(500, 'create_user_failed', [cleanError]);
      });
  }

  listUsers(): Promise<User[]> {
    return getRepository(User).find();
  }

  getUserById(id: string): Promise<User | undefined> {
    return getRepository(User).findOne({ where: { userId: id } });
  }
}

export function createUsersRepository(): UsersRepository {
  return new PostgresUsersRepository();
}
