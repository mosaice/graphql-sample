import { ObjectType, Field, Int, ID, registerEnumType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryColumn, OneToMany } from 'typeorm';
import { Salary } from './Salary';
import { Title } from './Title';

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
  @PrimaryColumn()
  readonly emp_no: number;

  @Field(type => String)
  @Column({ type: 'date' })
  birth_date: Date;

  @Field()
  @Column()
  first_name: string;

  @Field()
  @Column()
  last_name: string;

  @Field(type => Gender)
  @Column('enum', { enum: Gender })
  gender: Gender;

  @Field(type => String)
  @Column({ type: 'date' })
  hire_date: Date;

  @Field(type => [Title])
  // @OneToMany(type => Title, title => title.employee)
  titles: Title[];

  @Field(type => [Salary])
  // @OneToMany(type => Salary, salary => salary.employee)
  salaries: Salary[];
}
