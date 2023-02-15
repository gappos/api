export const getName = (...args: Array<string | undefined>): string =>
  args.filter(Boolean).join(' ');
