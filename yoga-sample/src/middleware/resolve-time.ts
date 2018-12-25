import { MiddlewareFn } from 'type-graphql';

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const isRoot = info.parentType.name === 'Query';
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;
  if (isRoot)
    console.log(
      `${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`
    );
};
