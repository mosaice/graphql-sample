import {
  Resolver,
  Query,
  Args,
  FieldResolver,
  ResolverInterface,
  Root
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Department, DepartmentList } from '../advanced-type';
import { PaginationArgs } from './common/PaginationArgs';
import { plainToClass } from 'class-transformer';
import { createPaginationResolver } from './common/paginationCreator';
import { calcPage } from '../utils/calc';

const DepartmentPaginationResolver = createPaginationResolver(
  DepartmentList,
  Department
);

@Resolver(of => DepartmentList)
export class DepartmentListResolver extends DepartmentPaginationResolver
  implements ResolverInterface<DepartmentList> {
  constructor(
    @InjectRepository(Department)
    private readonly depRepository: Repository<Department> // @InjectRepository(Title) // private readonly titleRepository: Repository<Title>, // @InjectRepository(Salary) // private readonly salaryRepository: Repository<Salary>
  ) {
    super();
  }

  @Query(of => DepartmentList)
  async getDepartments(@Args() { size, page }: PaginationArgs) {
    return plainToClass(DepartmentList, {
      size,
      current: page
    });
  }

  @FieldResolver(of => [Department])
  async departments(@Root() root: DepartmentList) {
    return await this.depRepository.find(calcPage(root));
  }
}
