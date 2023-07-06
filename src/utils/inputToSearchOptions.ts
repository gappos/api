import { Op } from 'sequelize';

type SearchOptions = Record<string, unknown>;
export interface InputToSearchOptions {
  equalKeys?: string[];
  dateKeys?: string[];
}
export const inputToSearchOptions = (inputObj: SearchOptions, options?: InputToSearchOptions) =>
  Object.keys(inputObj ?? {}).reduce((searchObj: SearchOptions, key) => {
    if (options?.equalKeys && key in options.equalKeys) searchObj[key] = inputObj[key];
    else if (options?.dateKeys && options.dateKeys)
      searchObj[key] = inputObj[key]; // TODO: logic for date fields
    else searchObj[key] = { [Op.iLike]: inputObj[key] };
    return searchObj;
  }, {});
