import { Prisma } from '@prisma/client';
import { TypedResponse } from 'src/types';

export default (res: TypedResponse<any>, e: any) => {
  console.error(e);
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      error: true,
      errorMessage: 'Email is already used!',
      data: null
    });
    return;
  }

  res.status(400).json({
    error: true,
    errorMessage: 'Unkown Error',
    data: null
  });
};
