const static = require("node-static");

// 2. Extract API key from heroku config vars
// export const API_KEY = process.env.X-API-KEY;

const file = new static.Server();
require("http")
  .createServer(function(request, response) {
    request
      .addListener("end", function() {
        file.serve(request, response);
      })
      .resume();
  })
  .listen(process.env.PORT || 3000);
