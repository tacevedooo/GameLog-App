import Game from "../models/game.model.js";

class GameRepository {
  async create(gameData) {
    return await Game.create(gameData);
  }

  async findAll() {
    return await Game.find();
  }

  async update(gameId, updateData) {
    return await Game.findByIdAndUpdate(gameId, updateData, { new: true });
  }

  async delete(gameId) {
    return await Game.findByIdAndDelete(gameId);
  }
}

export default new GameRepository();
