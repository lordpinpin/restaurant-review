const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require("body-parser");
const { JSDOM } = require('jsdom');
const { ObjectId } = require('mongodb');


const createDOMPurify = require('dompurify');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/dg28enybo`;
const apiKey = process.env.CLOUD_KEY;
const apiSecret = process.env.CLOUD_SECRET;

const { connectToDatabase, fetchRest, topRest6, topRest5, botRest5, alphaRest5, getRestReviewsLatest, getUserofReview, getUserofURL, userLatest5, getUserReviewsLatest, getRestofReview, getReview, checkIfExists } = require('./public/js/db');
const { homepage } = require('./public/js/homepage');
const { searchdisplay } = require('./public/js/searchdisplay');
const { profilepage } = require('./public/js/profilepage.js');
const { editreview } = require('./public/js/editreview.js');
const { profilesettings } = require('./public/js/profile-settings');

const app = express();
const port = 3000;


connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'restar-aunt',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
  },
}));

app.use(bodyParser.json({ limit: "20mb" }));

// Increase payload size limit for urlencoded requests (default is 100kb)
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.get('/', async (req, res) => {
  var file;

  if (req.session.isLoggedIn) {
    file = 'index-logged.html';
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
    name.textContent = `${req.session.first_name} ${req.session.last_name}`;
  }

  var restaurants = await topRest6();
  homepage(document, restaurants);

  var html = dom.serialize();





  res.send(html);
});


app.get('/edit-review', async (req, res) => {
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
          name.textContent = `${req.session.first_name} ${req.session.last_name}`;
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
      name.textContent = `${req.session.first_name} ${req.session.last_name}`;

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
      const lastSpaceIndex = firstPart.lastIndexOf('.');
      var secondPart = '';
      if (lastSpaceIndex !== -1) {
        // If a space is found before the cutoff point, split at that space
        secondPart = description.substring(lastSpaceIndex + 2).trim();
        firstPart = description.substring(0, lastSpaceIndex).trim();
        body = `${firstPart.replace(/\n/g, '<br>')}.`;;
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
      "media": media
    };
    const update = { $set: updatedValues };

    const options = { returnOriginal: false };
    const db = await connectToDatabase();
    const updatedReview = await db.collection('reviews').findOneAndUpdate(filter, update, options);

    console.log(updatedReview);

    res.redirect('/');
});

app.get('/index.html', async (req, res) => {
  res.redirect("/");
});


app.get('/login', async (req, res) => {
    if (req.session.isLoggedIn) {
      res.redirect("/");
    } else{
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
  db.collection('users').findOne({ email: email, password: password })
    .then(user => {
      if (user) {
        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        req.session.url = user.url;
        req.session.profile_picture = user.profile_picture;
        req.session.first_name = user.first_name;
        req.session.last_name = user.last_name;

        req.session.cookie.maxAge = 3 * 24 * 60 * 60 * 1000;
        res.redirect('/');
      } else {

        res.redirect('/login?error=1');
      }
    })
    .catch(err => {
      res.redirect('/login?error=1');
    });
});


app.get('/login-restaurant', async (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'html', 'login-restaurant.html'));
});

app.post('/login-restaurant', async (req, res) => {
 const email = req.body.email;
 console.log(email);
 const password = req.body.password
 console.log(password);
 const [db, client] = await connectToDatabase();
 console.log("findone to start");
 db.collection('restaurant').findOne({ email: email, password: password })
   .then(restaurant => {
     if (restaurant) {
       req.session.isRestaurant = true;
       req.session.userId = restaurant._id;
       req.session.profile_picture = restaurant.mini_pic_url;
       req.session.name = restaurant.name;
       console.log(restaurant._id);

       req.session.cookie.maxAge = 3 * 24 * 60 * 60 * 1000;
       res.redirect('/');
     } else {
       res.redirect('/login-restaurant?error=1');
     }
   })
   .catch(err => {
     console.error('Error finding restaurant:', err);
     res.redirect('/login-restaurant?error=1');
   });
});

app.get('/register', async (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'html', 'register.html'));
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
    name.textContent = `${req.session.first_name} ${req.session.last_name}`;
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
          name.textContent = `${req.session.first_name} ${req.session.last_name}`;
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
        name.textContent = `${req.session.first_name} ${req.session.last_name}`;
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


        if(req.session.userId != undefined){
            curUserId = new ObjectId(req.session.userId);
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

app.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Redirect the user to the login page or any other appropriate page
    res.redirect('/');
  });
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
    name.textContent = `${req.session.first_name} ${req.session.last_name}`;
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
  const publicId = getPublicIdFromUrl(publicUrl);
  const deleteUrl = `${cloudinaryBaseUrl}/image/destroy`;

  const timestamp = Date.now();
  const signature = generateSignature(publicId, timestamp);

  const deleteOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `public_id=${encodeURIComponent(publicId)}&api_key=${encodeURIComponent(
      cloudinaryApiKey
    )}&timestamp=${encodeURIComponent(timestamp)}&signature=${encodeURIComponent(signature)}`,
  };

  try {
    const response = await fetch(deleteUrl, deleteOptions);
    if (response.ok) {
      console.log("File successfully deleted from Cloudinary.");
    } else {
      console.error("Failed to delete the file from Cloudinary:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting the file from Cloudinary:", error);
  }
};

const getPublicIdFromUrl = (publicUrl) => {
  const urlParts = publicUrl.split("/");
  return urlParts[urlParts.length - 1].split(".")[0];
};

const generateSignature = (publicId, timestamp) => {
  const signature = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryApiSecret}`;
  return signature;
};
