import { Router } from 'express';
import { addWishlist, getProfile, getWishlist, removeWishlist } from '../../Controllers/User/user.controller';
const router = Router();

router.get('/', getProfile);

// Wishlist
router.get('/wishlist', getWishlist);
router.route('/wishlist/:id')
    .put(addWishlist)
    .delete(removeWishlist)

// Cart
router.get('/cart', getWishlist);
router.route('/cart/:id')
    .put(addWishlist)
    .delete(removeWishlist)
export default router;