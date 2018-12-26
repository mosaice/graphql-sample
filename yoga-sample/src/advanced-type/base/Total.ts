import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Total {
  @Field(type => Int)
  counts: number;

  @Field(type => Int)
  total_pages: number;
}
