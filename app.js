const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const { JSDOM } = require('jsdom');
const MongoDBStore = require('connect-mongodb-session')(session);
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
require('dotenv').config();


const createDOMPurify = require('dompurify');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

cloudinary.config({
  cloud_name: 'dg28enybo',
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const { connectToDatabase, fetchRest, topRest6, topRest5, botRest5, alphaRest5, dateRev5, topRev5, botRev5, getRestReviewsLatest, getUserofReview, getUserofURL, userLatest5, getUserReviewsLatest, getRestofReview, getReview, getRestofUrl, getUnreviewed, deleteReview, updateRating, removeReply, checkIfExists } = require('./model/db');
const { homepage } = require('./views/homepage.js');
const { searchdisplay } = require('./views/searchdisplay.js');
const { profilepage } = require('./views/profilepage.js');
const { editreview } = require('./views/editreview.js');
const { createreview, createreviewRest } = require('./views/createreview.js');
const { restaurantpage } = require('./views/restaurantpage.js');
const { dashboard } = require('./views/dashboard.js');
const { createreply } = require('./views/createreply.js');
const { editreply } = require('./views/editreply.js');

const app = express();
const port = 3000;


connectToDatabase();

const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'sessions', // The name of the collection to store the sessions
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Expires', '0');
  res.setHeader('Pragma', 'no-cache');
  next();
});

