import { Router } from 'express';
import { getAllProduct, getProduct} from '../../Controllers/Product/product.controller';
import { getCategories } from '../../Controllers/Product/category.controller';
const router = Router();

router.get('/product/:id', getProduct);
router.get('/products', getAllProduct);
router.get('/categories', getCategories)

export default router;