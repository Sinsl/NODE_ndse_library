const http = require('http');

const HOST_URL = process.env.HOST_URL || '127.0.0.1';

const setCounter = function(id) {
  const data = JSON.stringify({ bookId: id })

  const req = http.request(
    {
      hostname: HOST_URL,
      port: 3001,
      path: `/counter/${id}/incr`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      console.log(`statusCode req-post: ${res.statusCode}`);
      res.on('data', answer => {
        console.log(`Счетчик увеличен: ${JSON.parse(answer).message}`);
      })
    })
    req.on('error', (error) => {
    console.error(error)
  })
  req.write(data);
  req.end();
}

const getCounter = function(id, callback) {
  const req = http.request(
    {
      hostname: HOST_URL,
      port: 3001,
      path: `/counter/${id}`,
      method: 'GET'
    }, callback )
    req.on('error', (error) => {
      console.error(error)
      return error;
    })
    req.end();
}

exports.getCounter = getCounter;
exports.setCounter = setCounter;

// const count = function (id, callback){
//   const data = JSON.stringify({ bookId: id })

//   const reqPost = http.request(
//     {
//       hostname: HOST_URL,
//       port: 3001,
//       path: `/counter/${id}/incr`,
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': data.length
//       }
//     }, (res) => {
//       console.log(`statusCode post: ${res.statusCode}`);
//       res.on('data', answer => {
//         console.log(JSON.parse(answer).message);
//       })
//     })
//     reqPost.on('error', (error) => {
//     console.error(error)
//   })
//   reqPost.write(data);
//   reqPost.end();

//   const reqGet = http.request(
//     {
//       hostname: HOST_URL,
//       port: 3001,
//       path: `/counter/${id}`,
//       method: 'GET'
//     }, callback )
//     reqGet.on('error', (error) => {
//       console.error(error)
//       return error;
//     })
//     reqGet.end();
// }


// exports.count = count;