app.use(session({
  secret: 'restar-aunt',
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', async (req, res) => {
  var file;

  if (req.session.isLoggedIn) {
    file = 'index-logged.html';
  } else if (req.session.isRestaurantLogged){
    res.redirect('/dashboard');
  } else {
    file = 'index.html';
  }
  var html = fs.readFileSync(path.join(__dirname,'public',  'html', file));

  var dom = new JSDOM(html);
  var { window } = dom;
  var { document } = window;

  if (req.session.isLoggedIn) {
    var profilepic = document.querySelector(".dropdown-profile img");
    profilepic.src = `${req.session.profile_picture}`;

    var name = document.querySelector(".name");
    name.textContent = `${req.session.name}`;;
  }

  var restaurants = await topRest6();
  homepage(document, restaurants);

  var html = dom.serialize();
  console.log(req.session);
  res.send(html);
});


app.get('/about', async (req, res) => {
  var file;

  if (req.session.isLoggedIn) {
    file = 'about-logged.html';
  } else if(req.session.isRestaurantLogged){
    file = 'about-restlogged.html'
  } else {
    file = 'about.html';
  }
  var html = fs.readFileSync(path.join(__dirname,'public',  'html', file));

  var dom = new JSDOM(html);
  var { window } = dom;
  var { document } = window;

  if (req.session.isLoggedIn || req.session.isRestaurantLogged) {
    var profilepic = document.querySelector(".dropdown-profile img");
    profilepic.src = `${req.session.profile_picture}`;

    var name = document.querySelector(".name");
    name.textContent = `${req.session.name}`;;
  }

  var html = dom.serialize();
  res.send(html);
});

app.get('/dashboard', async (req, res) => {
  if(!req.session.isRestaurantLogged){
      var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Action/URL invalid."

      html = dom.serialize();

      res.send(html);
  } else {
      var file = 'dashboard.html';
      console.log(file);
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      const db = await connectToDatabase();
      const restaurant = await db.collection('restaurants').find({'_id': new ObjectId(req.session.userId)}).toArray();

      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = restaurant[0].mini_pic_url;

      var name = document.querySelector(".name");
      name.textContent = restaurant[0].name;


    var types = ["latest", "highestrated", "lowestrated"];

    if(!req.query.type | !types.includes(req.query.type)){
      req.query.type = "latest";
    }

    if(!req.query.page || parseInt(req.query.page) < 1){
      req.query.page = 1;
    }

    if(!req.query.search){
      req.query.search = "";
    }

    const sortbyName = document.querySelector(".sortby-name");

    console.log(req.query.type);

    const all_reviews = await getRestReviewsLatest(restaurant[0]);

    if (req.query.type === "latest"){
      sortbyName.textContent = "Sort by: Latest";
      var pageNum = parseInt(req.query.page);
      console.log("DATEREV5");
      console.log(restaurant);
      const reviews = await dateRev5(pageNum, restaurant[0], req.query.search);
      var users = [];
      for(let reviewSet of reviews){
        console.log(reviewSet.user);
        users.push(await getUserofReview(reviewSet));
      }
      dashboard(document, restaurant[0],  all_reviews, reviews, users);
      console.log("RESTAURANT PAGE SET");
    } else if(req.query.type === "highestrated"){
      sortbyName.textContent = "Sort by: Highest Rated";
      var pageNum = parseInt(req.query.page);
      const reviews = await topRev5(pageNum, restaurant[0], req.query.search);
      var users = [];
      for(let reviewSet of reviews){
        users.push(await getUserofReview(reviewSet));
      }
      dashboard(document, restaurant[0], all_reviews, reviews, users);
    } else if(req.query.type === "lowestrated"){
      sortbyName.textContent = "Sort by: Lowest Rated";
      var pageNum = parseInt(req.query.page);
      const reviews = await botRev5(pageNum, restaurant[0], req.query.search);
      var users = [];
      for(let reviewSet of reviews){
        users.push(await getUserofReview(reviewSet));
      }
      dashboard(document, restaurant[0], all_reviews, reviews, users);
    }

    sortbyItem = document.querySelectorAll(".sortby-item");
    for (let i = 0; i < sortbyItem.length; i++) {
      sortbyItem[i].firstElementChild.href =`?type=${sortbyItem[i].textContent.toLowerCase().replace(/\s/g, '')}&page=1&search=${req.query.search}`;
    }

    currentType = document.querySelector('.cur-type');
    currentType.value = req.query.type;


    const leftPage = document. querySelector('#leftpage');
    const rightPage = document.querySelector('#rightpage');
    const firstNum = document.querySelector('#firstpage');
    const secondNum = document.querySelector('#secondpage');
    const thirdNum = document.querySelector('#thirdpage');
    const fourthNum = document.querySelector('#fourthpage');
    const fifthNum = document.querySelector('#fifthpage');;


    if(pageNum === 1){
      firstNum.classList.add("current-page");
      leftPage.href = `?type=${req.query.type}&page=1&search=${req.query.search}`;
      rightPage.href = `?type=${req.query.type}&page=2&search=${req.query.search}`;
      firstNum.href = `?type=${req.query.type}&page=1&search=${req.query.search}`;
      secondNum.href = `?type=${req.query.type}&page=2&search=${req.query.search}`;
      thirdNum.href = `?type=${req.query.type}&page=3&search=${req.query.search}`;
      fourthNum.href = `?type=${req.query.type}&page=4&search=${req.query.search}`;
      fifthNum.href = `?type=${req.query.type}&page=5&search=${req.query.search}`;
    } else if (pageNum === 2){
      secondNum.classList.add("current-page");
      leftPage.href = `?type=${req.query.type}&page=1&search=${req.query.search}`;
      rightPage.href = `?type=${req.query.type}&page=3&search=${req.query.search}`;
      firstNum.href = `?type=${req.query.type}&page=1&search=${req.query.search}`;
      secondNum.href = `?type=${req.query.type}&page=2&search=${req.query.search}`;
      thirdNum.href = `?type=${req.query.type}&page=3&search=${req.query.search}`;
      fourthNum.href = `?type=${req.query.type}&page=4&search=${req.query.search}`;
      fifthNum.href = `?type=${req.query.type}&page=5&search=${req.query.search}`;
    } else if (pageNum >= 3){
      thirdNum.classList.add("current-page");
      leftPage.href = `?type=${req.query.type}&page=${pageNum - 1}&search=${req.query.search}`;
      rightPage.href = `?type=${req.query.type}&page=${pageNum + 1}&search=${req.query.search}`;
      firstNum.href = `?type=${req.query.type}&page=${pageNum - 2}&search=${req.query.search}`;
      secondNum.href = `?type=${req.query.type}&page=${pageNum - 1}&search=${req.query.search}`;
      thirdNum.href = `?type=${req.query.type}&page=${pageNum}&search=${req.query.search}`;
      fourthNum.href = `?type=${req.query.type}&page=${pageNum + 1}&search=${req.query.search}`;
      fifthNum.href = `?type=${req.query.type}&page=${pageNum + 2}&search=${req.query.search}`;
      firstNum.textContent = `${pageNum - 2}`;
      secondNum.textContent = `${pageNum - 1}`;
      thirdNum.textContent = `${pageNum}`;
      fourthNum.textContent = `${pageNum + 1}`;
      fifthNum.textContent = `${pageNum + 2}`;
    }

      html = dom.serialize();

      res.send(html);
  }
});

app.get('/create-review', async (req, res) => {
  if(!req.session.isLoggedIn){
      var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Action/URL invalid."

      html = dom.serialize();

      res.send(html);
  } else if (req.session.isRestaurantLogged){
    res.redirect('/dashboard');
  } else {
      var file = 'create-review.html';
      console.log(file);
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;

      const restaurants = await getUnreviewed(new ObjectId(req.session.userId));

      createreview(document, restaurants);

      html = dom.serialize();

      res.send(html);
  }
});

app.get('/create-review/:url', async (req, res) => {

  const rest = await getRestofUrl(req.params.url);
  const restaurants = await getUnreviewed(new ObjectId(req.session.userId));
  var curRest = "";
  if(rest.length > 0){
    curRest = rest[0];
  }
  var unreviewed = false;
  unreviewed = restaurants.some(restaurant =>
    restaurant._id.toString() === curRest._id.toString()
  );

  if(!req.session.isLoggedIn || rest.length == 0){
      var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Action/URL invalid."

      var html = dom.serialize();

      res.send(html);
  } else if (!unreviewed){
      var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Restaurant already reviewed."

      var html = dom.serialize();

      res.send(html);
  } else {
      var file = 'create-review-specific.html';
      console.log(file);
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;



      createreviewRest(document, restaurants, rest[0]);

      var html = dom.serialize();

      res.send(html);
  }
});

app.post('/create-review/:url', async (req, res) => {
    const reviewrating = parseFloat(req.body.reviewrating);
    const title = req.body.title;
    const description = req.body.description;
    const images = req.body.imageSources;

    var body = "";
    var readmore = "";

    if (description.length <= 140) {
      body = description;
    } else {

      var firstPart = description.substring(0, 300);
      const lastSpaceIndex = firstPart.lastIndexOf('.');
      var secondPart = '';
      if (lastSpaceIndex !== -1) {
        // If a space is found before the cutoff point, split at that space
        secondPart = description.substring(lastSpaceIndex + 2).trim();
        firstPart = description.substring(0, lastSpaceIndex).trim();
        body = DOMPurify.sanitize(`${firstPart.replace(/\n/g, '<br>')}.`);;
        readmore = DOMPurify.sanitize(`<br>${secondPart.replace(/\n/g, '<br>')}`);
      } else {
        body = description.replace(/\n/g, '<br>');
      }
    }

    console.log(req.params.url);

    const restaurant = await getRestofUrl(req.params.url);



    var media = JSON.parse(images);

    var date = new Date();


    const insertingValues = {
      "restaurant": restaurant[0]._id,
      "user": new ObjectId(req.session.userId),
      "date": date,
      "rating": reviewrating,
      "title": title,
      "media": media,
      "body": body,
      "readmore": readmore,
      "helpful": [],
      "non_helpful": [],
      "reply": ""
    };
    const db = await connectToDatabase();
    const insertedReview = await db.collection('reviews').insertOne(insertingValues);

    console.log(restaurant[0]);
    await updateRating(restaurant[0]);

    /* console.log(insertedReview); */
    res.redirect(`/restaurants/${restaurant[0].url}`);
});


app.get('/create-reply', async (req, res) => {

  const review = await getReview(new ObjectId(req.query.review));


  if(!req.session.isRestaurantLogged || review.length == 0){
      var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Action/URL invalid."

      var html = dom.serialize();

      res.send(html);
  } else {
      var file = 'create-reply.html';
      console.log(file);
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;


      const restaurant = await getRestofUrl(new ObjectId(req.session.userId));
      const user = await getUserofReview(review[0]);

      console.log(review);
      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = restaurant[0].mini_pic_url;

      var name = document.querySelector(".name");
      name.textContent = restaurant[0].name;

      createreply (document, review[0], user[0]);

      var html = dom.serialize();

      res.send(html);
  }
});

app.post('/create-reply', async (req, res) => {

    const filter = { "_id": new ObjectId(req.query.review)};
    const updatedValues = {
      "reply": req.body.reply
    };
    const update = { $set: updatedValues };
    const options = { returnOriginal: false};
    const db = await connectToDatabase();
    const updatedReview = await db.collection('reviews').findOneAndUpdate(filter, update, options);

    console.log(updatedReview);

    res.redirect(`/dashboard`);
});


app.get('/confirm-delete', async (req, res) => {

  const review = await getReview(new ObjectId(req.query.review));
  var file;
  if (req.session.isLoggedIn) {
    file = 'message-logged.html';
  } else {
    file = 'message.html';
  }
  var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

  var dom = new JSDOM(html);
  var { window } = dom;
  var { document } = window;

    if(!req.session.isLoggedIn || !(req.session.userId == review[0].user.toString())){

      if (req.session.isLoggedIn) {
        var profilepic = document.querySelector(".dropdown-profile img");
        profilepic.src = `${req.session.profile_picture}`;

        var name = document.querySelector(".name");
        name.textContent = `${req.session.name}`;
      }

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Unauthorized delete."

      var html = dom.serialize();

      res.send(html);
    } else {
      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Are you sure?";
      const settings = document.querySelector('.settings-title');
      settings.classList.add('inline');

      const deleteForm = document.createElement('form');
      deleteForm.setAttribute('method', 'POST');
      deleteForm.setAttribute('action', '/confirm-delete')
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'review';
      input.value = req.query.review;
      deleteLink = document.createElement('button');
      deleteLink.type = "submit";
      deleteLink.textContent = 'DELETE';
      deleteLink.classList.add('btnSubmit');
      deleteLink.classList.add('confirm');
      deleteForm.append(input);
      deleteForm.append(deleteLink);
      settings.append(deleteForm);

      var html = dom.serialize();

      res.send(html);
    }
});


app.post('/confirm-delete', async (req, res) => {


    const review_id = new ObjectId(req.body.review);
    const review = await getReview(review_id);
    const restaurant = await getRestofReview(review_id);
    console.log(review);
    console.log(review[0]);
    const media = review[0].media
    for(let image of media){
      console.log(image);
      await deleteFileFromCloudinary(image);
    }
    await deleteReview(review_id);
    await updateRating(restaurant);
    res.redirect('/back-2');
});

app.get('/confirm-reply-delete', async (req, res) => {

  const review = await getReview(new ObjectId(req.query.review));
  var file;
  if (req.session.isRestaurantLogged || req.session.isLoggedIn) {
    file = 'message-logged.html';
  } else {
    file = 'message.html';
  }
  var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

  var dom = new JSDOM(html);
  var { window } = dom;
  var { document } = window;

    if(!req.session.isRestaurantLogged || !(req.session.userId == review[0].restaurant.toString())){

      if (req.session.isLoggedIn) {
        var profilepic = document.querySelector(".dropdown-profile img");
        profilepic.src = `${req.session.profile_picture}`;

        var name = document.querySelector(".name");
        name.textContent = `${req.session.name}`;
      }

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Unauthorized delete."

      var html = dom.serialize();

      res.send(html);
    } else {
      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Are you sure?";
      const settings = document.querySelector('.settings-title');
      settings.classList.add('inline');

      const deleteForm = document.createElement('form');
      deleteForm.setAttribute('method', 'POST');
      deleteForm.setAttribute('action', '/confirm-delete')
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'review';
      input.value = req.query.review;
      deleteLink = document.createElement('button');
      deleteLink.type = "submit";
      deleteLink.textContent = 'DELETE';
      deleteLink.classList.add('btnSubmit');
      deleteLink.classList.add('confirm');
      deleteForm.append(input);
      deleteForm.append(deleteLink);
      settings.append(deleteForm);

      var html = dom.serialize();

      res.send(html);
    }
});


app.post('/confirm-reply-delete', async (req, res) => {
    await removeReply(new ObjectId(req.body.review));
    res.redirect('/back-2');
});




app.get('/edit-review', async (req, res) => {

  var review = null;
  if(ObjectId.isValid(req.query.review)){
    review = await getReview(new ObjectId(req.query.review));
  }

  if(!ObjectId.isValid(req.query.review) || review.length === 0 || !req.session.isLoggedIn || review[0].user.toString() != req.session.userId){
      var file;
        if (req.session.isLoggedIn) {
          file = 'message-logged.html';
        } else {
          file = 'message.html';
        }
        var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

        var dom = new JSDOM(html);
        var { window } = dom;
        var { document } = window;

        if (req.session.isLoggedIn) {
          var profilepic = document.querySelector(".dropdown-profile img");
          profilepic.src = `${req.session.profile_picture}`;

          var name = document.querySelector(".name");
          name.textContent = `${req.session.name}`;
        }

        const messageTitle = document.querySelector('.settings-title h1');
        messageTitle.textContent = "Action/URL invalid."

      var html = dom.serialize();

      res.send(html);
  } else {
      var file = 'edit-review.html';
      console.log(file);
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;

      const restaurant = await getRestofReview(review[0])

      editreview(document, review[0], restaurant[0]);

      var html = dom.serialize();

      res.send(html);
  }
});


app.post('/edit-review', async (req, res) => {


    const reviewid = req.query.review;
    const reviewrating = parseFloat(req.body.reviewrating);
    const title = req.body.title;
    const description = req.body.description;
    const images = req.body.imageSources;

    var body = "";
    var readmore = "";

    if (description.length <= 140) {
      body = description;
    } else {

      var firstPart = description.substring(0, 300);
      const lastSpaceIndex = firstPart.lastIndexOf('. ');
      var secondPart = '';
      if (lastSpaceIndex !== -1) {
        // If a space is found before the cutoff point, split at that space
        secondPart = description.substring(lastSpaceIndex + 2).trim();
        firstPart = description.substring(0, lastSpaceIndex).trim();
        body = `${firstPart.replace(/\n/g, '<br>')}. `;;
        readmore = `<br>${secondPart.replace(/\n/g, '<br>')}`;
      } else {
        body = description.replace(/\n/g, '<br>');
      }
    }

    var media = JSON.parse(images);
    const prevMedia = await getReview(new ObjectId(reviewid));

    console.log(media);

    for(let prev of prevMedia[0].media){
      if(!media.includes(prev)){
        console.log(prev);
        await deleteFileFromCloudinary(prev);
      }
    }

    var date = new Date();

    const filter = { "_id": new ObjectId(reviewid)};
    const updatedValues = {
      "title": title,
      "body": body,
      "readmore": readmore,
      "date": date,
      "rating": reviewrating,
      "media": media,
      "helpful": [],
      "non_helpful": [],
      "edited": true
    };
    const update = { $set: updatedValues };

    const options = { returnOriginal: false };
    const db = await connectToDatabase();
    const updatedReview = await db.collection('reviews').findOneAndUpdate(filter, update, options);

    const restToUpdate = await getRestofReview(updatedReview.value);

    updateRating(restToUpdate[0]);

    res.redirect('/back-2');
});




app.get('/edit-reply', async (req, res) => {

  var review = null;
  if(ObjectId.isValid(req.query.review)){
    review = await getReview(new ObjectId(req.query.review));
  }

  if(!ObjectId.isValid(req.query.review) || review.length === 0 || !req.session.isRestaurantLogged || review[0].restaurant.toString() != req.session.userId){
      var file;
        if (req.session.isLoggedIn) {
          file = 'message-logged.html';
        } else {
          file = 'message.html';
        }
        var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

        var dom = new JSDOM(html);
        var { window } = dom;
        var { document } = window;

        if (req.session.isLoggedIn) {
          var profilepic = document.querySelector(".dropdown-profile img");
          profilepic.src = `${req.session.profile_picture}`;

          var name = document.querySelector(".name");
          name.textContent = `${req.session.name}`;
        }

        const messageTitle = document.querySelector('.settings-title h1');
        messageTitle.textContent = "Action/URL invalid."

      var html = dom.serialize();

      res.send(html);
  } else {
      var file = 'create-reply.html';
      console.log(file);
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;

      const restaurant = await getRestofReview(review[0])
      const user = await getUserofReview(review[0]);


      editreply(document, review[0], user[0]);

      var html = dom.serialize();

      res.send(html);
  }
});

app.post('/edit-reply', async (req, res) => {

  const reviewid = req.query.review;

  const filter = { "_id": new ObjectId(reviewid)};
  const updatedValues = {
    "reply" : req.body.reply
  };
  const update = { $set: updatedValues };

  const options = { returnOriginal: false };
  const db = await connectToDatabase();
  const updatedReview = await db.collection('reviews').findOneAndUpdate(filter, update, options);

  res.redirect('/back-2');
});

app.get('/login', async (req, res) => {

    if (req.session.isLoggedIn) {
      res.redirect("/");
    } else if (req.session.isRestaurantLogged){
      res.redirect('/dashboard');
    } else {
    var html = fs.readFileSync(path.join(__dirname,'public',  'html', 'login.html'));

    var dom = new JSDOM(html);
    var { window } = dom;
    var { document } = window;

    if(req.query.error === "1"){
      document.querySelector("#errorLogin").classList.remove("hide");
      document.querySelector("#errorLogin").classList.add("visible");
    }

    var html = dom.serialize();

    res.send(html);
    }
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const password = req.body.password

  console.log(password);
  const db = await connectToDatabase();
  console.log("findone to start");
  db.collection('users').findOne({ email: email})
    .then(async user => {
      if (user) {
        var check = await bcrypt.compare(password, user.password);
        console.log(check);
          if (check) {
              req.session.isLoggedIn = true;
              req.session.userId = user._id;
              req.session.url = user.url;
              req.session.profile_picture = user.profile_picture;
              req.session.name = user.first_name + " " + user.last_name;
              if(req.body.remember){
                console.log("REMEMBER");
                req.session.cookie.maxAge = 3 * 24 * 60 * 60 * 1000;
              }
              return res.redirect('/');
          } else {
              return res.redirect('/login?error=1');
          }
      } else {
        return res.redirect('/login?error=1');
      }
    })
    .catch(err => {
      return res.redirect('/login?error=1');
    });
});


app.get('/register', async (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  } else if (req.session.isRestaurantLogged){
    res.redirect('/dashboard');
  } else{
  var html = fs.readFileSync(path.join(__dirname,'public',  'html', 'register.html'));

  var dom = new JSDOM(html);
  var { window } = dom;
  var { document } = window;

  if(req.query.error === "1"){
    document.querySelector("#errorLogin").classList.remove("hide");
    document.querySelector("#errorLogin").classList.add("visible");
  }

  var html = dom.serialize();

  res.send(html);
  }
});

