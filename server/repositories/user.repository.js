import User from "../models/User.model.js";

class UserRepository {
  // Create a new user
  async create(userData) {
    return await User.create(userData);
  }

  // Find user by ID
  async findById(userId) {
    return await User.findById(userId).select("-password");
  }

  // Find user by email (used for login)
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  // Find user by username (public profile)
  async findByUsername(username) {
    return await User.findOne({ username }).select("-password");
  }

  // Search users (basic)
  async search(query) {
    return await User.find({
      username: { $regex: query, $options: "i" }
    }).select("username avatar createdAt");
  }

  // Update user
  async update(userId, data) {
    return await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true
    }).select("-password");
  }

  // Delete user
  async delete(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

export default new UserRepository();
