const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const getUserByEmail = require("./helpers");
const app = express();
const PORT = 8080; // default port 8080

const saltRounds = 10;

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['b6d0e7eb-8c4b-4ae4-8460-fd3a08733dcb', '1fb2d767-ffbf-41a6-98dd-86ac2da9392e']
}))

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "ask29t" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "tgR45W" },
  "34Trw5": { longURL: "https://stackoverflow.com/", userID: "aE309p" },
  "kBC544": { longURL: "https://www.ctvnews.ca/", userID: "tgR45W" },
};

const users = { 
  "ask29t": {
    id: "ask29t", 
    email: "heythere@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", saltRounds)
  },
 "tgR45W": {
    id: "tgR45W", 
    email: "bootcamp@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", saltRounds)
  },
  "aE309p": {
    id: "aE309p", 
    email: "myemail@example.com", 
    password: bcrypt.hashSync("i-am-tired", saltRounds)
  }
};




// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateRandomString() {
  let shortURL = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for ( let i = 0; i < 6; i++ ) {
    shortURL += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return shortURL;
}



function urlsForUser(id, db) {
  let userUrls = {};

  for (const url in db) {
    for (const user in db[url]) {
      //console.log('urlsForUser function 1 ', urlDatabase[url].userID, id);
      //console.log('urlsForUser function 2 ', urlDatabase[url].longURL);
      if (db[url].userID === id) {
        userUrls[url] = {};
        userUrls[url].longURL = db[url].longURL;
        userUrls[url].userID = db[url].userID
      } 
    }
  }
  return userUrls;
}

app.post("/urls", (req, res) => {

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.session.user_id;
  console.log('POST /urls ', urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('POST /urls/:shortURL/delete 1 ', shortURL);

  console.log(urlDatabase[shortURL].userID);

  if (urlDatabase[shortURL].userID === req.session.user_id) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.send('403');
  }

});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('POST /urls/:shortURL 1 ', shortURL);

  if (urlDatabase[shortURL].userID === req.session.user_id) {
    urlDatabase[shortURL] = {};
    urlDatabase[shortURL].longURL = req.body.long_url;
    urlDatabase[shortURL].userID = req.session.user_id;

    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id] };

    res.render("urls_show", templateVars);
  } else {
    res.send('403');
  }

});

app.post("/login", (req,res) => {
  
  //console.log(req.body);
  let userInfo;
  if (!getUserByEmail(req.body.email, users)) {
    res.send('403');
  } else if (getUserByEmail(req.body.email, users)) {
    userInfo = getUserByEmail(req.body.email, users);
    console.log('userInfo ', userInfo.password);
    if (!bcrypt.compareSync(req.body.password, userInfo.password)) {
      res.send('403');
    } else {
      req.session.user_id = userInfo.id;
      res.redirect("/urls");
    }
  }
});

app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/login");
});


app.post("/register", (req, res) => {
  const userId = generateRandomString();
  if (req.body.email === '' || req.body.password === '') {
    //console.log(users);
    res.send('404');
  } else if (getUserByEmail(req.body.email, users)) {
    //console.log(users);
    res.send('400');
  } else {
    users[userId] = {};
    users[userId].id = userId;
    users[userId].email = req.body.email;
    users[userId].password = bcrypt.hashSync(req.body.password, saltRounds);
    
    console.log('POST /register ', users);
    req.session.user_id = userId;
    res.redirect("/urls");
  }

});

app.get("/urls", (req, res) => {

  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let userLogged;
    for (const user in users) {
      if (user === req.session.user_id) {
        userLogged = users[user];
      }
    }
    
    const templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase), user: userLogged };
    res.render("urls_index", templateVars);
  }
 
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  console.log('GET /urls/new', req.session.user_id);
  const templateVars = { user: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }

  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, username: req.session.username, user: users[req.session.user_id] };
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log('GET /u/:shortURL ', req.params.shortURL);
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render('register', templateVars);
});

app.get("/login", (req,res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render('login', templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });



// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   res.render("hello_world", templateVars);
// });



// app.get("/urls/:shortURL", (req, res) => {
//   const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
//   res.render("urls_show", templateVars);
// });

// app.post("/urls", (req, res) => {
//   console.log(req.body);  // Log the POST request body to the console
//   res.send("Ok");         // Respond with 'Ok' (we will replace this)
// });


// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
//  });
 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });
 

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});