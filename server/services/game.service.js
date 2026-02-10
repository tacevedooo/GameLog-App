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

  async getGameById(gameId) {
    if (!gameId) {
      throw new Error("Game ID is required");
    }

    const game = await gameRepository.findById(gameId);

    if (!game) {
      throw new Error("Game not found");
    }

    return game;
  }

  async updateGame(gameId, updateData) {
    if (!gameId) {
      throw new Error("Game ID is required");
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error("Update data is required");
    }

    const updatedGame = await gameRepository.update(gameId, updateData);

    if (!updatedGame) {
      throw new Error("Game not found");
    }

    return updatedGame;
  }

  async deleteGame(gameId) {
    if (!gameId) {
      throw new Error("Game ID is required");
    }

    const deletedGame = await gameRepository.delete(gameId);

    if (!deletedGame) {
      throw new Error("Game not found");
    }

    return deletedGame;
  }
}

export default new GameService();
