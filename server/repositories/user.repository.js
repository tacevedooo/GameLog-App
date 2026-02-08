import User from "../models/user.model.js";

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }
}

export default new UserRepository();
