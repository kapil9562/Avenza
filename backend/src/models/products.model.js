import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    date: Date,
    reviewerName: String,
    reviewerEmail: String
}, { _id: false });

const dimensionsSchema = new mongoose.Schema({
    width: Number,
    height: Number,
    depth: Number
}, { _id: false });

const metaSchema = new mongoose.Schema({
    createdAt: Date,
    updatedAt: Date,
    barcode: String,
    qrCode: String
}, { _id: false });

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        unique: true
    },
    title: String,
    description: String,
    category: String,
    parentCategory: {
        type: String,
        index: true
    },
    price: Number,
    discountPercentage: Number,
    rating: {
        type: Number,
        default: 0
    },
    stock: Number,
    tags: [String],
    brand: String,
    sku: String,
    weight: Number,
    dimensions: dimensionsSchema,
    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: String,
    reviews: [reviewSchema],
    returnPolicy: String,
    minimumOrderQuantity: Number,
    meta: metaSchema,
    images: [String],
    thumbnail: String
}, { timestamps: true });

productSchema.pre("save", function () {

    if (this.reviews && this.reviews.length > 0) {

        const totalRating = this.reviews.reduce(
            (acc, review) => acc + (review.rating || 0),
            0
        );

        this.rating = Number(
            (totalRating / this.reviews.length).toFixed(1)
        );

    } else {
        this.rating = 0;
    }

});

export default mongoose.model("Product", productSchema);
