import { ClassType, Resolver, FieldResolver, Root } from 'type-graphql';
import { List, Total } from '../../advanced-type';
import { getRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

export function createPaginationResolver<
  P extends ClassType,
  T extends ClassType
>(ofObjectType: P, entityObjectType: T) {
  @Resolver(of => ofObjectType, { isAbstract: true })
  abstract class PaginationResolver {
    @FieldResolver(of => Total)
    async total(@Root() root: List): Promise<Total> {
      const { counts } = await getRepository(entityObjectType)
        .createQueryBuilder()
        .select(`COUNT(*)`, 'counts')
        .getRawOne();
      const total_pages = Math.ceil(counts / root.size);
      return plainToClass(Total, {
        counts,
        total_pages
      });
    }
  }

  return PaginationResolver;
}
