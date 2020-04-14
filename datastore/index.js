const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id)=>{
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err, success)=>{
        if (err) {
          console.log(err);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files)=>{
    if (err) {
      console.log(err);
    } else {
      var data = files.map(file => {
        return (
          {id: file.slice(0, -4),
            text: file.slice(0, -4)}
        );
      });
      callback(null, data);
    }
  });

  // the files we read are just the list of names, not the actual data
  // we map over the array of objects
  // invoke the callback.
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, file) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: file });
    }
  });
};

exports.update = (id, text, callback) => {

  //Step 1: is to see if the file exists - the read method
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, file) => {
    //Step 2: if it doesn't exist, we should send an error
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      //Step 3: if it does exist, we should write the file with the text
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, err => {
        if (err) {
          //Step 4: if that isn't successful, we should log the error
          console.log(err);
        } else {
          //Step 5: if it is successful, we should invoke the callback on id and the updated text
          callback(null, {id, text});
        }
      });
    }
  });

};

exports.delete = (id, callback) => {

  // Step 1: see if the file exists
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      // Step 2: if doesn't exist, we should send an error
      callback(new Error(`No item with id: ${id}`));
    } else {
      // Step 3: if it exists, we want to unlink the file
      fs.unlink(`${exports.dataDir}/${id}.txt`, err =>{
        if (err) {
          // Step 4: if it wasn't successful, console.log(error)
          console.log(err);
        } else {
          // Step 5: if it was successful, invoke callback
          callback();
        }
      });
    }
  });
};



// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};