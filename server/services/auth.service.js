import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as userRepository from '../repositories/user.repository.js'

export const register = async (username, email, password, role) => {

  const existingUser = await userRepository.findUserByEmail(email)
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const userData = {
    username,
    email,
    password: hashedPassword
  };

  if (role === "admin") {
    userData.role = "admin";
  }

  const user = await userRepository.create(userData);

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  )
}

export const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email)
  if (!user) {
    throw new Error('User not found')
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  )
}