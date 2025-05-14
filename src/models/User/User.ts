import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    name: string,
    email: string,
    password: string,
    number: string,
    avatar: {
        url: string,
        publicId: string
    },
    role: string,
    isEmailVerified: boolean,
    isNumberVerified: boolean
    generateToken(): string,
    generateResetToken(): string,
    comparePassword(password: string): Promise<boolean>,
}

export interface IUserModel extends Model<IUser> {
    verifyToken: (token: string) => Promise<IUser | null>;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please Enter Your Name"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [4, "Name should have more than 4 characters"],
        },
        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            validate: [validator.isEmail, "Please Enter a valid Email"],
        },
        password: {
            type: String,
            required: [true, "Please Enter Your Password"],
            minLength: [8, "Password should be greater than 8 characters"],
            select: false,
        },
        number: {
            type: String,
            unique: true,
            message: "Please enter a valid number",
        },
        avatar: {
            url: { type: String },
            publicId: { type: String },
        },
        role: {
            type: String,
            enum: ["admin", "customer"],
            default: "customer",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isNumberVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    user.password = await bcrypt.hash(user.password, 10);

    next();
});

UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// jwt authentication
UserSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET!, {
        expiresIn: "10d",
    });
};

// generateResetToken
UserSchema.methods.generateResetToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
        expiresIn: "10m",
    });
};
// verify Token
UserSchema.statics.verifyToken = async function (token: string): Promise<IUser | null> {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof decoded !== "string" && "id" in decoded) {
            const user = await this.findById(decoded.id);
            if (!user) {
                throw new Error("Token is invalid or expired");
            }
            return user;
        }
        throw new Error("Token is invalid or expired");
    } catch (err) {
        throw new Error("Token is invalid or expired");
    }
};
export { IUser }
export default mongoose.model<IUser, IUserModel>("User", UserSchema);