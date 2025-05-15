import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { nanoid } from "nanoid";
import Product from "../../models/Product/Product";
import ErrorHandler from "../../Utils/errorhandler";
import ResponseHandler from "../../Utils/resHandler";

export const generateSKU = (name: string, attrValue?: string) => {

    const initials = name
        .split(" ")
        .filter(Boolean)
        .map(word => word[0].toUpperCase())
        .join("");

    const base = initials.slice(0, 4);
    console.log(name, base, attrValue);

    const suffix = attrValue
        ? attrValue.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4)
        : "BASE";

    const rand = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0"); // Ensure 4 digits

    return `${base}-${suffix}-${rand}`;
};
export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        description,
        images,
        brand,
        tags,
        avgRatings,
        price,
        discount,
        Stock,
        orderLimit,
        attributes,
        sku,
        variants,
        isActive,
    } = req.body;

    // Step 1: Generate unique slug
    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    const rand = Math.floor(Math.random() * 10000);
    while (await Product.findOne({ slug })) {
        slug = `${baseSlug}-${rand}`;
    }

    // Step 2: Handle variants (optional)
    const attrValue = !variants?.length ? attributes?.[0]?.values?.[0] : variants.attributes?.[0]?.values?.[0] || "default";
    let finalVariants = [];
    if (variants && variants.length > 0) {
        finalVariants = variants.map((variant: any) => {
            console.log(attributes);
            return {
                ...variant,
                sku: variant.sku || generateSKU(name, attrValue)
            };
        });
    }

    const productSku = sku || generateSKU(name, attrValue);

    // Step 3: If no variants, use main product fields
    const product = new Product({
        name,
        slug,
        description,
        images,
        brand,
        tags,
        avgRatings,
        price: variants?.length ? 0 : price,
        discount: variants?.length ? 0 : discount,
        Stock: variants?.length ? 0 : Stock,
        orderLimit,
        attributes,
        sku: variants?.length ? "" : productSku,
        variants: finalVariants,
        isActive,
    });

    await product.save();

    ResponseHandler.send(res, "Product created successfully", product, 201)
};
