import { IProduct } from "../../models/Product/Product";
import { IVariantSchema } from "../../models/Product/VariantSchema";
import { IUser } from "../../models/User/User";

declare global {
    namespace Express {
        interface User extends IUser { }
        interface Product extends IProduct { }
        interface Request {
            user?: IUser;
            product?: IProduct;
        }
    }
}