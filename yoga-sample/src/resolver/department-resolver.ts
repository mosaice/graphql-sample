import {
  Resolver,
  FieldResolver,
  Root,
  Args,
  ResolverInterface,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DepartmentEmployList, DepartmentManager, Department } from '../advanced-type';
import { PaginationArgs } from './common/PaginationArgs';
import { plainToClass } from 'class-transformer';


@Resolver(Department)
export class DepartmentResolver implements ResolverInterface<Department> {
  constructor(
    @InjectRepository(DepartmentManager)
    private readonly depMRepository: Repository<DepartmentManager>,
  ) {}



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

  @FieldResolver()
  async managers(
    @Root() { dept_no }: Department,
  ) {
    return await this.depMRepository.find({
      where: {
        dept_no
      }
    });
  }
}
