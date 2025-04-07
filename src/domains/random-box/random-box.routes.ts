import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { RequestHandler } from 'express';
import { requestHandler } from '../../utils/requestHandler';
import { openBox } from './controllers/random-boc.contreller';
import { status } from './controllers/random-boc.contreller';

const router = Router();

router.get('/', authenticate, requestHandler(status));

router.post('/', authenticate, requestHandler(openBox));
export default router;
