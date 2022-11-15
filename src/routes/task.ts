import authGuard from '../guards/auth';
import { createTask, deleteTask, editTask, getTasks } from '../controllers/task';
import { Router } from 'express';

const router = Router();

router.post('/createTask', authGuard, createTask);
router.post('/deleteTask/:id', authGuard, deleteTask);
router.post('/editTask/:id', authGuard, editTask);
router.get('/getTasks', authGuard, getTasks);

export default router;
