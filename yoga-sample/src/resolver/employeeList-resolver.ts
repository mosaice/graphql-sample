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
import { Employee, EmployeeList, List } from '../advanced-type';
import { PaginationArgs } from './common/PaginationArgs';
import { plainToClass } from 'class-transformer';
import { createPaginationResolver } from './common/paginationCreator';
import { calcPage } from '../utils/calc';

const EmployeePaginationResolver = createPaginationResolver(
  EmployeeList,
  Employee
);

@Resolver(of => EmployeeList)
export class EmployeeListResolver extends EmployeePaginationResolver
  implements ResolverInterface<EmployeeList> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee> // @InjectRepository(Title) // private readonly titleRepository: Repository<Title>, // @InjectRepository(Salary) // private readonly salaryRepository: Repository<Salary>
  ) {
    super();
  }

  @Query(of => EmployeeList)
  async getEmployees(@Args() { size, page }: PaginationArgs) {
    return plainToClass(EmployeeList, {
      size,
      current: page
    });
  }

  @FieldResolver(of => [Employee])
  async employees(@Root() root: EmployeeList) {
    return await this.employeeRepository.find(calcPage(root));
  }
}
