import { Resolver, FieldResolver, Root, ResolverInterface } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Employee, DepartmentManager, Department } from '../advanced-type';

@Resolver(DepartmentManager)
export class DepartmentManagerResolver
  implements ResolverInterface<DepartmentManager> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly depRepository: Repository<Department>
  ) {}

  @FieldResolver({ complexity: 5 })
  async employee(@Root() emp: DepartmentManager) {
    return await this.employeeRepository.findOne({
      where: {
        emp_no: emp.emp_no
      }
    });
  }

  @FieldResolver({ complexity: 5 })
  async department(@Root() emp: DepartmentManager) {
    return await this.depRepository.findOne({
      where: {
        dept_no: emp.dept_no
      }
    });
  }
}
