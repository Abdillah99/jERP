export class HTTPError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (err: unknown) => {
  if (err instanceof HTTPError) {
    throw err;
  }
  throw new HTTPError(500, (err as Error).message);
};
