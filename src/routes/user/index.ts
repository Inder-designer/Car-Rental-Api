import { Router } from 'express';
import { getProfile } from '../../Controllers/User/user.controller';
const router = Router();

router.get('/', getProfile);
export default router;