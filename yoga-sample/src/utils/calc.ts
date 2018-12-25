import { List } from '../type';

type PaginationQuery = Readonly<{
  take: number;
  skip: number;
}>;

type ListLike = Readonly<{
  current: number;
  size: number;
}>;

export const calcPage = (pagi: List): PaginationQuery => ({
  take: pagi.size,
  skip: (pagi.current - 1) * pagi.size
});
