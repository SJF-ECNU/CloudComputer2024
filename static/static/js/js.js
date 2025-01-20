document.addEventListener("DOMContentLoaded", function () {

    // 向后端请求数据
    fetch('http://localhost:3000/aqi_data_year')
    .then(response => response.json())
    .then(data => {

        var rawDataArray = []
        rawDataArray.push(['城市', '年份', '平均AQI', '优', '良', '轻度污染', '中度污染', '重度污染'])
        var AQIdata = {};

        for (var i = 1; i < data.length; i++) {
            let temp = data[i]
            rawDataArray.push([temp['city'], temp['year'], temp['average_aqi'], temp['excellent'], temp['good'], temp['light_pollution'], temp['moderate_pollution'], temp['heavy_pollution']])
            
            let city = temp['city'];
            let aqi = Math.round(parseFloat(temp['average_aqi']));
            if (!AQIdata[city]) {
                AQIdata[city] = [];
            }
            AQIdata[city].push(aqi);
        }

        const resultByCity = {};

        var pieData = {2014:[0,0,0,0,0],2015:[0,0,0,0,0],2016:[0,0,0,0,0],2017:[0,0,0,0,0],2018:[0,0,0,0,0],2019:[0,0,0,0,0],2020:[0,0,0,0,0],2021:[0,0,0,0,0],2022:[0,0,0,0,0],2023:[0,0,0,0,0]}

        // 处理数据
        for (const data of rawDataArray.slice(1)) {
            const city = data[0];
            const year = data[1];
            const aqi_index = data[2];
            if(aqi_index <= 50){
                pieData[year][0]++;
            }
            else if(aqi_index <= 100){
                pieData[year][1]++;
            }
            else if(aqi_index <= 150){
                pieData[year][2]++;
            }
            else if(aqi_index <= 100){
                pieData[year][3]++;
            }
            else{
                pieData[year][4]++;
            }
            // 判断年份是否在2017-2023范围内
            if (year >= 2017 && year <= 2023) {
                const levelsData = data.slice(3); // 优、良、轻度污染、中度污染、重度污染的天数

                if (!resultByCity[city]) {
                    resultByCity[city] = [];
                }

                // 将处理后的数据推入结果数组
                resultByCity[city].push(levelsData);
            }
        }

        // 转置数据
        for (const city in resultByCity) {
            resultByCity[city] = resultByCity[city][0].map((col, i) =>
                resultByCity[city].map(row => parseInt(row[i], 10))
            );
        }

        echarts_1();
        echarts_2();
        echarts_4();
        echarts_31();

        function echarts_1() {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('echart1'));

                var loop_index = 0;
                var option;

                var cities = [
                    '北京', '天津', '上海', '重庆', '石家庄', '太原', '西安', '济南', '郑州', 
                    '沈阳', '长春', '哈尔滨', '南京', '杭州', '合肥', '南昌', '福州', '武汉', '长沙', 
                    '成都', '贵阳', '昆明', '广州', '海口', '兰州', '西宁', '呼和浩特', '乌鲁木齐', 
                    '拉萨', '南宁', '银川'
                ];

                let colors_chart1 = ['#7A67EE','#C1CD59','#228B22','#EEDC82','#3A5FCD']

                var years = ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023']

                var data = [];
                // 在初始化图表时添加 sortOrder 变量，初始排序方式为降序
                var sortOrder = 'desc';

                for(let i=0;i < 31; i++){
        
                    data.push(AQIdata[cities[i]][0]);
                }


                option = {
                    toolbox: {
                        left: '85%',  // 控制 toolbox 在容器中的水平位置，可以设置为 'left', 'center', 'right'

                        feature: {
                            mySort: {
                                show: true,
                                title: '切换排序', // 按钮的标题
                                icon: 'path://M512 320l192 192H320zM512 832l-192-192h384z', // 你可以使用其他图标
                                onclick: function () {
                                    // 在这里实现排序方式的切换逻辑
                                    // 可以使用变量保存排序方式状态，并在点击时进行切换
                                    // 然后根据当前排序方式重新排序并更新图表

                                    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                                    option.toolbox.iconStyle.borderColor = sortOrder === 'asc' ? '#00d88f' : '#FF9100';
                                    // 更新图表
                                    myChart.setOption(option, true);
                                    // updateChart(sortOrder);
                                    // updateChart(sortOrder);
                                }
                            }
                        },
                        iconStyle: {
                            
                            borderColor: '#FF9100' // 按钮边框颜色
                        }
                    },
                    color:colors_chart1[1],
                    grid: {
                        top: '20%',    // 设置上边距为容器高度的10%
                        bottom: '0%',  // 设置下边距为容器高度的10%
                        left: '15%',   // 设置左边距为容器宽度的10%
            
                    },
                xAxis: {
                    max: 'dataMax',
                

                },
                yAxis: {
                    axisLine: {
                        lineStyle: {
                            color: '#FF9100'  // 设置 y 轴线的颜色
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#3366CC'  // 设置 y 轴标签的颜色
                        }
                    },
                    type: 'category',
                    data: cities,
                    inverse: true,
                    animationDuration: 300,
                    animationDurationUpdate: 300,
                    max: 8 // only the largest 3 bars will be displayed
                },
                series: [
                    {
                    realtimeSort: true,
                    name: '省会城市年AQI排名',
                    type: 'bar',
                    data: data,
                    label: {
                        show: true,
                        position: 'right',
                        valueAnimation: true
                    },
                    barWidth: 3
                    }
                ],
                legend: {
                    show: true,
                    textStyle: {
                        color: '#ffffff',  // 图例文本颜色
                        fontSize: 15,
                    },
                    x: '27%',           // 设置图例水平居中
                    y: '5%',
                },
                animationDuration: 0,
                animationDurationUpdate: 3000,
                animationEasing: 'linear',
                animationEasingUpdate: 'linear'
                };
                function run() {
                    loop_index = loop_index % 10;
                    for(let j=0;j < 31; ++j){
        
                        data[j] = AQIdata[cities[j]][loop_index];
                    }
                    loop_index ++;

                    var indices = Array.from(data.keys());

                    // 根据 data 数组的值和排序方式对索引进行排序
                    indices.sort(function(a, b) {
                        return sortOrder === 'asc' ? data[a] - data[b] : data[b] - data[a];
                    });

                    temp_data = []
                    temp_cities = []
                    for(let s = 0;s < 31;s++){
                        temp_data.push(data[indices[s]])
                        temp_cities.push(cities[indices[s]])           }
                    
            
                    myChart.setOption({
                        color: colors_chart1[loop_index%4],
                        series: [
                        {
                            realtimeSort: true,
                            type: 'bar',
                            data:temp_data,
                            name: years[loop_index-1]+'年平均AQI排名',
                            barGap: '100%', // 可根据需要调整
                            barCategoryGap: '50%' // 可根据需要调整
                        }
                        ],
                        yAxis: {
                            type: 'category',
                            data: temp_cities,
                            inverse: true,
                            animationDuration: 300,
                            animationDurationUpdate: 300,
                            max: 8 // only the largest 3 bars will be displayed
                        },
                    });
                }
                setTimeout(function () {
                    run();
                }, 5000);
                setInterval(function () {
                    run();
                }, 8000);

                option && myChart.setOption(option);
                window.addEventListener('resize', function () {
                    myChart.resize();
                });

                // 在图表的点击事件中调用 updateChart 函数
                myChart.on('click', 'mySort', function () {
                    updateChart(sortOrder === 'asc' ? 'desc' : 'asc');
                });

        }


        function echarts_2() {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('echart2'));

                var citySelector = document.getElementById('citySelector3');

                // 监听下拉列表变化事件
                citySelector.addEventListener('change', function () {
                    // 获取选中的城市
                    let selectedCity = citySelector.value;

                    let temp_city_rank = document.getElementById('city_rank')
                    temp_city_rank.innerHTML = selectedCity +'市年空气质量等级占比表'
                
                    // 在图表中添加新线
                    changeChart(selectedCity);
                });



                function getColorForCategory(categoryIndex) {
                    // 返回对应类别的颜色
                    const colors = ['#3AA10E', '#FFCC66', '#FF6E1A', '#FF2F2F', '#800202','#3B1543'];
                    return colors[categoryIndex];
                }

                function changeChart(selectedCity){

                

                    let newdata = resultByCity[selectedCity];

                    init_chart(newdata);


                }

                var rawData = resultByCity['上海']

            function init_chart(data){
                    var option;
                    
                    let rawData = data;
                    // There should not be negative values in rawData
        
                    const totalData = [];
                    for (let i = 0; i < rawData[0].length; ++i) {
                    let sum = 0;
                    for (let j = 0; j < rawData.length; ++j) {
                        sum += rawData[j][i];
                    }
                    totalData.push(sum);
                    }
              
                    const grid = {
                    left: "10%",
                    right:'5%',
                    top: "15%",
                    bottom:"12%"
                    };
                    const series = [
                    '优',
                    '良',
                    '轻度污染',
                    '中度污染',
                    '重度污染',
                    ].map((name, sid) => {
                    return {
                        name,
                        type: 'bar',
                        stack: 'total',
                        barWidth: '60%',
                        label: {
                        show: true,
                        textStyle: {
                            fontSize: 8  // 设置字体大小为12px
                            // 其他字体样式配置...
                        },
                        formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
                        },
                        itemStyle: {
                            color: getColorForCategory(sid)  // 调用函数获取颜色
                        },
                        data: rawData[sid].map((d, did) =>
                        totalData[did] <= 0 ? 0 : d / totalData[did]
                        )
                    };
                    });
                    option = {
                    legend: {
                        selectedMode: false,
                        itemWidth: 10,    // 设置图例项的宽度
                        itemHeight: 10, 
                        x:"10%",
                        y:"0%",
                        textStyle: {
                            fontSize: 14,  // 设置字体大小为12px
                            color:'##CD6600'
                            // 其他字体样式配置...
                        },
                    },
                    grid,
                    yAxis: {
                        type: 'value',
                        data: [0.2,0.4,0.6,0.8,1],
                        
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                color: '#2156E8'  // 蓝色
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#CED41F'  // 设置 x 轴颜色
                                }
                            }
                        }
                        
                    },
                    xAxis: {
                        type: 'category',
                        data: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                color: '#CED41F'  // 蓝色
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#CED41F'  // 设置 x 轴颜色
                                }
                            }
                        }
                    },
        
                    series
                    };
                    
                    option && myChart.setOption(option);
                    
                
                    window.addEventListener("resize",function(){
                        myChart.resize();
                    });
            }

            init_chart(rawData);
            }

            
        function echarts_4() {

            // 获取下拉列表元素
        var myChart = echarts.init(document.getElementById('echart4'));
        var citySelector = document.getElementById('citySelector');

        // 监听下拉列表变化事件
        citySelector.addEventListener('change', function () {
            // 获取选中的城市
            let selectedCity = citySelector.value;
            console.log(selectedCity)
            // 在图表中添加新线
            addNewLine(selectedCity,0);
        });

        var citySelector2 = document.getElementById('citySelector2');

        citySelector2.addEventListener('change',function(){
            // 获取选中的城市
            let selectedCity2 = citySelector2.value;
            
            // 在图表中添加新线
            addNewLine(selectedCity2,1);
        })

        // 添加新线的函数
        function addNewLine(city,index) {
            // 根据城市数据添加新的系列
            let newData = generateDataForCity(city);
            // 获取原有的配置
            let option = myChart.getOption();

            colors = ['#00d887','#fff887']
            // legend: {
            //     top:'0%',
            //     data:['上海','北京'],
            //             textStyle: {
            //        color: 'rgba(255,255,255,.5)',
            // 		fontSize:'12',
            //     }
            let citylists = option.legend[0].data;;

            
            
            citylists[index] = city;
            
            option.legend = {
                top:'0%',
                data:citylists,
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize:'12',
                }
            }

            // 修改第一个 series 的数据
            option.series[index] = {

                
                    name: city,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        
                        normal: {
                            color: colors[index],
                            width: 3
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: colors[index],
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: newData
            
                }

            // 通过 setOption 应用新的配置
            myChart.setOption(option);



        }


        // 生成指定城市的模拟数据
        function generateDataForCity(city) {
            // 根据城市生成相应的数据，你可以根据实际情况进行修改
            // ...
            return AQIdata[city];
        }

            // 基于准备好的dom，初始化echarts实例
        
            

            option = {
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#dddc6b'
                    }
                }
            },
                    legend: {
                top:'0%',
                data:['上海','北京'],
                        textStyle: {
                color: 'rgba(255,255,255,.5)',
                    fontSize:'12',
                }
            },
            grid: {
                left: '10',
                top: '30',
                right: '10',
                bottom: '10',
                containLabel: true
            },

            xAxis: [{
                type: 'category',
                boundaryGap: false,
        axisLabel:  {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                    },
                axisLine: {
                    lineStyle: { 
                        color: 'rgba(255,255,255,.2)'
                    }

                },

        data: ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023']

            }, {

                axisPointer: {show: false},
                axisLine: {  show: false},
                position: 'bottom',
                offset: 20,

            

            }],

            yAxis: [{
                type: 'value',
                axisTick: {show: false},
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                },
            axisLabel:  {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                    },

                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                }
            }],
            series: [
                {
                name: '上海',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    
                    normal: {
                        color: '#00d887',
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(1, 132, 213, 0.4)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(1, 132, 213, 0.1)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                    }
                },
                    itemStyle: {
                    normal: {
                        color: '#00d887',
                        borderColor: 'rgba(221, 220, 107, .1)',
                        borderWidth: 12
                    }
                },
                data: AQIdata['上海']

            }, 
            {
                name: '北京',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    
                    normal: {
                        color: '#fff887',
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 216, 135, 0.4)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(0, 216, 135, 0.1)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                    }
                },
                    itemStyle: {
                    normal: {
                        color: '#fff887',
                        borderColor: 'rgba(221, 220, 107, .1)',
                        borderWidth: 12
                    }
                },
                data: AQIdata['北京']

            }, 
            
                ]

        };
            
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.addEventListener("resize",function(){
                    myChart.resize();
                });
            }

        function echarts_31() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('fb1'));

            var yearSelector = document.getElementById('yearSelector');

            // 监听下拉列表变化事件
            yearSelector.addEventListener('change', function () {
                // 获取选中的城市
                let selectedyear = yearSelector.value;

                let year_dom = document.getElementById('year_rank')
                year_dom.innerHTML = selectedyear + '年均空气质量等级省会城市分布图'
                
                // 在图表中添加新线
                init_chart(selectedyear)
            
            });

                const colors = ['#3AA10E', '#FFCC66', '#FF6E1A', '#FF2F2F', '#800202'];







            function init_chart(year){

                let resultData = [];
                for(let i = 0; i<5;i++){
                    let name_t;
                    if(i == 0){
                        name_t = '优'
                    }
                    else if(i ==1){
                        name_t = '良'
                    }
                    else if(i ==2){
                        name_t = '轻度污染'
                    }
                    else if(i ==3){
                        name_t = '中度污染'
                    }
                    else if(i ==4){
                        name_t = '重度污染'
                    }
                    resultData.push({value:pieData[year][i],name:name_t})
                }
                // 为每一项设置不同的颜色
                resultData.forEach((item, index) => {
                    item.itemStyle = {
                        color: colors[index],
                    };
                });

                var option;
                
                option = {
                tooltip: {
                    trigger: 'item'
                },

                legend: {
                    orient: 'horizontal',  // 横向排放
                    textStyle: {
                        fontSize: 14,
                        color: '#',
                    },
                    itemHeight: 10,
                    itemWidth: 10,
                    // 设置图例组件不受图表大小的影响
                
                    width: '100%',
                    left: '5%',
                    top: '0%',  // 调整 top 属性使其在图表之外
                },
                series: [
                    {
                    name: '年均空气质量等级:城市数',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data:resultData
                    }
                ]
                };
            
            
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.addEventListener("resize",function(){
                    myChart.resize();
                });
            }
        init_chart('2023');
        
        }

    	
})
 
})


