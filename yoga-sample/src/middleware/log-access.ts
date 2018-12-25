import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';

export class LogAccessMiddleware implements MiddlewareInterface<any> {
  async use({ context, info }: ResolverData<any>, next: NextFn) {
    const username: string = context.username || 'guest';
    console.log(
      `Logging access: ${username} -> ${info.parentType.name}.${info.fieldName}`
    );
    return next();
  }
}
