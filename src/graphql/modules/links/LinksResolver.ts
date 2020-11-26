import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { createLinksRepository, Links } from '../../../entity/Links/Links';
import { PlatformContext } from '../../../types/graphql-utils';
import { LinkByIdInput } from './createLink/LinkByIdInput';

const linksRepo = createLinksRepository();

@Resolver(Links)
export class LinksResolver {
  @Query(returns => [Links])
  async allLinks(): Promise<Links[] | string> {
    const links = linksRepo.listLinks();
    if (!links) {
      return 'No links in DB yet!';
    }
    console.log(`All Links: ${links}`);
    return links;
  }

  @Query(returns => Links)
  async getLinkById(
    @Ctx() ctx: PlatformContext,
    @Arg('id') {
        linkId,
      }: LinkByIdInput,
  ): Promise<Links | string | undefined> {
    const link = linksRepo.getLinkById(linkId);
    if (!link) {
      return `A Link with ID: ${linkId} does not exist.`;
    }
    console.log(`Retrieved Link By ID: ${linkId}`);
    return link;
  }

  @Mutation(returns => String)
  async removeLinkById(
    @Ctx() ctx: PlatformContext,
    @Arg('id') {
        linkId,
      }: LinkByIdInput,
  ): Promise<String> {
    const confirm = await Links.findOne({ linkId: linkId });
    if (!confirm) {
      return `A Link with ID: ${linkId} does not exist.`;
    }
    return await Links.delete({ linkId: linkId })
      .then(links => {
        return `Successfully DELETED Link with ID: ${linkId}`;
      });
  }
}
