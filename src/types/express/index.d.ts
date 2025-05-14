import { IUser } from "../../models/User/User";

declare global {
    namespace Express {
        interface User extends IUser { }
        interface Request {
            user?: IUser;
        }
    }
}