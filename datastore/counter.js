const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

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

//Update the file


exports.getNextUniqueId = (callback) => {
  // counter = counter + 1;

  //run readCounter passing writeCounter as a callback
  readCounter((err, number) => {
    if (err) {
      console.log(err);
    } else {
      writeCounter(number + 1, (err, number) => {
        if (err) {
          console.log(err);
        } else {
          callback(null, zeroPaddedNumber(number));
        }
      });
    }
  });

  // if(err) {
  //   return err;
  // } else {
  // readCounter((err, number)=>{
  //     id = number;
  //   });
  // writeCounter(id + 1, (err, counterString) => console.log(counterString));
  // return zeroPaddedNumber(id);
  // }
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');