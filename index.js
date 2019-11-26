let http = require('http');
let fs = require('fs');
url = require('url'); 

let handleRequest = (request, response) => {
  var addr = request.url,
  q = url.parse(addr, true),
  filePath = '';  
  
  response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./documentation.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });



  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  })};


http.createServer(handleRequest).listen(8080);
