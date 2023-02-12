import { Request, Response } from 'express';
import { BaseContext } from '@apollo/server';
import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';
import queryLogger from './queryLogger';

interface ContextType extends BaseContext {
  req: Request;
  res: Response;
}

export default async ({ req, res }: ExpressContextFunctionArgument): Promise<ContextType> => {
  queryLogger(req);
  return { req, res };
};
