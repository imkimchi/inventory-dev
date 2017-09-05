import mongoose from 'mongoose'
import User from './user'

const PostSchema = mongoose.Schema({
    productTitle: {
        type: String,
        required: true
    },
    productSubTitle: {
        type: String,
        required: true
    },
    productSize: {
        type: Number,
        requried: true
    },
    productImage: {
        type: Object,
        required: true
    },
    productURL: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    shipping: {
        type: Object,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    market: {
        type: String,
        required: true
    },
    paypalAccount: {
        type: String,
        required: false
    },
    buyItNow: {
        type: Boolean
    },
    acceptOffers: {
        type: Boolean
    },
    like: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    editDate: {
        type: Date
    },
    timeAgo: {
        type: String,
        default: ""
    },
    classes: {
        type: Array
    },
    sellerCountry: {
        type: String
    }
})

export default mongoose.model('post', PostSchema)