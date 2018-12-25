import { ObjectType, Field, Int } from 'type-graphql';
import { Employee } from '../entity/Employee';
import { List } from './base/List';

// @ObjectType({ implements: IList })
// export class EmployeeList implements IList {
//   size: number;
//   current: number;
//   total: number;
//   total_pages: number;

//   @Field(type => [Employee])
//   employees: Employee[];
// }

@ObjectType()
export class EmployeeList extends List {
  @Field(type => [Employee])
  employees: Employee[];
}
