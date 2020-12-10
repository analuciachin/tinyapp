function getUserByEmail (email, db) {
  for (const user in db) {
    for (const item in db[user]) {
      if (db[user].email === email) {
        //console.log('db[user] ', db[user]);
        return db[user];
      }
    }
  }
}


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


// show to the user only his own urls
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


module.exports = { getUserByEmail, generateRandomString, urlsForUser }