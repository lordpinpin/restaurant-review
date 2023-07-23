const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

let db;

const connectToDatabase = async() => {
  if (!db) {
    try {
      const client = await MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db("restaurant");
      console.log("db taken");
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    }
  }
  return db;
};

const fetchRest = async () => {
  const db = await connectToDatabase();
  const collection = db.collection('restaurants');
  const restaurants = await collection.find().toArray();
  return restaurants;
};

const topRest6 = async () => {
    const db = await connectToDatabase();
    const collection = db.collection('restaurants');
    const restaurants = await collection.find().sort({ rating: -1 }).limit(6).toArray();
    return restaurants;
};


const topRest5 = async (page, search) => {
  const db = await connectToDatabase();
  const collection = db.collection('restaurants');

  const restaurants = await collection.find({ "name": { $regex: `${search}`, $options: 'i' }}).sort({ rating: -1 }).limit(5).skip((page - 1) * 5).toArray();

  return restaurants;
};

const botRest5 = async (page, search) => {
  const db = await connectToDatabase();
  const collection = db.collection('restaurants');

  const restaurants = await collection.find({ "name": { $regex: `${search}`, $options: 'i' } }).sort({ rating: 1 }).limit(5).skip((page - 1) * 5).toArray();

  return restaurants;
};

const alphaRest5 = async (page, search) => {
  const db = await connectToDatabase();
  const collection = db.collection('restaurants');

  const restaurants = await collection.find({ "name": { $regex: `${search}`, $options: 'i' }}).sort({ name: 1 }).limit(5).skip((page - 1) * 5).toArray();

  return restaurants;
};

const getRestReviewsLatest = async(restaurant) => {
  const db = await connectToDatabase();
  const collection = db.collection('reviews');
  const reviews = await collection.find({"restaurant": restaurant._id}).sort({ date: -1 }).toArray();
  return reviews;
}

const getUserofReview = async(review) => {
  const db = await connectToDatabase();
  const collection = db.collection('users');
  const user = await collection.find({"_id": review.user}).toArray();
  return user;
}

const getUserofURL = async(url) => {
  const db = await connectToDatabase();
  const collection = db.collection('users');
  const user = await collection.find({"url": url}).toArray();
  return user;
}

const userLatest5 = async (user, page) => {
  const db = await connectToDatabase();
  const collection = db.collection('reviews');
  console.log("userLatest");
  console.log(user);
  const reviews = await collection.find({"user": user._id}).sort({ date: -1, _id: -1  }).skip((page - 1) * 5).limit(5).toArray();

  return reviews;
};

const getUserReviewsLatest = async(user) => {
  const db = await connectToDatabase();
  const collection = db.collection('reviews');
  console.log(user._id);
  const reviews = await collection.find({"user": user._id}).sort({ date: -1 }).toArray();
  return reviews;
}

const getRestofReview = async(review) => {
  const db = await connectToDatabase();
  const collection = db.collection('restaurants');
  const restaurant = await collection.find({"_id": review.restaurant}).toArray();
  return restaurant;
}

const getReview = async(review_id) => {
  const db = await connectToDatabase();
  const collection = db.collection('reviews');
  const review = await collection.find({"_id": review_id}).toArray();
  return review;
}

const checkIfExists = async(collection, key, value) => {
  try {
    // Use findOne() to find a document with the specified key-value pair.
    const document = await db.collection(collection).findOne({ [key]: value });

    // If document is not null, the key-value pair exists in the collection.
    return document !== null;
  } catch (error) {

    return false;
  }
}

const deleteReview = async(reviewId) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('reviews');

      // Convert the reviewId from a string to an ObjectId
      const objectIdReviewId = new ObjectId(reviewId);

      // Use the deleteOne() method to delete the review
      const result = await collection.deleteOne({ _id: objectIdReviewId });

      if (result.deletedCount === 1) {
        console.log('Review deleted successfully');
      } else {
        console.log('Review not found or not deleted');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
}




module.exports = {
  connectToDatabase,
  fetchRest,
  topRest6,
  topRest5,
  botRest5,
  alphaRest5,
  getRestReviewsLatest,
  getUserofReview,
  getUserofURL,
  userLatest5,
  getUserReviewsLatest,
  getRestofReview,
  getReview,
  checkIfExists,
  deleteReview
};

