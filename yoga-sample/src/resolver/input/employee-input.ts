import { Employee, Gender } from '../../entity/Employee';
import { Salary } from 'entity/Salary';
import { Title } from 'entity/Title';
import { InputType, Field } from 'type-graphql';
import { SalaryInput } from './salary-input';
import { TitleInput } from './title-input';

@InputType()
export class EmployeeInput implements Partial<Employee> {
  @Field()
  birth_date: Date;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  gender: Gender;

  @Field(type => Date, {
    nullable: true,
    defaultValue: new Date()
  })
  hire_date?: Date;

  @Field(type => [SalaryInput])
  salaries: Salary[];

  @Field(type => [TitleInput])
  titles: Title[];
}
