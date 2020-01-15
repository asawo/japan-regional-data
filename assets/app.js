// *** TO DO ***
// 1. Toggle between English & Japanese
// 2. Filter small data points into "Other" for pie chart
// 3. Reroute API request via backend

// For the time being, I've hardcoded API because it's an open API & there are only GET calls due to the scope of this project - will correct once I learn how to reroute via backend
const API_KEY = "gwmkmFxh4qd6vPdQyo1y7ZCVurQZhYcc8qAFCwqI";
const headerEnv = { "X-API-KEY": API_KEY };

function loadDropdown(data) {
  const english = {
    北海道: "Hokkaido",
    青森県: "Aomori",
    岩手県: "Iwate",
    宮城県: "Miyagi",
    秋田県: "Akita",
    山形県: "Yamagata",
    福島県: "Fukushima",
    茨城県: "Ibaraki",
    栃木県: "Tochigi",
    群馬県: "Gunma",
    埼玉県: "Saitama",
    千葉県: "Chiba",
    東京都: "Tokyo",
    神奈川県: "Kanagawa",
    新潟県: "Niigata",
    富山県: "Toyama",
    石川県: "Ishikawa",
    福井県: "Fukui",
    山梨県: "Yamanashi",
    長野県: "Nagano",
    岐阜県: "Gifu",
    静岡県: "Shizuoka",
    愛知県: "Aichi",
    三重県: "Mie",
    滋賀県: "Shiga",
    京都府: "Kyoto",
    大阪府: "Osaka",
    兵庫県: "Hyogo",
    奈良県: "Nara",
    和歌山県: "Wakayama",
    鳥取県: "Tottori",
    島根県: "Shimane",
    岡山県: "Okayama",
    広島県: "Hiroshima",
    山口県: "Yamaguchi",
    徳島県: "Tokushima",
    香川県: "Kagawa",
    愛媛県: "Ehime",
    高知県: "Kochi",
    福岡県: "Fukuoka",
    佐賀県: "Saga",
    長崎県: "Nagasaki",
    熊本県: "Kumamoto",
    大分県: "Oita",
    宮崎県: "Miyazaki",
    鹿児島県: "Kagoshima",
    沖縄県: "Okinawa"
  };

  const prefectures = data.result
    .map(
      prefs =>
        `<option class="prefecture" value="${prefs.prefCode}">${
          english[prefs.prefName]
        }</option>`
    )
    .join("\n");
  return `<select>${prefectures}</select>`;
}

async function getData(url) {
  const response = await fetch(url, {
    headers: headerEnv
  });
  return await response.json();
}

function loadPopChart(data) {
  const years = [];
  data.forEach(year => years.push(year.year));

  const populationData = [];
  data.forEach(population => populationData.push(population.value));

  populationTrend.config.data.labels = years;
  populationTrend.config.data.datasets[0].data = populationData;

  populationTrend.chart.update();
}

function loadDiversityChart(data) {
  const english = {
    大韓民国: "Korea",
    中華人民共和国: "China",
    台湾: "Taiwan",
    香港: "Hong Kong",
    タイ: "Thailand",
    シンガポール: "Singapore",
    マレーシア: "Malaysia",
    インド: "India",
    英国: "England",
    フランス: "France",
    ドイツ: "Germany",
    ロシア: "Russia",
    カナダ: "Canada",
    アメリカ合衆国: "US",
    オーストラリア: "Australia",
    ベトナム: "Vietnam",
    フィリピン: "Phillipines",
    インドネシア: "Indonesia",
    スペイン: "Spain",
    イタリア: "Italy"
  };

  const countries = [];
  data.forEach(country => countries.push(english[country.countryName]));

  const visitorPopulation = [];
  let sum = 0;

  data.forEach(country => {
    country.data.forEach(quarter => (sum += quarter.value));
    visitorPopulation.push(sum);
    sum = 0;
  });

  diversityTrend.config.data.labels = countries;
  diversityTrend.config.data.datasets[0].data = visitorPopulation;

  diversityTrend.chart.update();
}

let prefCode = 1;
let year = 2011;

function reloadPopulationChart() {
  getData(
    `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`
  )
    .then(data => {
      const population = data.result.data[0].data;
      loadPopChart(population);
    })
    .catch(error => {
      $("#errorModal").modal("show");
      console.error(error);
    });
}

function reloadDiversityChart() {
  getData(
    `https://opendata.resas-portal.go.jp/api/v1/tourism/foreigners/forFrom?purpose=1&year=${year}&prefCode=${prefCode}`
  )
    .then(data => {
      const diversity = data.result.changes;
      loadDiversityChart(diversity);
    })
    .catch(error => {
      $("#errorModal").modal("show");
      console.error(error);
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
    reloadPopulationChart();
    reloadDiversityChart();
  }
);

// Event Listeners on Dropdown menus
prefectureDropdown.addEventListener("change", function(e) {
  prefCode = e.target.value;
  reloadPopulationChart();
  reloadDiversityChart();
});

yearDropdown.addEventListener("change", function(e) {
  year = e.target.selectedOptions[0].label;
  reloadDiversityChart();
});

const chartTypeToggle = document.querySelector("#chartTypeToggle");
let chartType = "pie";

chartTypeToggle.addEventListener("click", function(e) {
  if (e.target.id === "barSelect") {
    chartType = "bar";
    diversityTrend.config.options.scales = {
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "Population"
          }
        }
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Country"
          }
        }
      ]
    };
  } else if (e.target.id === "pieSelect") {
    chartType = "pie";
    diversityTrend.config.options.scales = [];
  }
  diversityTrend.config.type = chartType;
  diversityTrend.chart.update();
});

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
    legend: {
      display: false
    },
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
          },
          scaleLabel: {
            display: true,
            labelString: "Population"
          }
        }
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Year"
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
  type: "pie",
  data: {
    datasets: [
      {
        label: "Diversity",
        backgroundColor: randomColours,
        data: [0]
      }
    ],
    labels: ["Loading..."]
  },
  options: {
    legend: {
      display: false
    },
    responsive: true,
    hover: {
      mode: "label"
    },
    maintainAspectRatio: true,
    scales: []
  }
});
