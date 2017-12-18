import mongoose from 'mongoose'

const feedbackSchema = mongoose.Schema({
  targetPost: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  itemAsDescribed: {
    type: Number,
    required: true
  },
  shippedQuickly: {
    type: Number,
    required: true
  },
  communication: {
    type: Number,
    required: true
  },
  buyAgain: {
    type: Boolean,
    required: true
  }
})

export default mongoose.model('feedback', feedbackSchema)
