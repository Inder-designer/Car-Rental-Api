import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import Product from "../../models/Product/Product";
import ErrorHandler from "../../Utils/errorhandler";
import ResponseHandler from "../../Utils/resHandler";
import Variant from "../../models/Product/Variant";

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

    let variantIds: any[] = [];
    if (variants && variants.length > 0) {
        for (const variantData of variants) {
            const attrValue = variantData.attributes?.[0]?.values?.[0] || "default";
            const variantSku = variantData.sku || generateSKU(name, attrValue);

            const newVariant = new Variant({
                ...variantData,
                sku: variantSku,
            });

            await newVariant.save();
            variantIds.push(newVariant._id);
        }
    }

    const productSku = sku || generateSKU(name, attributes?.[0]?.values?.[0] || "default");

    // Step 3: If no variants, use main product fields
    const product = new Product({
        name,
        slug,
        description,
        images,
        brand,
        tags,
        price: variants?.length ? 0 : price,
        discount: variants?.length ? 0 : discount,
        Stock: variants?.length ? 0 : Stock,
        orderLimit,
        attributes,
        sku: variants?.length ? "" : productSku,
        variants: variantIds,
        isActive,
    });

    await product.save();

    ResponseHandler.send(res, "Product created successfully", product, 201)
};

// update product details
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, images, brand, tags, price, discount, Stock, orderLimit, attributes, sku, variants } = req.body;

    const productId = req.params.id;

    let product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const attrValue = !variants?.length ? attributes?.[0]?.values?.[0] : variants.attributes?.[0]?.values?.[0] || "default";
    let finalVariants = [];
    if (variants && variants.length > 0) {
        finalVariants = variants.map((variant: any) => {
            console.log(attributes);
            return {
                ...variant,
                sku: variant.sku || generateSKU(name || product.name, attrValue)
            };
        });
    }

    const productSku = sku || generateSKU(name || product.name, attrValue);

    // Step 3: If no variants, use main product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.tags = tags || product.tags;
    product.price = variants?.length ? 0 : price || product.price;
    product.discount = variants?.length ? 0 : discount || product.discount;
    product.Stock = variants?.length ? 0 : Stock || product.Stock;
    product.orderLimit = orderLimit || product.orderLimit;
    product.attributes = attributes || product.attributes;
    product.sku = variants?.length ? "" : sku || productSku;
    product.variants = finalVariants.length > 0 ? finalVariants : undefined;

    await product.save();

    ResponseHandler.send(res, "Product updated successfully", product, 200)
}

// Get Product Details

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {

    const productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    ResponseHandler.send(res, "Product details", product, 200)
}

// Get all products
export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    ResponseHandler.send(res, "All products", products, 200)
}

// Activate/Deactivate Product
export const activateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const { isActive } = req.body;

    let product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product.isActive = isActive;
    await product.save();

    ResponseHandler.send(res, "Product status updated", product, 200)
}

// Delete Product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await product.deleteOne();
    ResponseHandler.send(res, "Product deleted successfully", {}, 200)
}
