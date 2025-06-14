import { Router } from 'express';
import { getAllProduct, getProduct } from '../../Controllers/Product/product.controller';
import { getCategories } from '../../Controllers/Product/category.controller';
import upload from '../../middleware/multer';
import { uploadMultipleImages, uploadSingleImage } from '../../Controllers/Upload/upload.controller';
const router = Router();

router.get('/product/:id', getProduct);
router.get('/products', getAllProduct);
router.get('/categories', getCategories)

router.post("/upload-single", upload.single("image"), uploadSingleImage);
router.post("/upload-multiple", upload.array("images"), uploadMultipleImages);

export default router;