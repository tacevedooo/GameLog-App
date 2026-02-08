import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      minlength: 10
    },

    genre: {
      type: String,
      trim: true
    },

    platform: {
      type: [String],
      default: []
    },

    releaseDate: {
      type: Date
    },

    coverImage: {
      type: String, // URL
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
