import { ObjectType, Field, ID } from 'type-graphql';
import { Column, Entity, PrimaryColumn, JoinColumn } from 'typeorm';
import { DepartmentEmployee } from './DepartmentEmployee';
import { DepartmentManager } from './DepartmentManager';

@Entity('departments')
@ObjectType()
export class Department {
  @Field(type => ID)
  @PrimaryColumn()
  dept_no: string;

  @Field()
  @Column()
  dept_name: string;

  @Field(type => [DepartmentEmployee])
  employees: DepartmentEmployee[];


  @Field(type => [DepartmentManager])
  managers: DepartmentManager[];

}
