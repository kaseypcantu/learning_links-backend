import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { User } from '../../../../entity/User/User';
import { RegisterInput } from './RegisterInput';
import { PlatformContext } from '../../../../types/graphql-utils';
import { sendEmail } from '../../../../utils/sendEmail';
import { createConfirmationUrl } from '../../../../utils/createConfirmationUrl';

@Resolver(User)
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Ctx() ctx: PlatformContext,
    @Arg('userData') { firstName, lastName, email, username, password }: RegisterInput
  ): Promise<User> {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      password,
    }).save();

    console.log(newUser);

    console.log('\nSending a test email via NodeMailer\n');
    await sendEmail(email, await createConfirmationUrl(newUser.userId));

    return newUser;
  }
}
