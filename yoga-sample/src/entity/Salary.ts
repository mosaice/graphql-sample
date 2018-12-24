import { ObjectType, Field, ID } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity('salaries')
@ObjectType()
export class Salary {
  @Field(type => ID)
  @PrimaryColumn()
  // @JoinColumn({ name: 'emp_no' })
  emp_no: number;

  @Field(type => String)
  @PrimaryColumn({ type: 'date' })
  from_date: Date;

  @Field(type => String)
  @Column({ type: 'date' })
  to_date: Date;

  @Field()
  @Column()
  salary: number;

  // @ManyToOne(type => Employee, emp => emp.salaries)
  // readonly employee: Employee;
}
