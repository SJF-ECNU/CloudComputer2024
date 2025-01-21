document.addEventListener("DOMContentLoaded", function () {
  echarts_5('上海');

  var citySelector = document.getElementById('citySelector4');

  // 监听下拉列表变化事件
  citySelector.addEventListener('change', function () {
      // 获取选中的城市
      let selectedCity = citySelector.value;

      let city_title = document.getElementById('day_city');
      city_title.innerHTML = '2014-2023年' + selectedCity + '市日AQI变化图表';

      echarts_5(selectedCity);
  });
});

function echarts_5(cityName) {
  // 基于准备好的dom，初始化echarts实例
  var fetch_url = 'http://localhost:3000/city/' + cityName;

  fetch(fetch_url)
  .then(response => response.json())
  .then(data => {
      // 初始化结果数组
      var result = [];

      // 遍历每一行数据
      for (var i = 0; i < data.length; i++) {
          // 创建对象来存储每一行的数据
          var rowData = data[i];

          // 检查和转换AQI值
          var aqiValue = parseInt(rowData['aqi']);
          var timePoint = rowData['time_point'];

          // 确保 timePoint 和 aqiValue 都是有效的
          if (timePoint && !isNaN(aqiValue)) {
              result.push([timePoint, aqiValue]);
          } else {
              console.warn('Invalid data point:', rowData);
          }
      }

      // 打印过滤后的结果数据以进行调试
      // console.log('Filtered Result Data:', result);

      var myChart = echarts.init(document.getElementById('echart5'));

      var option = {
          tooltip: {
              trigger: 'axis'
          },
          grid: {
              left: '7%',
              right: '10%',
              top: '5%',
              bottom: '1.5%'
          },
          xAxis: {
              data: result.map(function (item) {
                  return item[0] || 'N/A';  // 设置默认值为 'N/A'
              }),
          },
          yAxis: {
              axisLabel: {
                  textStyle: {
                      color: '#3367DF'  // 设置 y 轴字体颜色
                  }
              }
          },
          dataZoom: [
              {
                  startValue: '2014-01-01',
                  handleStyle: {
                      color: '#fff'  // 左边 handle 的颜色
                  }
              },
              {
                  type: 'inside'
              }
          ],
          visualMap: {
              top: 5,
              show: false,
              left: 0,
              text: '',  // 将 text 属性设置为空字符串
              pieces: [
                  { gt: 0, lte: 50, color: '#93CE07' },
                  { gt: 50, lte: 100, color: '#FBDB0F' },
                  { gt: 100, lte: 150, color: '#FC7D02' },
                  { gt: 150, lte: 200, color: '#FD0100' },
                  { gt: 200, lte: 300, color: '#AA069F' },
                  { gt: 300, color: '#AC3B2A' }
              ],
              outOfRange: {
                  color: '#999'
              }
          },
          series: {
              name: cityName + 'AQI',
              type: 'line',
              data: result.map(function (item) {
                  return item[1] != null ? item[1] : 50;  // 设置默认值为50
              }),
              markLine: {
                  silent: true,
                  lineStyle: {
                      color: '#3367DF'
                  },
                  data: [
                      { yAxis: 50 },
                      { yAxis: 100 },
                      { yAxis: 150 },
                      { yAxis: 200 },
                      { yAxis: 300 }
                  ]
              }
          }
      };

      myChart.setOption(option);

      window.addEventListener("resize", function () {
          myChart.resize();
      });
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });
}
