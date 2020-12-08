import bcrypt from 'bcryptjs';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import util from 'util';

import { User } from '../../../../entity/User/User';
import { redis } from '../../../../utils/redis';
import { PlatformContext } from '../../../../types/graphql-utils';
import { ConfirmUserInput } from './ConfirmUserInput';
import { getRepository } from 'typeorm';

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg('Token') { token }: ConfirmUserInput): Promise<boolean> {
    const userRepo = getRepository(User);

    const userId = await redis.get(token);
    console.log(`\nUSER_ID: ${userId}\n`);

    if (!userId) {
      return false;
    }

    const updatedUser = await userRepo.update(
      { userId: userId },
      {
        accountConfirmed: true,
      }
    );

    console.log(`\nUPDATED_USER: ${util.inspect(updatedUser, true, 8, true)}\n`);

    const userCheck = await userRepo.find({ where: { userId: userId } });
    console.log(`\nCheck User ID: ${util.inspect(userCheck, true, 8, true)}\n`);

    await redis.del(token);

    return true;
  }
}
