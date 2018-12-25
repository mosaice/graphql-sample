import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Args,
  ArgsType,
  Field,
  Int,
  FieldResolver,
  Root,
  ResolverInterface
} from 'type-graphql';
import { Min, Max } from 'class-validator';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Employee } from '../entity/Employee';
import { Title } from '../entity/Title';
import { Salary } from '../entity/Salary';
import { EmployeeInput } from './input/employee-input';

@ArgsType()
class PaginationArgs {
  @Field(type => Int, { defaultValue: 1 })
  @Min(1)
  private page: number;

  @Field(type => Int, { defaultValue: 10 })
  @Min(1)
  @Max(50)
  private size: number;

  take = () => this.size;
  skip = () => (this.page - 1) * this.size;
}

@Resolver(Employee)
export class EmployeeResolver implements ResolverInterface<Employee> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Title)
    private readonly titleRepository: Repository<Title>,
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>
  ) {}

  @Query(returns => [Employee])
  async employees(@Args() { take, skip }: PaginationArgs) {
    return await this.employeeRepository.find({
      take: take(),
      skip: skip()
    });
  }

  @FieldResolver()
  async titles(@Root() emp: Employee) {
    return await this.titleRepository.find({
      where: {
        emp_no: emp.emp_no
      }
    });
  }

  @FieldResolver()
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
