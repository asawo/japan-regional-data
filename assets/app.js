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

// Load prefectures into dropdown list
function loadDropdown(data) {
  const prefectures = data.result
    .map(
      prefs =>
        `<option class="prefecture" value="${prefs.prefCode}">${prefs.prefName}</option>`
    )
    .join("\n");
  return `<select>${prefectures}</select>`;
}

// Get prefecture data
async function getPrefData(url) {
  const response = await fetch(url, {
    headers: headerEnv
  });
  return await response.json();
}

// Get diversity data
async function getDiversityData(url) {
  const response = await fetch(url, {
    headers: headerEnv
  });
  return await response.json();
}

// Load prefecture data into chart
function loadPopChart(data) {
  const years = [];
  data.forEach(year => years.push(year.year));

  const populationData = [];
  data.forEach(population => populationData.push(population.value));

  populationTrend.config.data.labels = years;
  populationTrend.config.data.datasets[0].data = populationData;

  populationTrend.chart.update();
}

// Load diversity data into chart
function loadDiversityChart(data) {
  const countries = [];
  data.forEach(country => countries.push(country.countryName));

  const visitorPopulation = [];
  data.forEach(population => visitorPopulation.push(population));

  // populationTrend.config.data.labels = countries;
  // populationTrend.config.data.datasets[0].data = visitorPopulation;

  populationTrend.chart.update();
}

const prefectureDropdown = document.querySelector("#prefectureDropdown");
const yearDropdown = document.querySelector("#yearDropdown");

async function getPrefList(url) {
  const response = await fetch(url, {
    headers: headerEnv
  });
  return await response.json();
}

let prefCode = 1;
let year = 2011;

getPrefList("https://opendata.resas-portal.go.jp/api/v1/prefectures").then(
  data => {
    prefectureDropdown.innerHTML = loadDropdown(data);
    // populate graph with initial data
    getPrefData(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`
    ).then(data => {
      const population = data.result.data[0].data;

      loadPopChart(population);
    });

    getDiversityData(
      `https://opendata.resas-portal.go.jp/api/v1/tourism/foreigners/forFrom?purpose=1&year=${year}&prefCode=${prefCode}`
    ).then(data => {
      const diversity = data.result.changes;
      console.log(diversity);
      loadDiversityChart(diversity);
    });
  }
);

// Event Listeners on Dropdown menus
prefectureDropdown.addEventListener("change", function(e) {
  prefCode = e.target.value;
  console.log("selected prefCode is " + prefCode);

  getPrefData(
    `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`
  ).then(data => {
    const population = data.result.data[0].data;

    loadPopChart(population);
  });
});

yearDropdown.addEventListener("change", function(e) {
  year = e.target.selectedOptions[0].label;
  console.log("Selected year is " + year);

  getDiversityData(
    `https://opendata.resas-portal.go.jp/api/v1/tourism/foreigners/forFrom?purpose=1&year=${year}&prefCode=${prefCode}`
  ).then(data => {
    const diversity = data.result.changes;
    console.log(diversity);
    loadDiversityChart(diversity);
  });
});

// Initial graph
const popChart = document.getElementById("populationChart").getContext("2d");
const populationTrend = new Chart(popChart, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: ["Population"],
        backgroundColor: "rgba(255, 130, 153, 0.4)",
        borderColor: "rgba(255, 130, 153)",
        data: []
      }
    ]
  },
  options: {
    responsive: true,
    hover: {
      mode: "label"
    },
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    maintainAspectRatio: true
  }
});

let pieColours = [];

const randomColours = function() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

console.log(randomColours());

const diversityChart = document
  .getElementById("diversityChart")
  .getContext("2d");
const diversityTrends = new Chart(diversityChart, {
  type: "doughnut",
  data: {
    datasets: [
      {
        label: ["Diversity Trend"],
        backgroundColor: pieColours,
        data: [1, 2, 3]
      }
    ],
    labels: ["Pref 1", "Pref 2", "Pref 3"]
  },
  options: {
    responsive: true,
    hover: {
      mode: "label"
    },
    maintainAspectRatio: true
  }
});
