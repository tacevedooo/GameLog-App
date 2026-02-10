import experienceService from "../services/experience.service.js";

class ExperienceController {
  async create(req, res) {
    try {
      const userId = req.user.id;           
      const { gameId } = req.params;        
      const data = req.body;

      const experience = await experienceService.createExperience(
        userId,
        gameId,
        data
      );

      return res.status(201).json(experience);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const experiences = await experienceService.getAllExperiences();
      return res.status(200).json(experiences);
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }

  async getByUser(req, res) {
    try {
      const { userId } = req.params;

      const experiences =
        await experienceService.getExperiencesByUser(userId);

      return res.status(200).json(experiences);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  async getByGame(req, res) {
    try {
      const { gameId } = req.params;

      const experiences =
        await experienceService.getExperiencesByGame(gameId);

      return res.status(200).json(experiences);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedExperience =
        await experienceService.updateExperience(id, updateData);

      if (!updatedExperience) {
        return res.status(404).json({
          message: "Experience not found"
        });
      }

      return res.status(200).json(updatedExperience);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedExperience =
        await experienceService.deleteExperience(id);

      if (!deletedExperience) {
        return res.status(404).json({
          message: "Experience not found"
        });
      }

      return res.status(200).json({
        message: "Experience deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }
}

export default new ExperienceController();
