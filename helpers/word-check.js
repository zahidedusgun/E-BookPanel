// helpers/forbidden-word-check.js

function containsForbiddenWord(text) {
    const forbiddenWord = 'aptal'; // Change this to your forbidden word
    return text.toLowerCase().includes(forbiddenWord.toLowerCase());
  }
  
  module.exports = {
    containsForbiddenWord,
  };
  