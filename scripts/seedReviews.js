const db = require('../src/models');
const Review = db.Review;

async function seedReviews() {
  const reviews = [
    { userID: 1, productID: 1, productRating: 4.5, description: "Great taste!", datePosted: new Date(), storePurchasedAt: "Whole Foods" },
    { userID: 2, productID: 1, productRating: 3.5, description: "Pretty good, a bit expensive though.", datePosted: new Date(), storePurchasedAt: "Trader Joe's" },
    { userID: 3, productID: 2, productRating: 5.0, description: "Absolutely love this product!", datePosted: new Date(), storePurchasedAt: "Kroger" },
    { userID: 1, productID: 7, productRating: 5.0, description: "I absolutely love this cake! I get it every year for my birthday, and it has never given me any issues as someone with Celiac Disease!", datePosted: new Date(), storePurchasedAt: "Kroger" },
    { userID: 1, productID: 11, productRating: 4.0, description: "Good alternative but gets mushy if overcooked.", datePosted: new Date(), storePurchasedAt: "Publix" },
    { userID: 1, productID: 10, productRating: 5.0, description: "Excellent texture and taste!", datePosted: new Date(), storePurchasedAt: "Kroger" }
  ];
  
  try {
    await Review.bulkCreate(reviews);
    console.log("Reviews seeded successfully!");
  } catch (error) {
    console.error("Error seeding reviews:", error);
  }
}

seedReviews();