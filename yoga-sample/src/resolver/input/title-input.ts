import { Title } from '../../entity/Title';
import { InputType, Field } from 'type-graphql';

@InputType()
export class TitleInput implements Partial<Title> {
  @Field(type => Date, {
    nullable: true,
    defaultValue: new Date()
  })
  from_date?: Date;

  @Field()
  to_date: Date;

  @Field()
  title: string;
}
