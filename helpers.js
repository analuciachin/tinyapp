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



module.exports = { getUserByEmail, generateRandomString }
//module.exports = generateRandomString
//module.exports = urlsForUser