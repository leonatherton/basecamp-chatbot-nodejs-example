const http = require('http');

http.createServer((req, res) => {
    let rawData = '';

    req.on('data', function (chunk) {
        rawData += chunk;

        // Too much POST data, kill the connection
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (rawData.length > 1e6) {
            req.connection.destroy();
        }
    });

    req.on('end', function () {
        res.writeHead(200);

        if (req.method === 'POST') {
            let content = '';
            try {
                let data = JSON.parse(rawData);
                if (data.command.startsWith("hello")) {
                    content = "Hello " + data.creator.name.split(" ")[0] + "!";
                } else {
                    content = "Command not recognised: " + data.command;
                }
            } catch (error) {
                content = error.toString();
            }
            res.write(Buffer.from(content, "utf-8"));
        } else {
            res.write(Buffer.from("Hello world!", "utf-8"));
        }

        res.end();
    });


}).listen(process.env.PORT || 8000);