app.post('/register', async (req, res) => {
  const email = req.body.email;
  const db = await connectToDatabase();
  const usercheck = await db.collection('users').findOne({"email": req.body.email});

  if(usercheck){
    res.redirect('/register?error=1');
  } else {
    const first_name = req.body.firstname;
    const last_name = req.body.lastname;
    const nickname = req.body.nickname;
    const profiledesc = req.body.description;
    const gender = req.body.gchoice;
    const pronouns = req.body.pchoice;
    const profile_pic = req.body.imagesrc;

    var url = `${first_name.toLowerCase().replace(/\s/g, '')}${last_name.toLowerCase().replace(/\s/g, '')}`;
    var check = false;
    var count = 0;
    while (!check){
        let urlcheck = await db.collection('users').findOne({"url": url});
        if(urlcheck){
          count++;
          url = `${first_name.toLowerCase().replace(/\s/g, '')}${last_name.toLowerCase().replace(/\s/g, '')}${count}`;
        } else {
          check = true;
        }
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        const insertingValues = {
          "email": email,
          "password": hash,
          "url": url,
          "profile_picture": profile_pic,
          "first_name": capitalizeWords(first_name),
          "last_name": capitalizeWords(last_name),
          "description": profiledesc,
          "nickname": nickname,
          "pronouns": pronouns,
          "gender": gender
        };
        await db.collection('users').insertOne(insertingValues);
        const insertedUser = await db.collection('users').findOne({'url': url});

        req.session.isLoggedIn = true;
        req.session.userId = insertedUser._id;
        req.session.url = url;
        req.session.profile_picture = profile_pic;
        req.session.name = first_name + " " + last_name;

        req.session.cookie.maxAge = 3 * 24 * 60 * 60 * 1000;
        return res.redirect('/');
      });
    });


  }
});


