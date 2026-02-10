import gameRepository from "../repositories/game.repository.js";

class GameService {
  async createGame(gameData) {
    const { title, description, coverImage } = gameData;

    if (!title || !description || !coverImage) {
      throw new Error("Title, description and coverImage are required");
    }

    return await gameRepository.create(gameData);
  }

  async getAllGames() {
    return await gameRepository.findAll();
  }
}

export default new GameService();
