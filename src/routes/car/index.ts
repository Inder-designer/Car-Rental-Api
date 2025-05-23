import { Router } from 'express';
import { addCar } from '../../Controllers/Car/car.controller';
const router = Router();

router.post('/add', addCar);

export default router;