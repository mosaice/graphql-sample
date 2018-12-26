import { ObjectType, Field, Int } from 'type-graphql';
import { Department } from '../entity/Department';
import { List } from './base/List';

@ObjectType()
export class DepartmentList extends List {
  @Field(type => [Department])
  departments: Department[];
}
