import {
  Resolver,
  FieldResolver,
  Root,
  ResolverInterface,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DepartmentEmployee, DepartmentManager, Department } from '../../advanced-type';

@Resolver(Department)
export class DepartmentResolver implements ResolverInterface<Department> {
  constructor(
    @InjectRepository(DepartmentManager)
    private readonly depMRepository: Repository<DepartmentManager>,
    @InjectRepository(DepartmentEmployee)
    private readonly depERepository: Repository<DepartmentEmployee>,
  ) {}



  @FieldResolver()
  async employees(
    @Root() dep: Department,
  ) {
    return await this.depERepository.find({
      where: {
        dept_no: dep.dept_no
      }
    });
  }

  @FieldResolver()
  async managers(
    @Root() dep: Department,
  ) {
    return await this.depMRepository.find({
      where: {
        dept_no: dep.dept_no
      }
    });
  }
}
