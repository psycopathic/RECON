import mongoose from "mongoose";

const priceComparisonSchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ["amazon", "flipkart", "snapdeal", "meesho"],
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		priceComparisons: [priceComparisonSchema],
},{timestamps: true});

const Product = mongoose.model("Product", productSchema);
export default Product