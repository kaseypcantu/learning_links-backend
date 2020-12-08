import bcrypt from 'bcryptjs';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { User } from '../../../../entity/User/User';
import { LoginInput } from './LoginInput';
import { PlatformContext } from '../../../../types/graphql-utils';

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Ctx() ctx: PlatformContext,
    @Arg('LoginCredentials') { email, password }: LoginInput
  ): Promise<User | null | string> {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    const valid = bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    if (!user.accountConfirmed) {
      return `Please verify your account via account registration email sent to ${email}`;
    } else {
      ctx.req.session!.userId = user.userId;
    }

    return user;
  }
}
