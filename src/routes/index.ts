import { Router } from 'express';
import authRoutes from "./auth/index";
import userRoutes from "./user/index";
import adminRoutes from "./admin/index";
import generalRoutes from "./general/index";
const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/", generalRoutes);

export default router;