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
import { DepartmentEmployee, DepartmentEmployList } from '../advanced-type';
import { createPaginationResolver } from './common/paginationCreator';
import { calcPage } from '../utils/calc';

const DepartmentEmpoyleePaginationResolver = createPaginationResolver(
  DepartmentEmployList,
  DepartmentEmployee
);

@Resolver(of => DepartmentEmployList)
export class DepartmentListResolver extends DepartmentEmpoyleePaginationResolver
  implements ResolverInterface<DepartmentEmployList> {
  constructor(
    @InjectRepository(DepartmentEmployee)
    private readonly depRepository: Repository<DepartmentEmployee> // @InjectRepository(Title) // private readonly titleRepository: Repository<Title>, // @InjectRepository(Salary) // private readonly salaryRepository: Repository<Salary>
  ) {
    super();
  }

  @FieldResolver(of => [DepartmentEmployee])
  async employees(@Root() root: DepartmentEmployList) {
    return await this.depRepository.find({
      where: {
        dept_no: root.dept_no
      },
      ...calcPage(root)
    });
  }
}
