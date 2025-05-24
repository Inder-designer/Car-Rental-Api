import mongoose from 'mongoose';

export interface ICar {
    listedBy: mongoose.Types.ObjectId;
    title: string;
    brand: string;
    model: string;
    year: number;
    transmission?: string;
    fuelType?: string;
    seats: number;
    doors: number;
    category: string;
    totalRunning?: number;
    listingType: "sell" | "rent";
    images?: {
        public_id: string;
        url: string;
        thumbnail?: boolean;
    }[];
    features?: string[];
    description: string;
    rentDetails?: any;
    saleDetails?: any;
    ownerInfo?: any;
    documents?: any;
    status: "draft" | "published";
    currentStep: number;
}
const carListingSchema = new mongoose.Schema<ICar>(
    {
        listedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // Car Info
        title: { type: String, required: true },
        brand: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true, min: 1990, max: new Date().getFullYear() + 1 },
        transmission: { type: String, enum: ["manual", "automatic"] },
        fuelType: { type: String, enum: ["petrol", "diesel", "electric", "hybrid"] },
        seats: { type: Number, required: true, min: 1 },
        doors: { type: Number, required: true, min: 2 },
        category: { type: String, required: true },
        totalRunning: Number,
        listingType: {
            type: String,
            enum: ["sell", "rent"],
            required: true
        },

        // Images
        images: [
            {
                public_id: String,
                url: String,
                thumbnail: Boolean
            },
        ],

        // Features
        features: { type: [String] },
        description: String,


        rentDetails: {
            // Location & Availability
            pickuplocation: String,
            address: String,
            city: String,
            availableFrom: Date,
            availableTo: Date,
            available: Boolean,

            // Pricing & Charges
            price: Number,
            priceUnit: { type: String, enum: ['per_hour', 'per_day', 'per_week'] },
            deposit: Number,
            lateFee: Number,
        },

        saleDetails: {
            price: Number,
            isSold: Boolean,
            condition: { type: String, enum: ['new', 'used'] },
            owner: Number,
        },

        // Owner Info
        ownerInfo: {
            ownerName: String,
            ownerEmail: String,
            ownerPhone: String,
        },

        // Documents
        documents: {
            carRegistration: String,
            insuranceDocument: String,
        },
        status: {
            type: String,
            enum: ['draft', 'active', 'inactive'],
            default: 'draft'
        },
        currentStep: {
            type: Number,
            default: 1
        }

    },
    { timestamps: true }
);
carListingSchema.index({ listingType: 1 });

carListingSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.saleDetails?.ownerEmail;
        delete ret.saleDetails?.ownerPhone;
        return ret;
    }
});

export default mongoose.model<ICar>("Cars", carListingSchema);
