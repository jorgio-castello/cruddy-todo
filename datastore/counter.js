const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

let counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  //Step 1: Invoke readCounter, and pass a function as a call back - the cb accepts an err and number (read from the file)
  //if there is an error, we should stop the callback chain and log the error to the console
  //Step 2: Invoke writeCounter within the readCounter cb - accepts number + 1, and a callback function
  //if there's an error updating the number in the cb chain, stop there and console log the error
  //last step: invoke the callback passed in as a parameter, and pass in err and a padded number

  readCounter((err, number)=>{
    if (err) {
      console.log(err);
    } else {
      writeCounter(number + 1, (err, number)=>{
        if (err) {
          console.log(err);
        } else {
          callback(null, zeroPaddedNumber(number));
        }
      });
    }
  });

};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
exports.getNextUniqueId(() => {});