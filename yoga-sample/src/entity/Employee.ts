import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  UseMiddleware,
  Authorized
} from 'type-graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Salary } from './Salary';
import { Title } from './Title';
import { LogAccessMiddleware } from 'middleware';
import { DepartmentEmployee } from './DepartmentEmployee';
import { DepartmentManager } from './DepartmentManager';

export enum Gender {
  Male = 'M',
  Female = 'F'
}

registerEnumType(Gender, {
  name: 'Gender', // this one is mandatory
  description: 'man or woman' // this one is optional
});

@Entity('employees')
@ObjectType()
export class Employee {
  @Field(type => ID)
  @UseMiddleware(LogAccessMiddleware)
  @PrimaryColumn()
  readonly emp_no: number;

  @Authorized()
  @Field(type => String)
  @Column({ type: 'date' })
  birth_date: Date;

  @Field()
  @Column()
  first_name: string;

  @Field()
  @Column()
  last_name: string;

  @Authorized('ADMIN')
  @Field(type => Gender)
  @Column('enum', { enum: Gender })
  gender: Gender;

  @Authorized('REGULAR')
  @Field(type => String)
  @Column({ type: 'date' })
  hire_date: Date;

  @Field(type => [Title], {
    complexity: 10
  })
  // @OneToMany(type => Title, title => title.employee)
  titles: Title[];

  @Field(type => [Salary], {
    complexity: 10
  })
  // @OneToMany(type => Salary, salary => salary.employee)
  salaries: Salary[];

  @Field(type => [DepartmentEmployee])
  // @OneToMany(type => Salary, salary => salary.employee)
  departments: DepartmentEmployee[];

  @Field(type => [DepartmentManager])
  // @OneToMany(type => Salary, salary => salary.employee)
  managed_departments: DepartmentManager[];
}
