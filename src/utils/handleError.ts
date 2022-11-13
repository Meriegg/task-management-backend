import { Prisma } from '@prisma/client';
import { TypedResponse } from 'src/types';

export default (res: TypedResponse<any>, e: any) => {
  console.error(e);
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P1002':
        res.status(400).json({
          error: true,
          errorMessage: e.message || 'Connection timed out!',
          data: null
        });
        return;

      case 'P2001':
        res.status(400).json({
          error: true,
          errorMessage: e.message || 'Cannot find model!',
          data: null
        });
        return;

      case 'P2002':
        res.status(400).json({
          error: true,
          errorMessage:
            e.message || `Field(s) ${(e.meta?.target as string[]).join(', ')} are / is already used!`,
          data: null
        });
        return;

      default:
        res.status(400).json({
          error: true,
          errorMessage: e.message || 'Unknown database erorr',
          data: null
        });
        return;
    }
  }

  res.status(400).json({
    error: true,
    errorMessage: 'Unkown Error',
    data: null
  });
};
