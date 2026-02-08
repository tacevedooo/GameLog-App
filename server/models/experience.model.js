import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true
    },
    hoursPlayed: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 0,
      max: 10
    },
    review: String
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
