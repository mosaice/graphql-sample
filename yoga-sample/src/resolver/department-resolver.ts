import {
  Resolver,
  FieldResolver,
  Root,
  Args,
  ResolverInterface
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  DepartmentEmployList,
  DepartmentManager,
  Department
} from 'advanced-type';
import { PaginationArgs } from './common/Args';
import { plainToClass } from 'class-transformer';
import { getOneResolver } from './common/getOneCreator';

const GetDepartmentResolver = getOneResolver(
  'Department',
  'dept_no',
  Department
);

@Resolver(Department)
export class DepartmentResolver extends GetDepartmentResolver
  implements ResolverInterface<Department> {
  constructor(
    @InjectRepository(DepartmentManager)
    private readonly depMRepository: Repository<DepartmentManager>
  ) {
    super();
  }

  @FieldResolver()
  async employees(
    @Root() { dept_no }: Department,
    @Args() { size, page }: PaginationArgs
  ) {
    return plainToClass(DepartmentEmployList, {
      dept_no,
      size,
      current: page
    });
  }

  @FieldResolver({ complexity: 10 })
  async managers(@Root() { dept_no }: Department) {
    return await this.depMRepository.find({
      where: {
        dept_no
      }
    });
  }
}
