import authGuard from '../guards/auth';
import { createStatus, deleteStatus, editStatus, getStatuses } from '../controllers/status';
import { Router } from 'express';

const router = Router();

router.post('/createStatus', authGuard, createStatus);
router.post('/deleteStatus/:id', authGuard, deleteStatus);
router.post('/editStatus/:id', authGuard, editStatus);
router.get('/getStatuses', authGuard, getStatuses);

export default router;
