export const getName = (...args: Array<string | undefined>): string =>
  args.filter(Boolean).join(' ');

export const getAddress = (...args: Array<string | undefined>): string =>
  args.filter(Boolean).join(', ');
