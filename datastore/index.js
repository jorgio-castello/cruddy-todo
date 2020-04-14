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
  //Original Code:
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);

  //Thoughts: fs.readdir - https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
  //We're attempt to do something on each file within the folder,
  //Step 1: invoke the fs.readdir async function, pass in a callback (err, files)
  // fs.readdir(exports.dataDir, (err, files) => {
  //   //Step 2: if there's an error, log the error
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     //Step 3: if there's isn't an error, map over the files and return the id and text, both with value of the id
  //     let data = _.map(files, file => ({ id: file.slice(0, -4), text: file.slice(0, -4) }));
  //     callback(null, data);
  //   }
  // });

};

exports.readOne = (id, callback) => {
  //Original Code:
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }

  // fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, file) => {
  //   if (err) {
  //     callback(new Error(`No item with id: ${id}`));
  //   } else {
  //     callback(null, { id, text: file });
  //   }
  // });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};