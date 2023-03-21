import { Request } from 'express';

const isNotIntrospection = (query: string): boolean => query.indexOf('IntrospectionQuery') === -1;

export default (req: Request): void => {
  if (req.body && isNotIntrospection(req?.body?.query)) {
    console.log('QUERY LOGGER BEGIN');
    console.log(req?.body?.query.trim());
    console.log('QUERY LOGGER END\n');
  }
};