app.get('/login-restaurant', async (req, res) => {
  if(res.isLoggedIn){
    res.redirect('/');
  } else if (req.isRestaurantLogged){
    res.redirect('/dashboard');
  }
  else {
    var html = fs.readFileSync(path.join(__dirname,'public',  'html', 'login-restaurant.html'));

    var dom = new JSDOM(html);
    var { window } = dom;
    var { document } = window;

    if(req.query.error === "1"){
      document.querySelector("#errorLogin").classList.remove("hide");
      document.querySelector("#errorLogin").classList.add("visible");
    }

    var html = dom.serialize();

    res.send(html);
  }
});

app.post('/login-restaurant', async (req, res) => {
 const email = req.body.email;
 console.log(email);
 const password = req.body.password
 console.log(password);
 const db= await connectToDatabase();
 console.log("findone to start");
 db.collection('restaurants').findOne({ email: email})
   .then(async restaurant => {
     if (restaurant) {
        var check = await bcrypt.compare(password, user.password);
        console.log(check);
          if (check) {
              req.session.isRestaurantLogged = true;
              req.session.userId = restaurant._id;
              req.session.profile_picture = restaurant.mini_pic_url;
              req.session.name = restaurant.name;
              console.log(restaurant._id);

              if(req.body.remember){
                console.log("REMEMBER");
                req.session.cookie.maxAge = 3 * 24 * 60 * 60 * 1000;
              }
              return res.redirect('/dashboard');
          } else {
              return res.redirect('/login-restaurant?error=1');
          }

     } else {
       return res.redirect('/login-restaurant?error=1');
     }
   })
   .catch(err => {
     console.error('Error finding restaurant:', err);
     return res.redirect('/login-restaurant?error=1');
   });
});


