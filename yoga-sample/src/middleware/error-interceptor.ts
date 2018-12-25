import { MiddlewareFn } from 'type-graphql';

export const ErrorInterceptor: MiddlewareFn = async (
  { context, info },
  next
) => {
  try {
    return await next();
  } catch (err) {
    // write error to file log
    console.log(err, context, info);

    // rethrow the error
    throw err;
  }
};
