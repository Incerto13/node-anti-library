const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

const parser = xml2js.Parser({ explicitArray: false });
function goodreadsService() {
  function getBookById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/book/show/${id}.xml?key=BNJPNdExhAyH6ntbj6hEbQ`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              // debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }

  function getAuthorById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/author/show/${id}.xml?key=BNJPNdExhAyH6ntbj6hEbQ`)
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              // debug(result);
              resolve(result.GoodreadsResponse.author);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }

  return { getBookById, getAuthorById };
}

module.exports = goodreadsService();  
