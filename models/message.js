import mongoose from 'mongoose'

const MessageSchema = mongoose.Schema({
    productURL: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    offerPrice: {
        type: Number
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    profilePic: {
        type: String,
        default: "/images/1.mesege_1.png"
    }
})

export default mongoose.model('message', MessageSchema)