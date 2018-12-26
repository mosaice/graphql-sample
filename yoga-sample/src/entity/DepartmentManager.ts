import { ObjectType, Field, ID } from 'type-graphql';
import { Column, Entity, PrimaryColumn, JoinColumn } from 'typeorm';
import { Employee } from './Employee';
import { Department } from './Department';


@Entity('dept_manager')
@ObjectType()
export class DepartmentManager {

  @Field(type => ID)
  @PrimaryColumn()
  emp_no: number;

  @Field(type => ID)
  @PrimaryColumn()
  dept_no: string;

  @Field(type => String)
  @Column({ type: 'date' })
  to_date: Date;

  @Field(type => String)
  @Column({ type: 'date' })
  from_date: Date;

  @Field(type => Employee)
  employee: Employee;

  @Field(type => Department)
  department: Department;
}
