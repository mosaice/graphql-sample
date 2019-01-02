import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Args,
  FieldResolver,
  Root,
  ResolverInterface,
  UseMiddleware
} from 'type-graphql';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { EmployeeInput } from './input/employee-input';
import { LogAccessMiddleware } from 'middleware';
import {
  Title,
  Salary,
  Employee,
  DepartmentEmployee,
  DepartmentManager
} from 'advanced-type';
import { PaginationArgs } from './common/Args';
import { getOneResolver } from './common/getOneCreator';

const GetEmployeeResolver = getOneResolver('Employee', 'emp_no', Employee);

@Resolver(Employee)
export class EmployeeResolver extends GetEmployeeResolver
  implements ResolverInterface<Employee> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Title)
    private readonly titleRepository: Repository<Title>,
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>,
    @InjectRepository(DepartmentEmployee)
    private readonly depERepository: Repository<DepartmentEmployee>,
    @InjectRepository(DepartmentManager)
    private readonly depMRepository: Repository<DepartmentManager>
  ) {
    super();
  }

  // @Query(returns => [Employee])
  // async employees(@Args() { take, skip }: PaginationArgs) {
  //   return await this.employeeRepository.find({
  //     take: take(),
  //     skip: skip()
  //   });
  // }

  @FieldResolver({ complexity: 10 })
  @UseMiddleware(LogAccessMiddleware)
  async titles(@Root() emp: Employee) {
    return await this.titleRepository.find({
      where: {
        emp_no: emp.emp_no
      }
    });
  }

  @FieldResolver({ complexity: 10 })
  async salaries(
    @Root() emp: Employee,
    @Args() { take, skip }: PaginationArgs
  ) {
    return await this.salaryRepository.find({
      where: {
        emp_no: emp.emp_no
      },
      take: take(),
      skip: skip()
    });
  }

  @FieldResolver()
  async departments(@Root() emp: Employee) {
    return await this.depERepository.find({
      where: {
        emp_no: emp.emp_no
      }
    });
  }

  @FieldResolver()
  async managed_departments(@Root() emp: Employee) {
    return await this.depMRepository.find({
      where: {
        emp_no: emp.emp_no
      }
    });
  }

  @Mutation(returns => Employee)
  async addEmployee(@Arg('employee') emp: EmployeeInput) {
    const { max_no } = await this.employeeRepository
      .createQueryBuilder('emp')
      .select('MAX(emp.emp_no)', 'max_no')
      .getRawOne();

    const emp_no = max_no + 1;
    await getConnection().transaction(async t => {
      const input = { ...emp, emp_no };
      emp.titles.forEach(t => (t.emp_no = emp_no));
      emp.salaries.forEach(t => (t.emp_no = emp_no));

      const [newEmp, titles, salaries] = await Promise.all([
        this.employeeRepository.create(input),
        this.titleRepository.create(emp.titles),
        this.salaryRepository.create(emp.salaries)
      ]);

      await t.save(newEmp);
      await Promise.all([t.save(titles), t.save(salaries)]);
    });

    return this.employeeRepository.findOne({
      where: {
        emp_no
      }
    });
  }
}
