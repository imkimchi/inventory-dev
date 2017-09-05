import mongoose, { Schema } from 'mongoose'

const ConvoSchema = mongoose.Schema({
    convoId: {
        type: String,
        required: true
    },
    starter: {
        type: String
    },
    seller: {
        type: String,
        required: true
    },
    buyer: {
        type: String,
        require: true
    },
    product: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
})

export default mongoose.model('Conversation', ConvoSchema)