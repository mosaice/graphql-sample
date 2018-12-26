import { ObjectType, Field, Int } from 'type-graphql';
import { DepartmentEmployee } from '../entity/DepartmentEmployee';
import { List } from './base/List';

@ObjectType()
export class DepartmentEmployList extends List {
  @Field()
  dept_no: string;

  @Field(type => [DepartmentEmployee])
  employees: DepartmentEmployee[];
}
