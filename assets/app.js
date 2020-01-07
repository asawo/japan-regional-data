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
  let sum = 0;

  data.forEach(country => {
    country.data.forEach(quarter => (sum += quarter.value));
    visitorPopulation.push(sum);
    sum = 0;
  });

  // Calculate total foreigner population, if it's below x% of total, aggregate into "other" label to make it easier to read the chart

  let totalForeignPopulation = 0;
  visitorPopulation.forEach(country => (totalForeignPopulation += country));
  console.log("total number of foreigners: " + totalForeignPopulation);

  diversityTrend.config.data.labels = countries;
  diversityTrend.config.data.datasets[0].data = visitorPopulation;
  // diversityTrend.config.data.datasets[0].backgroundColor = randomColours;

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
    loadPopChart(population);
  });

  getData(
    `https://opendata.resas-portal.go.jp/api/v1/tourism/foreigners/forFrom?purpose=1&year=${year}&prefCode=${prefCode}`
  ).then(data => {
    const diversity = data.result.changes;
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
  loadCharts();
});

yearDropdown.addEventListener("change", function(e) {
  year = e.target.selectedOptions[0].label;
  loadCharts();
});

// Initial graph
const popChart = document.getElementById("populationChart").getContext("2d");
const populationTrend = new Chart(popChart, {
  type: "bar",
  data: {
    labels: ["Loading..."],
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

const randomColours = function() {
  const r = 255;
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ", 0.4)";
};

const diversityChart = document
  .getElementById("diversityChart")
  .getContext("2d");
const diversityTrend = new Chart(diversityChart, {
  type: "doughnut",
  data: {
    datasets: [
      {
        label: ["Diversity Trend"],
        backgroundColor: randomColours,
        data: [0]
      }
    ],
    labels: ["Loading..."]
  },
  options: {
    legend: {
      display: true
    },
    responsive: true,
    hover: {
      mode: "label"
    },
    maintainAspectRatio: true
  }
});
