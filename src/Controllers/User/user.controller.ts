import { NextFunction, Request, Response } from 'express';
import ErrorHandler from "../../Utils/errorhandler";
import ResponseHandler from "../../Utils/resHandler";

export const getProfile = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return next(new ErrorHandler("User not authenticated", 401));
    }

    ResponseHandler.send(res, "Profile fetched successfully", user);
    return
};