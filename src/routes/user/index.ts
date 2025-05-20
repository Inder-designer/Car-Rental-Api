import { Router } from 'express';
import { addToCart, addWishlist, getCart, getProfile, getWishlist, removeFromCart, removeWishlist, updateCartItem } from '../../Controllers/User/user.controller';
const router = Router();

router.get('/', getProfile);

// Wishlist
router.get('/wishlist', getWishlist);
router.route('/wishlist/:id')
    .put(addWishlist)
    .delete(removeWishlist)

// Cart
router.route('/cart')
    .get(getCart)
    .put(addToCart)
    .patch(updateCartItem)
    .delete(removeFromCart)
export default router;