import experienceRepository from "../repositories/experience.repository.js";

class ExperienceService {
  async createExperience(userId, data) {
    const { gameId, rating, hoursPlayed, review } = data;

    if (!gameId) {
      throw new Error("Game is required");
    }

    const experienceData = {
      user: userId,
      gameId,
      rating,
      hoursPlayed,
      review
    };

    return await experienceRepository.create(experienceData);
  }

  async getAllExperiences() {
    return await experienceRepository.findAll();
  }

  async getExperiencesByUser(userId) {
    if (!userId) {
      throw new Error("User id is required");
    }

    return await experienceRepository.findByUser(userId);
  }

  async getExperiencesByGame(gameId) {
    if (!gameId) {
      throw new Error("Game id is required");
    }

    return await experienceRepository.findByGame(gameId);
  }

  async updateExperience(id, updateData) {
    if (!id) {
      throw new Error("Experience id is required");
    }

    if (
      updateData.rating !== undefined &&
      (updateData.rating < 0 || updateData.rating > 10)
    ) {
      throw new Error("Rating must be between 0 and 10");
    }

    return await experienceRepository.updateById(id, updateData);
  }

  async deleteExperience(id) {
    if (!id) {
      throw new Error("Experience id is required");
    }

    return await experienceRepository.deleteById(id);
  }
}

export default new ExperienceService();
