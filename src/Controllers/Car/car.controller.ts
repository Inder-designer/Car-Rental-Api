import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors";
import Car, { ICar } from "../../models/Car/Car";
import { IUser } from "../../models/User/User";
import ErrorHandler from "../../Utils/errorhandler";
import ResponseHandler from "../../Utils/resHandler";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const stepFields: Record<Step, string[]> = {
    1: [
        "brand",
        "model",
        "year",
        "transmission",
        "fuelType",
        "seats",
        "doors",
        "category",
        "description",
        "listingType"
    ],
    2: ["images"],
    3: ["features", "description"],
    4: ["rentDetails", "saleDetails"],
    5: ["ownerInfo"],
    6: ["documents"],
    7: []
};

export const addCar = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { step: rawStep, listingId, ...carData } = req.body;
    const user = req.user as IUser

    const step = parseInt(req.body.step, 10) as Step;

    if (!(step in stepFields)) {
        return next(new ErrorHandler("Invalid step", 400));
    }

    const updateData: Partial<ICar> = {};
    for (const field of stepFields[step]) {
        if (carData[field] !== undefined) {
            updateData[field as keyof ICar] = carData[field];
        }
    }

    if (listingId) {
        const car = await Car.findOne({ _id: listingId, listedBy: user._id });
        if (!car) return next(new ErrorHandler("Car listing not found", 404));

        updateData.currentStep = Math.max(car.currentStep || 1, Math.min(step + 1, 7));

        updateData.status = step === 7 ? "published" : car.status !== "published" ? "draft" : car.status;

        const updatedCar = await Car.findByIdAndUpdate(listingId, { $set: updateData }, { new: true }).lean();
        return ResponseHandler.send(res, `Step ${step} saved`, updatedCar, 200);
    }
    if (step !== 1) return next(new ErrorHandler("Invalid initial step", 400));

    const newCar = await Car.create({
        ...updateData,
        listedBy: user._id,
        status: "draft",
        currentStep: 2,
    });


    return ResponseHandler.send(res, `Step ${step} saved`, newCar, 200);
});
