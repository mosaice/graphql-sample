import { ObjectType, Field, Int, ID } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity('titles')
@ObjectType()
export class Title {
  @Field(type => ID)
  @PrimaryColumn({ select: false })
  // @JoinColumn({
  //   name: 'emp_no'
  // })
  emp_no: number;

  @Field(type => String)
  @PrimaryColumn({ type: 'date' })
  from_date: Date;

  @Field(type => String)
  @Column({ type: 'date' })
  to_date: Date;

  @Field()
  @PrimaryColumn()
  title: string;

  // @ManyToOne(type => Employee, emp => emp.titles)
  // employee: Employee;
}
