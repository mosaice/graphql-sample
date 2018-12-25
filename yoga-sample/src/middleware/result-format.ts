import { MiddlewareFn } from 'type-graphql';

export const DataInterceptor: MiddlewareFn = async ({ info }, next) => {
  let result = await next();

  if (info.fieldName === 'emp_no') result = 'ID:' + result;
  return result;
};
