
//I included the tests in my final submision for clarity
//Methods here are exactly the same as in the real code
//They are here only not to mess up the main part of the code

import { expect } from 'chai';
import { isValidEmail, isValidPassword, isValidUsername,  timeSince, connectToDatabase, client } from '../validation.js';

//isValidEmail test
describe('isValidEmail', function() {
  it('return true for correct emails', function() {
    const goodEmails = ['example@example.com', 'test@test.net'];
    goodEmails.forEach(email => {
      expect(isValidEmail(email)).to.be.true;
    });
  });

  it('return false for incorrect emails', function() {
    const badEmails = ['', ' ', 'example', 'example@', '@example.com', 'example@example', 'example@example.'];
    badEmails.forEach(email => {
      expect(isValidEmail(email)).to.be.false;
    });
  });
});

//isValidPassword function test
describe('isValidPassword', function() {
  it('return true for valid passwords', function() {
    const validPasswords = ['abc12345', 'Password123', 'Another1234'];
    validPasswords.forEach(password => {
      expect(isValidPassword(password)).to.be.true;
    });
  });

  it('return false for invalid passwords', function() {
    const invalidPasswords = ['', 'short', '12345678', 'onlyletters', 'ONLYLETTERS'];
    invalidPasswords.forEach(password => {
      expect(isValidPassword(password)).to.be.false;
    });
  });
});

//Test timeSince 
describe('timeSince', function() {
  it('should return seconds', function() {
    const now = new Date();
    expect(timeSince(now)).to.equal('0s');
  });
});

//test database
describe('Database Connection', function() {
  this.timeout(10000); // Extended timeout for database operations

  it('connect to databsse and get collection', async function() {
    try {
      const { database, users } = await connectToDatabase();
      
      
      expect(users).to.exist;
      expect(users.s.namespace.collection).to.equal('Users'); 

      //Simple find operation
      const findResult = await users.find({}).limit(1).toArray();
      expect(findResult).to.be.an('array'); 
    } finally {
      
      await client.close();
    }
  });
});

// Test username
describe('isValidUsername', () => {
  it('return true for valid usernames', () => {
    const validUsernames = ['JohnDoe', 'Jane123', 'Jakub2001'];
    validUsernames.forEach(username => {
      expect(isValidUsername(username)).to.be.true;
    });
  });

  it('return false for invalid usernames', () => {
    const invalidUsernames = ['John Doe', 'Jane-123', 'Alice!', '', ' ', '©Alice2000', 'ßetaTest'];
    invalidUsernames.forEach(username => {
      expect(isValidUsername(username)).to.be.false;
    });
  });
});
