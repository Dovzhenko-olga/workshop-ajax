const ctx = document.querySelector('.js-chart').getContext('2d');
const GLOBAL_MEAN_TEMPERATURE = 14;

fetchData()
  .then(parseData)
  .then(getLabelsAndData)
  .then(({ years, temps, nhemi, shemi }) => {
    drawChart(years, temps, nhemi, shemi);
    console.log(years, temps, nhemi, shemi);
  });

function fetchData() {
  return fetch('/ZonAnn.Ts+dSST.csv').then(response => response.text());
  }

function parseData(data) {
    return Papa.parse(data, { header: true }).data;
}
  
function getLabelsAndData(data) {
  return data.reduce(
    (acc, entry) => {
      acc.years.push(entry.Year);
      acc.temps.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
      acc.nhemi.push(Number(entry.NHemi) + GLOBAL_MEAN_TEMPERATURE);
      acc.shemi.push(Number(entry.SHemi) + GLOBAL_MEAN_TEMPERATURE);
        
        return acc;
    },
    { years: [], temps: [], nhemi: [], shemi: [] }
  );
}

function drawChart(labels, data, datan, datas) {
  new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
              label: '# Global temps',
              data,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }, {
              label: '# N.Hemi',
              datan,
              borderColor: 'rgba(99, 132, 255, 1)',
              borderWidth: 1,
            }, {
              label: '# S.Hemi',
              datas,
              borderColor: 'rgba(132, 255, 99, 1)',
              borderWidth: 1,
            }]
        },
        options: {
          animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
          scales: {
            y: {
              ticks: {
                callback(value) {
                  return value + "°";
                }
              }
            }
          }
        },
      });
}