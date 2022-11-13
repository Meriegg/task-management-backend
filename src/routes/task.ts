import authGuard from '../guards/auth';
import { createTask } from '../controllers/task';
import { Router } from 'express';

const router = Router();

router.post('/createTask', authGuard, createTask);

export default router;
