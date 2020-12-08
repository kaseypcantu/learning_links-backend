import { createLinksRepository, Links } from '../../../../entity/Links/Links';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { PlatformContext } from '../../../../types/graphql-utils';
import { CreateLinkInput } from './CreateLinkInput';

@Resolver(Links)
export class CreateLinkResolver {
  @Mutation((returns) => Links)
  async createLink(
    @Ctx() ctx: PlatformContext,
    @Arg('linkData') { title, url, programmingLanguage, description }: CreateLinkInput
  ): Promise<Links> {
    const linksRepo = createLinksRepository();
    const newLink = linksRepo.createLink(title, url, programmingLanguage, description);
    console.log(`New Link: ${newLink}`);

    return newLink;
  }
}
