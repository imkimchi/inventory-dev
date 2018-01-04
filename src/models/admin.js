import mongoose from 'mongoose'
import Promise from 'bluebird'
import _bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config'

const bcrypt = Promise.promisifyAll(_bcrypt)

const AdminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  master: {
    type: Boolean
  }
})

AdminSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()

  try {
    let salt = await bcrypt.genSaltAsync(10)
    console.log('password is' + user.password)
    let hash = await bcrypt.hashAsync(user.password, salt)

    user.password = hash
    console.log(`hashed password is ${user.password}`)
    next()
  } catch (e) {
    console.error('Failed to hash password', e)
  }
})

AdminSchema.methods.validatePassword = function validatePassword (password) {
  return bcrypt.compareSync(password, this.password)
}

AdminSchema.methods.generateToken = function generateToken () {
  const user = this
  return jwt.sign({ id: user.id }, config.token)
}

export default mongoose.model('admin', AdminSchema)
