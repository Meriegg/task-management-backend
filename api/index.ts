import { Response } from 'express';

export interface ControllerReturnType<T> {
  error: boolean;
  errorMessage: string | null;
  data: T | null;
}

export type TypedResponse<T> = Response<ControllerReturnType<T>>;
