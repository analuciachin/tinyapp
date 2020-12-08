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

app.post("/urls", (req, res) => {

  const shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;
  //console.log(req.body);
  console.log(urlDatabase);
  //res.send("200 OK");
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

  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie('username');
  res.redirect("urls");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies.username };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username };
  console.log('cookies', req.cookies.username);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(req.params);
  res.redirect(longURL);
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