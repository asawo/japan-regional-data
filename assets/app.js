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

// Get data from RESAS
async function getData(url) {
  const response = await fetch(url, {
    headers: headerEnv
  });
  return await response.json();
}

// Load prefecture population data into chart
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

  // need to sum population per country per year here before inserting into chart
  const visitorPopulation = [];
  const visitorPopulation2 = [];

  data.forEach(numberOfVisitors => {
    visitorPopulation.push(
      numberOfVisitors.data.forEach(year => visitorPopulation2.push(year.value))
    );
  });

  console.log(visitorPopulation2);

  diversityTrend.config.data.labels = countries;
  diversityTrend.config.data.datasets[0].data = visitorPopulation2;

  diversityTrend.chart.update();
}

let prefCode = 1;
let year = 2011;

// Note: should split up this function so I don't reload both charts when changing the year for diversityChart
function loadCharts() {
  getData(
    `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`
  ).then(data => {
    const population = data.result.data[0].data;
    console.log(population);
    loadPopChart(population);
  });

  getData(
    `https://opendata.resas-portal.go.jp/api/v1/tourism/foreigners/forFrom?purpose=1&year=${year}&prefCode=${prefCode}`
  ).then(data => {
    const diversity = data.result.changes;
    console.log(diversity);
    loadDiversityChart(diversity);
  });
}

const prefectureDropdown = document.querySelector("#prefectureDropdown");
const yearDropdown = document.querySelector("#yearDropdown");

async function getPrefList(url) {
  const response = await fetch(url, {
    headers: headerEnv
  });
  return await response.json();
}

getPrefList("https://opendata.resas-portal.go.jp/api/v1/prefectures").then(
  data => {
    prefectureDropdown.innerHTML = loadDropdown(data);
    loadCharts();
  }
);

// Event Listeners on Dropdown menus
prefectureDropdown.addEventListener("change", function(e) {
  prefCode = e.target.value;
  console.log("Selected prefCode is " + prefCode);

  loadCharts();
});

yearDropdown.addEventListener("change", function(e) {
  year = e.target.selectedOptions[0].label;
  console.log("Selected year is " + year);

  loadCharts();
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
const diversityTrend = new Chart(diversityChart, {
  type: "doughnut",
  data: {
    datasets: [
      {
        label: ["Diversity Trend"],
        backgroundColor: pieColours,
        data: [1, 2, 3]
      }
    ],
    labels: ["Loading..."]
  },
  options: {
    responsive: true,
    hover: {
      mode: "label"
    },
    maintainAspectRatio: true
  }
});
