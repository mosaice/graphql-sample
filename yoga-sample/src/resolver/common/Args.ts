import { ArgsType, Field, Int } from 'type-graphql';
import { Min, Max } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, { defaultValue: 1 })
  @Min(1)
  page: number;

  @Field(type => Int, { defaultValue: 10 })
  @Min(1)
  @Max(50)
  size: number;

  take = () => this.size;
  skip = () => (this.page - 1) * this.size;
}
