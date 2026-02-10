import gameService from "../services/game.service.js";

class GameController {
  async create(req, res) {
    try {
      const game = await gameService.createGame(req.body);

      return res.status(201).json({
        message: "Game created successfully",
        data: game
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const games = await gameService.getAllGames();

      return res.status(200).json({
        data: games
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching games"
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const game = await gameService.getGameById(id);

      return res.status(200).json({
        data: game
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedGame = await gameService.updateGame(id, req.body);

      return res.status(200).json({
        message: "Game updated successfully",
        data: updatedGame
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await gameService.deleteGame(id);

      return res.status(200).json({
        message: "Game deleted successfully"
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message
      });
    }
  }
}

export default new GameController();
