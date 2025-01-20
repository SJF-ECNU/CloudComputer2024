

document.addEventListener("DOMContentLoaded", function () {
    echart_radar('上海')
  
    var citySelector = document.getElementById('citySelector5');
  
    // 监听下拉列表变化事件
    citySelector.addEventListener('change', function () {
        // 获取选中的城市
        let selectedCity = citySelector.value;
  
        let city_title = document.getElementById('radar_city');
        city_title.innerHTML =  selectedCity + '市AQI污染物雷达图';
  
        echart_radar(selectedCity);
    });
  });

// 定义一个映射月份到天数的数组，考虑平年和闰年的情况
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 将日期字符串转换为日期对象
function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// 计算日期在一年中的天数
function dayOfYear(date) {
  let days = date.getDate();
  for (let month = 0; month < date.getMonth(); month++) {
    days += daysInMonth[month];
  }
  // 考虑闰年的情况
  if (date.getMonth() > 1 && ((date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || (date.getFullYear() % 400 === 0))) {
    days++;
  }
  return days - 1;  // 将天数从1开始变为从0开始
}

function echart_radar(cityName){
    

    var fetch_url = 'http://localhost:3000/city/' + cityName;

    fetch(fetch_url)
    .then(response => response.json())
    .then(data => {

        let result = [];

        for (let i = 0; i < data.length; i++) {
            let values = data[i]
            const rowData = [];
        
            // 将日期转换为天数
            const date = parseDate(values['time_point']);
            const day = dayOfYear(date);
        
            rowData.push(day);  // 添加天数
            
            rowData.push(parseFloat(values['aqi']));

            rowData.push(parseFloat(values['pm2_5']));
            rowData.push(parseFloat(values['pm10']));
            rowData.push(parseFloat(values['so2']));
            rowData.push(parseFloat(values['no2']));
            rowData.push(parseFloat(values['co']));
            rowData.push(parseFloat(values['o3']));

        
            result.push(rowData);
        }
        
        var chartDom = document.getElementById('echart6');
        var myChart = echarts.init(chartDom);
        var option;
        
        const lineStyle = {
          width: 1,
          opacity: 0.5
        };
        option = {
         
          radar: {
            indicator: [
              { name: 'AQI', max: 500, color :'#00e3e3'},
              { name: 'PM2.5', max: 400, color :'#bb5e00'},
              { name: 'PM10', max: 400, color :'#bb5e00'},
              { name: 'CO', max: 600, color :'#e80088'},
              { name: 'NO2', max: 300, color :'#eac100'},
              { name: 'SO2', max: 300, color :'#eac100'}
            ],
            shape: 'circle',
            splitNumber: 6,
            axisName: {
              color: 'rgb(238, 197, 102)'
            },
            splitLine: {
              lineStyle: {
                color: [
                  '#ff2d2d',
                  '#ff9244',
                  '#f9f900',
                  '#00a600',
                  '#9f35ff',
                  '#ff0000'
                ].reverse()
              }
            },
            splitArea: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(238, 197, 102, 0.5)'
              }
            }
          },
          series: [
            {
              name: cityName,
              type: 'radar',
              lineStyle: lineStyle,
              data: result,
              symbol: 'none',
              itemStyle: {
                color: '#8bdfdf'
              },
              areaStyle: {
                opacity: 0.01
              }
            }
          ]
        };
        
        option && myChart.setOption(option);

    })

    


}








