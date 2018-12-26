import { InterfaceType, ObjectType, Field, Int } from 'type-graphql';
import { Min, Max } from 'class-validator';
import { Total } from './Total';
// extends Object type bug
// https://github.com/19majkel94/type-graphql/issues/160

@ObjectType()
export class List {
  @Field(type => Int)
  @Min(1)
  @Max(50)
  size: number;

  @Field(type => Int)
  @Min(1)
  current: number;

  @Field(type => Total)
  total: Total;
}

// @InterfaceType()
// export abstract class IList {
//   @Field(type => Int)
//   @Min(1)
//   @Max(50)
//   size: number;

//   @Field(type => Int)
//   @Min(1)
//   current: number;

//   @Field(type => Int)
//   total: number;

//   @Field(type => Int)
//   total_pages: number;
// }
