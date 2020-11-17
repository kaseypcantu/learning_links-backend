import { Query, Resolver } from 'type-graphql';
import { createLinksRepository, Links } from '../../../entity/Links/Links';


@Resolver(Links)
export class LinksResolver {
  @Query(returns => [Links])
  async allLinks(): Promise<Links[] | string> {
    const linksRepo = createLinksRepository();
    const links = linksRepo.listLinks();
    if (!links) {
      return "No links in DB yet!"
    }
    console.log(`All Links: ${links}`);
    return links;
  }
}