app.get('/restaurants/:url', async (req, res) => {
  const restaurant = await getRestofUrl(req.params.url);
  console.log(restaurant);
  if(restaurant.length > 0){
    var file;
    if (req.session.isLoggedIn) {
      file = 'restaurant-logged.html';
    } else {
      file = 'restaurant.html';
    }
    console.log(file);
    var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

    var dom = new JSDOM(html);
    var { window } = dom;
    var { document } = window;

    if (req.session.isLoggedIn) {
      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;
    }

    var types = ["latest", "highestrated", "lowestrated"];

    if(!req.query.type | !types.includes(req.query.type)){
      req.query.type = "latest";
    }

    if(!req.query.page || parseInt(req.query.page) < 1){
      req.query.page = 1;
    }

    if(!req.query.search){
      req.query.search = "";
    }

    const sortbyName = document.querySelector(".sortby-name");

    console.log(req.query.type);


    var pageNum = parseInt(req.query.page);
    const restaurant = await getRestofUrl(req.params.url);
    const allreviews = await getRestReviewsLatest(restaurant[0]);
    if (req.query.type === "latest"){
      sortbyName.textContent = "Sort by: Latest";

      console.log("DATEREV5");
      const reviews = await dateRev5(pageNum, restaurant[0], req.query.search);
      var users = [];
      for(let reviewSet of reviews){
        console.log(reviewSet.user);
        users.push(await getUserofReview(reviewSet));
      }
      restaurantpage(document, restaurant[0], allreviews, reviews, req.session.userId, users);
      console.log("RESTAURANT PAGE SET");
    } else if(req.query.type === "highestrated"){
      sortbyName.textContent = "Sort by: Highest Rated";
      const reviews = await topRev5(pageNum, restaurant[0], req.query.search);
      var users = [];
      for(let reviewSet of reviews){
        users.push(await getUserofReview(reviewSet));
      }
      restaurantpage(document, restaurant[0], allreviews, reviews, req.session.userId, users);
    } else if(req.query.type === "lowestrated"){
      sortbyName.textContent = "Sort by: Lowest Rated";
      const reviews = await botRev5(pageNum, restaurant[0], req.query.search);
      var users = [];
      for(let reviewSet of reviews){
        users.push(await getUserofReview(reviewSet));
      }
      restaurantpage(document, restaurant[0], reviews, req.session.userId, users);
    }

    sortbyItem = document.querySelectorAll(".sortby-item");
    for (let i = 0; i < sortbyItem.length; i++) {
      sortbyItem[i].firstElementChild.href =`?type=${sortbyItem[i].textContent.toLowerCase().replace(/\s/g, '')}&page=1&search=${req.query.search}`;
    }

    currentType = document.querySelector('.cur-type');
    currentType.value = req.query.type;


    const leftPage = document. querySelector('#leftpage');
    const rightPage = document.querySelector('#rightpage');
    const firstNum = document.querySelector('#firstpage');
    const secondNum = document.querySelector('#secondpage');
    const thirdNum = document.querySelector('#thirdpage');
    const fourthNum = document.querySelector('#fourthpage');
    const fifthNum = document.querySelector('#fifthpage');;


    if(pageNum === 1){
      firstNum.classList.add("current-page");
      leftPage.href = `?type=${req.query.type}&page=1&search=${req.query.search}`;
      rightPage.href = `?type=${req.query.type}&page=2&search=${req.query.search}`;
      firstNum.href = `?type=${req.query.type}&page=1&search=${req.query.search}`;
      secondNum.href = `?type=${req.query.type}&page=2&search=${req.query.search}`;
      thirdNum.href = `?type=${req.query.type}&page=3&search=${req.query.search}`;
      fourthNum.href = `?type=${req.query.type}&page=4&search=${req.query.search}`;
      fifthNum.href = `?type=${req.query.type}&page=5&search=${req.query.search}`;
    } else if (pageNum === 2){
      secondNum.classList.add("current-page");
      leftPage.href = `?type=${req.query.type}&page=1&search=${req.query.search}`;
      rightPage.href = `?type=${req.query.type}&page=3&search=${req.query.search}`;
      firstNum.href = `?type=${req.query.type}&page=1&search=${req.query.search}`;
      secondNum.href = `?type=${req.query.type}&page=2&search=${req.query.search}`;
      thirdNum.href = `?type=${req.query.type}&page=3&search=${req.query.search}`;
      fourthNum.href = `?type=${req.query.type}&page=4&search=${req.query.search}`;
      fifthNum.href = `?type=${req.query.type}&page=5&search=${req.query.search}`;
    } else if (pageNum >= 3){
      thirdNum.classList.add("current-page");
      leftPage.href = `?type=${req.query.type}&page=${pageNum - 1}&search=${req.query.search}`;
      rightPage.href = `?type=${req.query.type}&page=${pageNum + 1}&search=${req.query.search}`;
      firstNum.href = `?type=${req.query.type}&page=${pageNum - 2}&search=${req.query.search}`;
      secondNum.href = `?type=${req.query.type}&page=${pageNum - 1}&search=${req.query.search}`;
      thirdNum.href = `?type=${req.query.type}&page=${pageNum}&search=${req.query.search}`;
      fourthNum.href = `?type=${req.query.type}&page=${pageNum + 1}&search=${req.query.search}`;
      fifthNum.href = `?type=${req.query.type}&page=${pageNum + 2}&search=${req.query.search}`;
      firstNum.textContent = `${pageNum - 2}`;
      secondNum.textContent = `${pageNum - 1}`;
      thirdNum.textContent = `${pageNum}`;
      fourthNum.textContent = `${pageNum + 1}`;
      fifthNum.textContent = `${pageNum + 2}`;
    }
    var html = dom.serialize();

    res.send(html);
  } else {
    res.redirect('/');
  }
});

