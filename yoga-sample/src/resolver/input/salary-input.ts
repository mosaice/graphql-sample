import { Salary } from '../../entity/Salary';
import { InputType, Field } from 'type-graphql';

@InputType()
export class SalaryInput implements Partial<Salary> {
  @Field(type => Date, {
    nullable: true,
    defaultValue: new Date()
  })
  from_date?: Date;

  @Field()
  to_date: Date;

  @Field()
  salary: number;
}
