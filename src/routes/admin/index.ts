import { Router } from 'express';
import { addProduct } from '../../Controllers/Product/product.controller';
const router = Router();

router.post('/add-product', addProduct);
export default router;