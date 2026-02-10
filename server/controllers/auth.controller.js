import * as authService from "../services/auth.service.js";

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      const token = await authService.register(
        username,
        email,
        password,
      );

      return res.status(201).json({
        message: "User registered successfully",
        token
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const token = await authService.login(email, password);

      return res.status(200).json({
        message: "Login successful",
        token
      });
    } catch (error) {
      return res.status(401).json({
        message: error.message
      });
    }
  }
}

export default new AuthController();
