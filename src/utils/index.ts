export * from './logger';
export * from './inputToSearchOptions';

export const isEmpty = (obj: object) => Object.keys(obj).length === 0;

export const range = (length: number, from = 0) =>
  new Array(length).fill(undefined).map((_, idx) => idx + from);
