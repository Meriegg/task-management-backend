import authGuard from '../guards/auth';
import refreshTokenGuard from '../guards/refreshToken';
import { register, login, refreshToken } from '../controllers/auth';
import { Router } from 'express';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/refreshToken', authGuard, refreshTokenGuard, refreshToken);

export default router;
