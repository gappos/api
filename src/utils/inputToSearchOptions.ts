import { Op } from 'sequelize';
import { logger } from './logger';

export type SearchOptions = Record<string, unknown>;
export interface InputToSearchOptions {
  equalKeys?: string[];
  dateKeys?: string[];
}
export const inputToSearchOptions = (inputObj: SearchOptions, options?: InputToSearchOptions) =>
  Object.keys(inputObj ?? {}).reduce((searchObj: SearchOptions, key) => {
    if (options?.equalKeys && options.equalKeys.includes(key)) searchObj[key] = inputObj[key];
    else if (options?.dateKeys && options.dateKeys.includes(key))
      searchObj[key] = getDateRangeSearchObj(inputObj[key] as string);
    else searchObj[key] = { [Op.iLike]: inputObj[key] };
    return searchObj;
  }, {});

export const getDateRangeSearchObj = (date: string) => {
  const getLastDay = (date: string): Date => {
    const [year, month, day] = date.split('-');
    return day ? new Date(date) : new Date(+year, month ? +month : 12, 0);
  };

  const [from, to] = date.split(':');
  const dateFrom = new Date(from);
  const dateTo = new Date(to);

  if (
    dateFrom.toString() === 'Invalid Date' ||
    (to !== undefined && dateTo.toString() === 'Invalid Date')
  ) {
    logger('utils').error(
      'getDateRangeSearchObj()',
      'got wrong date, correct usage is from:to like "2000:2020-02-02"',
    );
    return {};
  }

  const [, , dayFrom] = from.split('-');
  if (!!dayFrom && !to) return new Date(dateFrom);

  const dateSearchTo = !!to ? getLastDay(to) : getLastDay(from);

  return { [Op.between]: [dateFrom, dateSearchTo] };
};
