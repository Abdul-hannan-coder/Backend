// models/HomePage.js
import mongoose from "mongoose";

const homePageSchema = new mongoose.Schema(
  {
    carouselImages: [
      {
        title: { type: String, required: true },
        description: { type: String },
        image: { type: String, required: true },
      },
    ],

    categories: [
      {
        title: { type: String, required: true },
        description: { type: String },
        image: { type: String, required: true },
      },
    ],

    testimonials: [
      {
        name: { type: String },
        image: { type: String },
        feedback: { type: String },
      },
    ],

    aboutUs: {
      title: { type: String, default: "About Us" },
      description: { type: String },
      image: { type: String },
    },
  },
  { timestamps: true }
);

const HomePage = mongoose.model("HomePage", homePageSchema);

export default HomePage;
