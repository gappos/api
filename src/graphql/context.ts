export interface Context {
  dummy?: boolean;
}

export const graphqlContext = (): Context => ({
  dummy: true,
});
