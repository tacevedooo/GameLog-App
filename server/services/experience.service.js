import experienceRepository from "../repositories/experience.repository.js";

class ExperienceService {
  async createExperience(userId, gameId, data) {
    const { hoursPlayed, rating, review } = data;

    if (!userId || !gameId) {
      throw new Error("User and Game are required");
    }

    if (rating !== undefined && (rating < 0 || rating > 10)) {
      throw new Error("Rating must be between 0 and 10");
    }

    if (hoursPlayed !== undefined && hoursPlayed < 0) {
      throw new Error("Hours played cannot be negative");
    }

    return await experienceRepository.create({
      user: userId,
      game: gameId,
      hoursPlayed,
      rating,
      review
    });
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
