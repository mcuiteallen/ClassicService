module.exports = class proxy {
  get(req, res) {
  const fs = require("fs");
  const https = require("https");
  const querystring = require("querystring");
  const url = require("url");
  const originUrl = url.parse(req.url);
  const qs = querystring.parse(originUrl.query);
  const targetUrl = qs["target"];
  const target = url.parse(targetUrl);
  const content = fs.readFileSync("./models/proxy/index.html");
  const options = {
    hostname: target.hostname,
    port: 443,
    path: url.format(target),
    method: "GET"
  };
  //var data = ""
  console.log(options);
  const proxy = https.request(options, _res => {
    const fieldsToRemove = ["x-frame-options", "content-security-policy"];
    Object.keys(_res.headers).forEach(field => {
      if (!fieldsToRemove.includes(field.toLocaleLowerCase())) {
        res.setHeader(field, _res.headers[field]);
      }
    });
    let data = '';
    _res.on('data', (chunk) => {
        data = data + chunk.toString();
    });
  
    _res.on('end', () => {
        const body = data.replace('</title>', '</title><meta name="referrer" content="never">');
        //console.log(body);
        res.write(body, 'utf8', () => {
          console.log("Writing string Data...");
        });
    });
    //_res.pipe(res, {
    //  end: true
    //});
  }).on('error', err => {
    console.error(err);
  });
  req.pipe(proxy, {
    end: true
  });     
  };
}
