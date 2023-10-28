export const createThrowMiddleware =
  ({
    timesOutOfTenToThrow,
    shouldThrowRandomly,
  }: {
    timesOutOfTenToThrow: number;
    shouldThrowRandomly: boolean;
  }) =>
  () => {
    if (shouldThrowRandomly) {
      if (Math.random() > 1 - timesOutOfTenToThrow / 10)
        throw new Error("Shit");
    }
  };
