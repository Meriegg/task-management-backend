import authGuard from '../guards/auth';
import { createBoard, deleteBoard, editBoard, getBoards } from '../controllers/boards';
import { Router } from 'express';

const router = Router();

router.post('/createBoard', authGuard, createBoard);
router.post('/editBoard/:id', authGuard, editBoard);
router.post('/deleteBoard/:id', authGuard, deleteBoard);
router.get('/getBoards', authGuard, getBoards);

export default router;
