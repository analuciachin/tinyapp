const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {

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
    
    const user = getUserByEmail("heythere@example.com", users)

    const expectedOutput = { id: "ask29t", email: "heythere@example.com", password: "purple-monkey-dinosaur" }
    // Write your assert statement here
    assert.deepEqual(user, expectedOutput)
  });

  it('should return undefined with a non-existent email', function() {

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

    const user = getUserByEmail("test@example.com", users)

    const expectedOutput = undefined
    // Write your assert statement here
    assert.equal(user, expectedOutput)


  })
});