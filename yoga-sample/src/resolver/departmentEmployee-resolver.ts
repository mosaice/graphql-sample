import { Resolver, FieldResolver, Root, ResolverInterface } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Employee, DepartmentEmployee, Department } from '../advanced-type';

@Resolver(DepartmentEmployee)
export class DepartmentEmployeeResolver
  implements ResolverInterface<DepartmentEmployee> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly depRepository: Repository<Department>
  ) {}

  @FieldResolver({ complexity: 5 })
  async employee(@Root() depE: DepartmentEmployee) {
    return await this.employeeRepository.findOne({
      where: {
        emp_no: depE.emp_no
      }
    });
  }

  @FieldResolver({ complexity: 5 })
  async department(@Root() emp: DepartmentEmployee) {
    return await this.depRepository.findOne({
      where: {
        dept_no: emp.dept_no
      }
    });
  }
}
