import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema({
  authorProfilePic: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  postURL: {
    type: String,
    required: true
  }
})

export default mongoose.model('Comment', CommentSchema)
