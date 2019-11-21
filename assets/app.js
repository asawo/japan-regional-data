// *** TO DO ***
// 1. Extract API key from local file for dev
// 2. Extract API key from heroku config vars
// 3. Make a get request to RESAS API ✅
// 4. Map the prefecture list to the drop down
// 5. Map the response into a graph with chart.js

// 1. Extract API key from local file for dev - not working
import env from "/env.js";
const localKey = JSON.stringify(env, null, " ");
console.log(localKey);
// const env = require('./env.js) [nope]

// 3. Make a get request to RESAS API
const http = new HTTPRequest(),
  prefectures = "https://opendata.resas-portal.go.jp/api/v1/prefectures";

http
  .get(prefectures)
  .then(data => console.log(data))
  .catch(err => console.log(err));
