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
    type: String
  },
  offerPrice: {
    type: Number
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  acceptOffer: {
    type: Boolean
  },
  counterOffer: {
    type: Boolean
  },
  isRead: {
    type: Array
  },
  profilePic: {
    type: String,
    default: '/images/1.mesege_1.png'
  }
})

export default mongoose.model('message', MessageSchema)
