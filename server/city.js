// https://gist.github.com/rpflorence/701407

var http = require('http'),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    readline = require('readline');

var cityNames = [];

function readCityNames() {
    var rd = readline.createInterface({
        input: fs.createReadStream('geonames_cities15000.csv'),
        output: process.stdout,
        terminal: false
    });

    rd.on('line', function(line) {
        cityNames.push(line);
    });
}

readCityNames();

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomCityName() {
    var randomIndex = getRandomInt(0, cityNames.length);
    return cityNames[randomIndex];
}

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;

    var filename = path.join("../", uri);
    filename = path.join(process.cwd(), filename);

    fs.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });

            var randomCity = {
                name: getRandomCityName()
            };

            response.end(JSON.stringify(randomCity));

            return;
        }

        if (fs.statSync(filename).isDirectory()) {
            filename += '/index.html';
        }

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(process.env.PORT, process.env.IP);