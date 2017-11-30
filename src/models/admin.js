import mongoose from 'mongoose'
import Promise from 'bluebird'
import _bcrypt from 'bcrypt'

const bcrypt = Promise.promisifyAll(_bcrypt)

const AdminSchema = mongoose.Schema({
<<<<<<< HEAD
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
=======
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
>>>>>>> 9a009cd5d366b3089b1f518eb08425f7486d7827
    },
    master: {
        type: Boolean
    }
})

AdminSchema.pre('save', async function (next) {
<<<<<<< HEAD
	const user = this
	if(!user.isModified('password')) return next()

	try {
		let salt = await bcrypt.genSaltAsync(10)
		console.log("password is" + user.password)
		let hash = await bcrypt.hashAsync(user.password, salt)
	
		user.password = hash
		console.log(`hashed password is ${user.password}`)
		next()
	} catch (e) {
		console.error("Failed to hash password", e)
	}
=======
    const user = this
    if(!user.isModified('password')) return next()

    try {
        let salt = await bcrypt.genSaltAsync(10)
        console.log("password is" + user.password)
        let hash = await bcrypt.hashAsync(user.password, salt)

        user.password = hash
        console.log(`hashed password is ${user.password}`)
        next()
    } catch (e) {
        console.error("Failed to hash password", e)
    }
>>>>>>> 9a009cd5d366b3089b1f518eb08425f7486d7827
})


AdminSchema.methods.validatePassword = function validatePassword (password) {
<<<<<<< HEAD
  return bcrypt.compareSync(password, this.password)
}

AdminSchema.methods.generateToken = function generateToken () {
  const user = this
  return jwt.sign({ id: user.id }, config.token)
=======
    return bcrypt.compareSync(password, this.password)
}

AdminSchema.methods.generateToken = function generateToken () {
    const user = this
    return jwt.sign({ id: user.id }, config.token)
>>>>>>> 9a009cd5d366b3089b1f518eb08425f7486d7827
}

export default mongoose.model('admin', AdminSchema)