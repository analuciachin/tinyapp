const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "ask29t": {
    id: "ask29t", 
    email: "heythere@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "tgR45W": {
    id: "tgR45W", 
    email: "bootcamp@example.com", 
    password: "dishwasher-funk"
  },
  "aE309p": {
    id: "aE309p", 
    email: "myemail@example.com", 
    password: "i-am-tired"
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


function isEmailInDb (email, db) {
  for (const user in db) {
    for (const item in db[user]) {
     // console.log(db[user].email, email)
      if (db[user].email === email) {
        return true;
      }
    }
  }
  return false;
}

app.post("/urls", (req, res) => {

  const shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('shortURL', shortURL);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.long_url;

  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username };

  console.log('req.body', req.body);
  res.render("urls_show", templateVars);
});

app.post("/login", (req,res) => {
  const username = req.body.username;
  console.log(username);
  res.cookie('username', username);
  //const userId = req.cookies;
  //console.log(userId)

  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});


app.post("/register", (req, res) => {
  const userId = generateRandomString();
  if (req.body.email === '' || req.body.password === '') {
    //console.log(users);
    res.send('404');
  } else if (isEmailInDb(req.body.email, users)) {
    //console.log(users);
    res.send('400');
  } else {
    users[userId] = {};
    users[userId].id = userId;
    users[userId].email = req.body.email;
    users[userId].password = req.body.password;
    
    //console.log(users);
    res.cookie('user_id', userId);
    res.redirect("/urls");
  }

});

app.get("/urls", (req, res) => {

  let userLogged;
  for (const user in users) {
    if (user === req.cookies.user_id) {
      userLogged = users[user];
    }
  }
  const templateVars = { urls: urlDatabase, username: userLogged.id, user: userLogged };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  console.log('req.cookies', req.cookies);
  const templateVars = { username: req.cookies.username, user: users[req.cookies.user_id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username, user: users[req.cookies.user_id] };
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(req.params);
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies.username, user: users[req.cookies.user_id] };
  res.render('register', templateVars);
});

app.get("/login", (req,res) => {
  const templateVars = { user: users[req.cookies.user_id] };
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