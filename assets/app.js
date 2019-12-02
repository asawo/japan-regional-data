// *** TO DO ***
// 1. Extract API key from local file for dev ✅
// 2. Extract API key from heroku config vars
// 3. Make a get request to RESAS API ✅
// 4. Map the prefecture list to the drop down
// 5. Map the response into a graph with chart.js

// 1. Extract API key from local file for dev ✅
import env from "../env.js";
const headerEnv = { "X-API-KEY": env.X_API_KEY };

// 3. Make a get request to RESAS API ✅

// make into a function --> define all functions, then call them

// make a fetch

function fetchData(url) {
  fetch(url, {
    headers: headerEnv
  })
    .then(res => res.json())
    .then(data => {
      listOfPrefectures = data;
    })
    .catch(err => reject(err));
}

// read about async and sync requests https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests

// then read async await to make sure the data is received

let listOfPrefectures = "loading";
const prefectureURL = "https://opendata.resas-portal.go.jp/api/v1/prefectures",
  prefectureDropdown = document.querySelector("#prefectureDropdown");

const getPrefectures = fetch(prefectureURL, {
  headers: headerEnv
});

getPrefectures
  .then(response => {
    return response.json();
  })
  .then(data => {
    prefectureDropdown.innerHTML = loadDropdown(data);
  });

function loadDropdown(data) {
  const prefectures = data.result
    .map(prefs => `<option>${prefs.prefName}</option>`)
    .join("\n");

  return `<select>${prefectures}</select>`;
}

prefectureDropdown.innerHTML = prefectures;
// function loadDropdown() {
//   fetch(prefectureURL, {
//     headers: headerEnv
//   })
//     .then(res => res.json())
//     .then(data => {
//       listOfPrefectures = data;
//     })
//     .catch(err => reject(err));

//   prefectureDropdown.innerHTML = listOfPrefectures;
// }

// document.addEventListener("DOMContentLoaded", loadDropdown);
