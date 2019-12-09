// *** TO DO ***
// 1. Extract API key from local file for dev ✅
// 2. Extract heroku config vars
// 3. Make a get request to RESAS API ✅
// 4. Map the prefecture list to the drop down ✅
// 5. Map the response into a graph with chart.js

// 1. Extract API key from local file for dev ✅
import env from "../env.js";
const headerEnv = { "X-API-KEY": env.X_API_KEY };

// 2. Extract heroku config vars

// 3. Make a get request to RESAS API ✅

// Function to get prefecture list
async function getPrefList(url) {
  let response = await fetch(url, {
    headers: headerEnv
  });
  let data = await response.json();
  return data;
}

// Load prefectures into dropdown list
const prefectureDropdown = document.querySelector("#prefectureDropdown");

function loadDropdown(data) {
  const prefectures = data.result
    .map(
      prefs =>
        `<option class="prefecture" value="${prefs.prefCode}">${prefs.prefName}</option>`
    )
    .join("\n");
  return `<select>${prefectures}</select>`;
}

getPrefList("https://opendata.resas-portal.go.jp/api/v1/prefectures").then(
  data => {
    prefectureDropdown.innerHTML = loadDropdown(data);
  }
);

// Get prefecture data
async function getPrefData(url) {
  let response = await fetch(url, {
    headers: headerEnv
  });
  let data = await response.json();
  return data;
}

// Load prefecture data into chart
// function loadChart(data) {
//   const populationData = data.result.bar.data
//     .map(
//       prefs =>
//         `<option class="prefecture" value="${prefs.prefCode}">${prefs.prefName}</option>`
//     )
//     .join("\n");
//   return `<select>${prefectures}</select>`;
// }

// Apply event listeners to the dropdown list
prefectureDropdown.addEventListener("change", function(e) {
  const prefCode = e.target.value;
  getPrefData(
    `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`
  ).then(data => {
    let population = data.result.data[0].data;
    // call the function loadChart to insert data.result.bar.data into graph
    console.log(population);
  });
});

// Fake graph data
const ctx = document.getElementById("myChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Fake data",
        backgroundColor: "rgba(255, 130, 153, 0.2)",
        borderColor: "rgba(255, 130, 153)",
        data: [0, 10, 5, 2, 20, 30, 35]
      }
    ]
  },
  options: {}
});