app.get('/restaurants', async (req, res) => {
  var file;
  if (req.session.isLoggedIn) {
    file = 'restaurant-results-logged.html';
  } else {
    file = 'restaurant-results.html';
  }
  console.log(file);
  var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

  var dom = new JSDOM(html);
  var { window } = dom;
  var { document } = window;

  if (req.session.isLoggedIn) {
    var profilepic = document.querySelector(".dropdown-profile img");
    profilepic.src = `${req.session.profile_picture}`;

    var name = document.querySelector(".name");
    name.textContent = `${req.session.name}`;
  }

  var types = ["highestrated", "lowestrated", "alphabetical"];

  if(!req.query.type | !types.includes(req.query.type)){
    req.query.type = "highestrated";
  }

  if(!req.query.page || parseInt(req.query.page) < 1){
    req.query.page = "1";
  }

  if(!req.query.search){
    req.query.search = "";
  }

  const sortbyName = document.querySelector('.sortby-name');


  if (req.query.type === "highestrated"){
    sortbyName.textContent = "Sort by: Highest Rated";
    var restaurants = await topRest5(req.query.page, req.query.search);
    var reviews = [];
    var users = [];
    for(let restaurant of restaurants){
      reviews.push(await getRestReviewsLatest(restaurant));
    }
    console.log(reviews);
    for(let reviewSet of reviews){
      users.push(await getUserofReview(reviewSet[0]));
    }
    searchdisplay(document, restaurants, reviews, users);
  }
  else if (req.query.type === "lowestrated"){
    sortbyName.textContent = "Sort by: Lowest Rated";
    var restaurants = await botRest5(req.query.page, req.query.search);
    var reviews = [];
    var users = [];
    for(let restaurant of restaurants){
      reviews.push(await getRestReviewsLatest(restaurant));
    }
    for(let reviewSet of reviews){
      users.push(await getUserofReview(reviewSet[0]));
    }
    searchdisplay(document, restaurants, reviews, users);
  }
  else if (req.query.type === "alphabetical"){
    sortbyName.textContent = "Sort by: Alphabetical";
    var restaurants = await alphaRest5(req.query.page, req.query.search);
    var reviews = [];
    var users = [];
    for(let restaurant of restaurants){
      reviews.push(await getRestReviewsLatest(restaurant));
    }
    for(let reviewSet of reviews){
      users.push(await getUserofReview(reviewSet[0]));
    }
    searchdisplay(document, restaurants, reviews, users);
  }

  sortbyItem = document.querySelectorAll(".sortby-item");
  for (let i = 0; i < sortbyItem.length; i++) {
    sortbyItem[i].firstElementChild.href =`/restaurants?type=${sortbyItem[i].textContent.toLowerCase().replace(/\s/g, '')}&page=1&search=${req.query.search}`;
    console.log(sortbyItem[i].href);
  }


  const leftPage = document. querySelector('#leftpage');
  const rightPage = document.querySelector('#rightpage');
  const firstNum = document.querySelector('#firstpage');
  const secondNum = document.querySelector('#secondpage');
  const thirdNum = document.querySelector('#thirdpage');
  const fourthNum = document.querySelector('#fourthpage');
  const fifthNum = document.querySelector('#fifthpage');;
  var pageNum = parseInt(req.query.page);
  console.log(pageNum);

  if(pageNum === 1){
    firstNum.classList.add("current-page");
    leftPage.href = `/restaurants?type=${req.query.type}&page=1&search=${req.query.search}`;
    rightPage.href = `/restaurants?type=${req.query.type}&page=2&search=${req.query.search}`;
    firstNum.href = `/restaurants?type=${req.query.type}&page=1&search=${req.query.search}`;
    secondNum.href = `/restaurants?type=${req.query.type}&page=2&search=${req.query.search}`;
    thirdNum.href = `/restaurants?type=${req.query.type}&page=3&search=${req.query.search}`;
    fourthNum.href = `/restaurants?type=${req.query.type}&page=4&search=${req.query.search}`;
    fifthNum.href = `/restaurants?type=${req.query.type}&page=5&search=${req.query.search}`;
  } else if (pageNum === 2){
    secondNum.classList.add("current-page");
    leftPage.href = `/restaurants?type=${req.query.type}&page=1&search=${req.query.search}`;
    rightPage.href = `/restaurants?type=${req.query.type}&page=3&search=${req.query.search}`;
    firstNum.href = `/restaurants?type=${req.query.type}&page=1&search=${req.query.search}`;
    secondNum.href = `/restaurants?type=${req.query.type}&page=2&search=${req.query.search}`;
    thirdNum.href = `/restaurants?type=${req.query.type}&page=3&search=${req.query.search}`;
    fourthNum.href = `/restaurants?type=${req.query.type}&page=4&search=${req.query.search}`;
    fifthNum.href = `/restaurants?type=${req.query.type}&page=5&search=${req.query.search}`;
  } else if (pageNum >= 3){
    thirdNum.classList.add("current-page");
    leftPage.href = `/restaurants?type=${req.query.type}&page=${pageNum - 1}&search=${req.query.search}`;
    rightPage.href = `/restaurants?type=${req.query.type}&page=${pageNum + 1}&search=${req.query.search}`;
    firstNum.href = `/restaurants?type=${req.query.type}&page=${pageNum - 2}&search=${req.query.search}`;
    secondNum.href = `/restaurants?type=${req.query.type}&page=${pageNum - 1}&search=${req.query.search}`;
    thirdNum.href = `/restaurants?type=${req.query.type}&page=${pageNum}&search=${req.query.search}`;
    fourthNum.href = `/restaurants?type=${req.query.type}&page=${pageNum + 1}&search=${req.query.search}`;
    fifthNum.href = `/restaurants?type=${req.query.type}&page=${pageNum + 2}&search=${req.query.search}`;
    firstNum.textContent = `${pageNum - 2}`;
    secondNum.textContent = `${pageNum - 1}`;
    thirdNum.textContent = `${pageNum}`;
    fourthNum.textContent = `${pageNum + 1}`;
    fifthNum.textContent = `${pageNum + 2}`;
  }
  var html = dom.serialize();

  res.send(html);
});

app.get('/helpful', async (req, res) => {
  const review = await getReview(new ObjectId(req.query.review));

  const helpful = review[0].helpful;
  const non_helpful = review[0].non_helpful;
  const questionAnswered = false;

  for (let helped of helpful){
    if (req.session.userId == helped){
        questionAnswered = true;
    }
  }
  for (let unhelped of non_helpful){
      if (req.session.userId == unhelped){
          questionAnswered = true;
      }
  }

  if(!req.session.isLoggedIn || review.length == 0 || questionAnswered){
    var file;
    if (req.session.isLoggedIn) {
      file = 'message-logged.html';
    } else {
      file = 'message.html';
    }
    var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

    var dom = new JSDOM(html);
    var { window } = dom;
    var { document } = window;

    if (req.session.isLoggedIn) {
      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;
    }

    const messageTitle = document.querySelector('.settings-title h1');
    messageTitle.textContent = "Action/URL Invalid"

    var html = dom.serialize();

    res.send(html);
  } else {

    helpful.push(req.session.userId);
    console.log(helpful);
    const filter = { "_id": new ObjectId(req.query.review)};
    const updatedValues = {
      "helpful": helpful
    };
    const update = { $set: updatedValues };

    const options = { returnOriginal: false };
    const db = await connectToDatabase();
    const updatedReview = await db.collection('reviews').findOneAndUpdate(filter, update, options);

    console.log(updatedReview);

    res.redirect('/back');
  }
});


app.get('/non_helpful', async (req, res) => {
  const review = await getReview(new ObjectId(req.query.review));

  const helpful = review[0].helpful;
  const non_helpful = review[0].non_helpful;
  const questionAnswered = false;

  for (let helped of helpful){
    if (req.session.userId  == helped){
        questionAnswered = true;
    }
  }
  for (let unhelped of non_helpful){
      if (req.session.userId  == unhelped){
          questionAnswered = true;
      }
  }

  if(!req.session.isLoggedIn || review.length == 0 || questionAnswered){
    var file;
    if (req.session.isLoggedIn) {
      file = 'message-logged.html';
    } else {
      file = 'message.html';
    }
    var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

    var dom = new JSDOM(html);
    var { window } = dom;
    var { document } = window;

    if (req.session.isLoggedIn) {
      var profilepic = document.querySelector(".dropdown-profile img");
      profilepic.src = `${req.session.profile_picture}`;

      var name = document.querySelector(".name");
      name.textContent = `${req.session.name}`;
    }

    const messageTitle = document.querySelector('.settings-title h1');
    messageTitle.textContent = "Action/URL Invalid"

    var html = dom.serialize();

    res.send(html);
  } else {

    non_helpful.push(req.session.userId);
    const filter = { "_id": new ObjectId(req.query.review)};
    const updatedValues = {
      "non_helpful": non_helpful
    };
    const update = { $set: updatedValues };

    const options = { returnOriginal: false };
    const db = await connectToDatabase();
    const updatedReview = await db.collection('reviews').findOneAndUpdate(filter, update, options);

    console.log(updatedReview);

    res.redirect('/back');
  }
});


app.get('/user', async (req, res) => {
  if(req.session.isLoggedIn) {
    res.redirect(`/user/${req.session.url}`)
  } else {
      var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      if (req.session.isLoggedIn) {
        var profilepic = document.querySelector(".dropdown-profile img");
        profilepic.src = `${req.session.profile_picture}`;

        var name = document.querySelector(".name");
        name.textContent = `${req.session.name}`;
      }

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Action/URL invalid."

      var html = dom.serialize();

      res.send(html);
  }
});

