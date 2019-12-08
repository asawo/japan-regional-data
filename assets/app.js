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

const prefectureURL = "https://opendata.resas-portal.go.jp/api/v1/prefectures",
  prefectureDropdown = document.querySelector("#prefectureDropdown");

const getPrefectures = fetch(prefectureURL, {
  headers: headerEnv
})
  .then(res => res.json())
  .then(data => {
    prefectureDropdown.innerHTML = loadDropdown(data);
    console.log(data.result);
  });

function loadDropdown(data) {
  const prefectures = data.result
    .map(prefs => `<option>${prefs.prefName}</option>`)
    .join("\n");
  return `<select>${prefectures}</select>`;
}

// Fake graph data
const ctx = document.getElementById("myChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [0, 10, 5, 2, 20, 30, 45]
      }
    ]
  },

  // Configuration options go here
  options: {}
});

// document.addEventListener("DOMContentLoaded", loadDropdown);
// prefectureDropdown.addEventListener(onselect, function() {
//   console.log(EventSource);
// });

// Simpler basic GET function
// async function get(url) {
//   const response = await fetch(url, { headers: headerEnv });
//   const resData = await response.json();
//   return resData;
// }
// console.log(get(prefectureURL));
