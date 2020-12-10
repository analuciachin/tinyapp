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


module.exports = getUserByEmail
//module.exports = generateRandomString
//module.exports = urlsForUser