app.get('/user/:url', async (req, res) => {
  user = await getUserofURL(req.params.url);
  if(user.length === 0){
      var file;
        if (req.session.isLoggedIn) {
          file = 'message-logged.html';
        } else {
          file = 'message.html';
        }
        console.log(file);
        var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

        var dom = new JSDOM(html);
        var { window } = dom;
        var { document } = window;


        if (req.session.isLoggedIn) {
          var profilepic = document.querySelector(".dropdown-profile img");
          profilepic.src = `${req.session.profile_picture}`;

          var name = document.querySelector(".name");
          name.textContent = `${req.session.name}`;
        }

        const messageTitle = document.querySelector('.settings-title h1');
        messageTitle.textContent = "No such user exists."

      var html = dom.serialize();

      res.send(html);
  } else {
      var file;
      if (req.session.isLoggedIn) {
        file = 'profile-page-logged.html';
      } else {
        file = 'profile-page.html';
      }
      console.log(file);
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      if (req.session.isLoggedIn) {
        var profilepic = document.querySelector(".dropdown-profile img");
        profilepic.src = `${req.session.profile_picture}`;

        var name = document.querySelector(".name");
        name.textContent = `${req.session.name}`;
      }

      if (!req.query.page){
        req.query.page = "1";
      }

      if (!req.query.type){
        req.query.type = "latest";
      }



      if(req.query.type === "latest"){

        const reviews = await getUserReviewsLatest(user[0]);
        const reviews5 = await userLatest5(user[0], 1);
        const num = reviews.length;
        var restaurants = [];
        console.log(reviews5);
        for(let review of reviews5){
          restaurants.push(await getRestofReview(review));
        }



        profilepage(document, req.session.userId, user[0], num, reviews5, restaurants);
        const pagination = document.querySelector('.pagination-container');
        pagination.classList.add('hide');

        const allReview = document.querySelector('.all-review-option');
        const latestReview = document.querySelector('.latest-review-option');
        latestReview.classList.add('current');

        allReview.href = `?type=all`;
        latestReview.href = `?type=latest`;


      } else if (req.query.type === "all"){

        const reviews = await getUserReviewsLatest(user[0]);
        const reviews5 = await userLatest5(user[0], req.query.page);
        const num = reviews.length;
        var restaurants = [];
        console.log(reviews5);
        for(let review of reviews5){
          restaurants.push(await getRestofReview(review));
        }

        profilepage(document, req.session.userId, user[0], num, reviews5, restaurants);

        const allReview = document.querySelector('.all-review-option');
        const latestReview = document.querySelector('.latest-review-option');
        allReview.classList.add('current');

        allReview.href = `?type=all`
        latestReview.href = `?type=latest`

        const leftPage = document. querySelector('#leftpage');
        const rightPage = document.querySelector('#rightpage');
        const firstNum = document.querySelector('#firstpage');
        const secondNum = document.querySelector('#secondpage');
        const thirdNum = document.querySelector('#thirdpage');
        const fourthNum = document.querySelector('#fourthpage');
        const fifthNum = document.querySelector('#fifthpage');;
        var pageNum = parseInt(req.query.page);


        if(pageNum === 1){
          firstNum.classList.add("current-page");
          leftPage.href = `?type=all&page=1`;
          rightPage.href = `?type=all&page=2`;
          firstNum.href = `?type=all&page=1`;
          secondNum.href =`?type=all&page=2`;
          thirdNum.href = `?type=all&page=3`;
          fourthNum.href = `?type=all&page=4`;
          fifthNum.href = `?type=all&page=5`;
        } else if (pageNum === 2){
          secondNum.classList.add("current-page");
          leftPage.href = `?type=all&page=1`;
          rightPage.href = `?type=all&page=3`;
          firstNum.href = `?type=all&page=1`;
          secondNum.href =`?type=all&page=2`;
          thirdNum.href = `?type=all&page=3`;
          fourthNum.href = `?type=all&page=4`;
          fifthNum.href = `?type=all&page=5`;
        } else if (pageNum >= 3){
          thirdNum.classList.add("current-page");
          leftPage.href = `?type=all&page=${pageNum - 1}`;
          rightPage.href = `?type=all&page=${pageNum + 1}`;
          firstNum.href = `?type=all&page=${pageNum - 2}`;
          secondNum.href =`?type=all&page=${pageNum - 1}`;
          thirdNum.href = `?type=all&page=${pageNum}`;
          fourthNum.href = `?type=all&page=${pageNum + 1}`;
          fifthNum.href = `?type=all&page=${pageNum + 2}`;
          firstNum.textContent = `${pageNum - 2}`;
          secondNum.textContent = `${pageNum - 1}`;
          thirdNum.textContent = `${pageNum}`;
          fourthNum.textContent = `${pageNum + 1}`;
          fifthNum.textContent = `${pageNum + 2}`;
        }
      }

      var html = dom.serialize();

      res.send(html);
    }
  });


app.get('/settings', (req, res) => {
  res.redirect('/settings-profile');
});

app.get('/settings-email', (req, res) => {
  if(req.session.isLoggedIn){
    var file = 'settings-email.html';

    console.log(file);
    var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

    var dom = new JSDOM(html);
    var { window } = dom;
    var { document } = window;
    var profilepic = document.querySelector(".dropdown-profile img");
    profilepic.src = `${req.session.profile_picture}`;

    var name = document.querySelector(".name");
    name.textContent = `${req.session.name}`;

      if(req.query.error === "1"){
        document.querySelector("#errorEmail").classList.remove("hide");
      }
      var html = dom.serialize();

      res.send(html);
  } else {
    var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      if (req.session.isLoggedIn) {
        var profilepic = document.querySelector(".dropdown-profile img");
        profilepic.src = `${req.session.profile_picture}`;

        var name = document.querySelector(".name");
        name.textContent = `${req.session.name}`;
      }

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Action/URL invalid."

      var html = dom.serialize();

      res.send(html);
  }
});

app.post('/settings-email', async(req, res) => {
  const past_email = req.body.past_email;
  const new_email = req.body.new_email;
  const db = await connectToDatabase();
  const user = await db.collection('users').find({'email': past_email}).toArray();
  console.log(user);
  console.log("user found");
  const userCheck = await db.collection('users').find({ "email": new_email}).toArray();
  console.log(userCheck);
  console.log("newEmail");
  if (userCheck.length > 0 || user.length == 0){
    res.redirect('/settings-email?error=1')
  } else {
    const filter = { "_id": new ObjectId(req.session.userId)};
    const updatedValues = {
      "email": new_email
    };
    const update = { $set: updatedValues };
    const options = { returnOriginal: false };

    const updatedUser = await db.collection('users').findOneAndUpdate(filter, update, options);

    console.log(updatedUser);
    return res.redirect('/');
  }
});


