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
}

export default new GameController();
