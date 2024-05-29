const fs=require('fs')
const http = require('http');
const appJs=require('./app.js')

const PORT = process.env.PORT || 3000;

const requestHandler = (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('This application does not serve HTTP requests.');
};

const server = http.createServer(requestHandler);

server.listen(PORT, (err) => {
    if (err) {
        return console.log('Something went wrong', err);
    }
    appJs.satisfy()
    console.log(`Server is listening on ${PORT}`);
});
