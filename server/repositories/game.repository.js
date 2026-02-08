import Game from "../models/Game.js";

class GameRepository {
  async create(gameData) {
    return await Game.create(gameData);
  }

  async findAll() {
    return await Game.find();
  }
}

export default new GameRepository();
