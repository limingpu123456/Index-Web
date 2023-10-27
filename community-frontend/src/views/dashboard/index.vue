<template>
  <div class="app-container">
    <div>
      <div id="myChart" style="width: 50%;height:600px;margin-top: 10px; float: left"></div>
      <div id="myChart2" style="width: 50%;height:600px;margin-top: 10px; float: right"></div>
    </div>
  </div>
</template>

<script>
import { chart } from '@/api/sys/inOut'
export default {
  name: 'Dashboard',
  data() {
    return {
    }
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
      chart().then(res => {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          color: ['#3398DB'],
          title: {
            text: '智慧社区住户量统计',
            subtext: '对比图',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            data: res.data.names
          },
          yAxis: {},
          series: [{
            name: '住户量',
            type: 'bar',
            data: res.data.nums
          }],

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        });

        let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
        myChart2.setOption({
          title: {
            text: '智慧社区住户量统计',
            subtext: '占比图',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '住户量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: res.data.list.sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              itemStyle: {
                color: '#3398DB'
              },

              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        });


      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
