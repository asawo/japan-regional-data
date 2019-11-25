// *** TO DO ***
// 1. Extract API key from local file for dev
// 2. Extract API key from heroku config vars
// 3. Make a get request to RESAS API ✅
// 4. Map the prefecture list to the drop down
// 5. Map the response into a graph with chart.js

// 1. Extract API key from local file for dev - not working
import env from "../env.js";

// 3. Make a get request to RESAS API
class HTTPRequest {
  // make a http get request
  get(url) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: {
          "X-API-KEY": env.X_API_KEY
        }
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }
}

//
const http = new HTTPRequest(),
  prefectureList = "https://opendata.resas-portal.go.jp/api/v1/prefectures";

// get prefecture list
http
  .get(prefectureList)
  .then(data => console.log(data))
  .catch(err => console.log(err));
