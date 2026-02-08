import Experience from "../models/Experience.js";

class ExperienceRepository {
  async create(data) {
    return await Experience.create(data);
  }

  async findAll() {
    return await Experience
      .find()
      .populate("user", "username")
      .populate("game", "title coverImage")
      .sort({ createdAt: -1 });
  }

  async findByUser(userId) {
    return await Experience
      .find({ user: userId })
      .populate("user", "username email")
      .populate("game", "title coverImage")
      .sort({ createdAt: -1 });
  }

  async updateById(id, updateData) {
    return await Experience.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteById(id) {
    return await Experience.findByIdAndDelete(id);
  }
}

export default new ExperienceRepository();
