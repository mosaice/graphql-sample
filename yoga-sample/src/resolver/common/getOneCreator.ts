import { ClassType, Resolver, Query, Arg } from 'type-graphql';
import { List, Total } from '../../advanced-type';
import { getRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

export function getOneResolver<P extends ClassType, T extends ClassType>(
  suffix: string,
  argName: string,
  ofObjectType: P,
  entityObjectType?: T
) {
  @Resolver(of => ofObjectType, { isAbstract: true })
  abstract class GetOneResolver {
    @Query(type => ofObjectType, { name: `get${suffix}`, nullable: true })
    async getOne(@Arg(argName) arg: string) {
      return await getRepository(entityObjectType || ofObjectType).findOne({
        where: {
          [argName]: arg
        }
      });
    }
  }

  return GetOneResolver;
}
