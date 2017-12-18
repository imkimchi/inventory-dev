import mongoose, { Schema } from 'mongoose'

const ConvoSchema = mongoose.Schema({
  starter: {
    type: String
  },
  seller: {
    type: String,
    required: true
  },
  buyer: {
    type: String,
    required: true
  },
  sold: {
    type: Boolean,
    default: false
  },
  offer: {
    offered: {
      type: Boolean,
      default: false
    },
    offeredPrice: {
      type: Number
    }
  },
  product: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
})

export default mongoose.model('Conversation', ConvoSchema)
