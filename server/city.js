// https://gist.github.com/rpflorence/701407

var http = require('http'),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    
    var filename = path.join("../", uri);
    filename = path.join(process.cwd(), filename);

    path.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });

            var randomCity = {
                name: "Madrid"
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