app.get('/settings-profile', async (req, res) => {
  if(req.session.isLoggedIn){
    var file = 'settings-profile.html';

    console.log(file);
    var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

    var dom = new JSDOM(html);
    var { window } = dom;
    var { document } = window;
    var profilepic = document.querySelector(".dropdown-profile img");
    profilepic.src = `${req.session.profile_picture}`;

    var name = document.querySelector(".name");
    name.textContent = `${req.session.name}`;

      if(req.query.error === "1"){
        document.querySelector("#errorProfile").classList.remove("hide");
      }

      const profile_picture = document.querySelector('.media-circle img');
      profile_picture.src = req.session.profile_picture;
      console.log(document.querySelector('#last-name-input').value);





      const db = await connectToDatabase();
      const user = await db.collection('users').find({'_id' : new ObjectId(req.session.userId)}).toArray();

      console.log(user);

      document.querySelector('.first_name').defaultValue = user[0].first_name;
      document.querySelector('.last_name').defaultValue = user[0].last_name;

      const nickname = document.querySelector('.nick_name');
      console.log(user[0].nickname);
      nickname.defaultValue = user[0].nickname;

      const desc = document.querySelector('#description-input');
      desc.innerHTML = user[0].description;

      const gender = document.querySelectorAll('input[name="gchoice"]');
      for(let genderchoice of gender){
        console.log(genderchoice.value);
        if(genderchoice.value === user[0].gender){
          genderchoice.setAttribute('checked', 'true');
        }
      }

      const pronouns = document.querySelectorAll('input[name="pchoice"]');
      for(let pronounchoice of pronouns){
        if(pronounchoice.value === user[0].pronouns){
          pronounchoice.setAttribute('checked', 'true');
        }
      }
      var html = dom.serialize();

      res.send(html);
  } else {
    var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      if (req.session.isLoggedIn) {
        var profilepic = document.querySelector(".dropdown-profile img");
        profilepic.src = `${req.session.profile_picture}`;

        var name = document.querySelector(".name");
        name.textContent = `${req.session.name}`;
      }

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Action/URL invalid.";

      var html = dom.serialize();

      res.send(html);
  }
});

app.post('/settings-profile', async(req, res) => {
  console.log("HERE");

  const first_name = req.body.firstname;
  const last_name = req.body.lastname;
  const nickname = req.body.nickname;
  const profiledesc = DOMPurify.sanitize(req.body.description);
  const gender = req.body.gchoice;
  const pronouns = req.body.pchoice;
  const profile_pic = req.body.imagesrc;

    const filter = { "_id": new ObjectId(req.session.userId)};
    const updatedValues = {
      "profile_picture": profile_pic,
      "first_name": capitalizeWords(first_name),
      "last_name": capitalizeWords(last_name),
      "description": profiledesc,
      "nickname": nickname,
      "pronouns": pronouns,
      "gender": gender
    };
    const update = { $set: updatedValues };
    const options = { returnOriginal: false };
    const db = await connectToDatabase();
    const updatedUser = await db.collection('users').findOneAndUpdate(filter, update, options);

    console.log(updatedUser);

    req.session.profile_picture = profile_pic;
    req.session.first_name = first_name;
    req.session.last_name = last_name;

    return res.redirect('/');
});

app.get('/settings-password', (req, res) => {
  if(req.session.isLoggedIn){
    var file = 'settings-password.html';

    console.log(file);
    var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

    var dom = new JSDOM(html);
    var { window } = dom;
    var { document } = window;
    var profilepic = document.querySelector(".dropdown-profile img");
    profilepic.src = `${req.session.profile_picture}`;

    var name = document.querySelector(".name");
    name.textContent = `${req.session.name}`;

      if(req.query.error === "1"){
        document.querySelector("#errorPass").classList.remove("hide");
      }
      var html = dom.serialize();

      res.send(html);
  } else {
    var file = 'message.html';
      var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

      var dom = new JSDOM(html);
      var { window } = dom;
      var { document } = window;

      if (req.session.isLoggedIn) {
        var profilepic = document.querySelector(".dropdown-profile img");
        profilepic.src = `${req.session.profile_picture}`;

        var name = document.querySelector(".name");
        name.textContent = `${req.session.name}`;
      }

      const messageTitle = document.querySelector('.settings-title h1');
      messageTitle.textContent = "Action/URL invalid."

      var html = dom.serialize();

      res.send(html);
  }
});

app.post('/settings-password', async(req, res) => {
  const past_password = req.body.old_password;
  console.log(past_password);
  const db = await connectToDatabase();

  const user = await db.collection('users').find({'_id': new ObjectId(req.session.userId)}).toArray();

  console.log(user);
  var check = await bcrypt.compare(past_password, user[0].password);
  console.log(check);

  if (!check){
    res.redirect('/settings-password?error=1')
  } else {
    const filter = { "_id": new ObjectId(req.session.userId)};
    var new_password = "";
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.new_password, salt, async function (err, hash) {
            const updatedValues = {
              "password": hash
            };
            const update = { $set: updatedValues };
            const options = { returnOriginal: false };

            const updatedUser = await db.collection('users').findOneAndUpdate(filter, update, options);

            console.log(updatedUser);
            return res.redirect('/');
        });
    });
  }
});

app.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {redirec
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Redirect the user to the login page or any other appropriate page
    res.redirect('/');
  });
});

app.get('/back', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Refresh Previous Page</title>
      </head>
      <body>
        <script>
          // Function to refresh the previous page
          function refreshPrevious() {
            window.history.go(-1);
          }

          // Call the function on page load
          refreshPrevious();
        </script>
      </body>
    </html>
  `);
});

app.get('/back-2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Refresh Previous Page</title>
      </head>
      <body>
        <script>
          // Function to refresh the previous page
          function refreshPrevious() {
            window.history.go(-2);
          }

          // Call the function on page load
          refreshPrevious();
        </script>
      </body>
    </html>
  `);
});



// NO URL HANDLING
app.use((req, res, next) => {
  var file;
  if (req.session.isLoggedIn) {
    file = 'message-logged.html';
  } else {
    file = 'message.html';
  }
  console.log(file);
  var html = fs.readFileSync(path.join(__dirname,'public', 'html', file));

  var dom = new JSDOM(html);
  var { window } = dom;
  var { document } = window;


  if (req.session.isLoggedIn) {
    var profilepic = document.querySelector(".dropdown-profile img");
    profilepic.src = `${req.session.profile_picture}`;

    var name = document.querySelector(".name");
    name.textContent = `${req.session.name}`;
  }

  const messageTitle = document.querySelector('.settings-title h1');
  messageTitle.textContent = "URL does not exist."

  var html = dom.serialize();

  res.status(404).send(html);
});




app.listen(port, () => {
  console.log(`Node.js server listening on port ${port}`);
});

const deleteFileFromCloudinary = async (publicUrl) => {
  try {
    const publicId = getPublicIdFromUrl(publicUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
  } catch (error) {
    console.error("Error deleting the file from Cloudinary:", error);
  }
};

const getPublicIdFromUrl = (publicUrl) => {
  const urlParts = publicUrl.split('/');

  // Find the index of 'upload' in the URL
  const uploadIndex = urlParts.indexOf('upload');

  // Extract the public ID from the URL based on the upload index
  const publicId = urlParts.slice(uploadIndex + 2).join('/');

  // Remove any file extension (e.g., '.jpg') from the public ID
  const publicIdWithoutExtension = publicId.split('.')[0];
  console.log(publicIdWithoutExtension)
  return `${publicIdWithoutExtension}`;
};

function capitalizeWords(inputString) {
  const words = inputString.split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(' ');
}



async function hashPassword(password) {
  try {
    const saltRounds = 10; // The higher, the more secure but slower it will be
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw err;
  }
}


