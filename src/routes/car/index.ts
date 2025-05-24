import { Router } from 'express';
import { addCar, getCarDetails, getList } from '../../Controllers/Car/car.controller';
const router = Router();

router.post('/add', addCar);
router.get('/list', getList);
router.get('/:id', getCarDetails);

export default router;