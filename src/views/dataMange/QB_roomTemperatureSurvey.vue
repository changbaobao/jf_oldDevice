<template>
  <div
    class="grid-content MainContainer"
    style="padding:0;"
  >
    <div
      class="aside"
      :class="{'collopseW':hideSide}"
    >
      <div class="left-tree">
        <el-scrollbar style="height:75%;">
          <el-tree
            ref="pipeWellTree"
            style="background-color:#fff;color:#333;"
            :props="treeProps"
            node-key="id"
            :load="treeLoadNode"
            :render-content="renderContent"
            :append="add"
            lazy
            @node-click="nodeSelect"
          />
        </el-scrollbar>
        <div class="btn-container">
          <div class="btn-item m_b10">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="dialogVisible=true"
            >生成报告</el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              @click="transformation()"
            >3D转换</el-button>
          </div>
          <div class="btn-item">
            <el-dropdown
              split-button
              type="primary"
              size="mini"
            >
              移除
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="showConduit">
                  <span>移除管道</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="showTube">
                  <span>移除管井</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="showRegion">
                  <span>移除区域</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="showHeat">
                  <span>移除供暖位置</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <span
        class="arrow"
        @click="treeShow"
      >
        <img
          src="../../assets/arrow.png"
          alt
        />
      </span>
    </div>
    <div
      id="allmap"
      style="width: 100%;height:100%;overflow:hidden;"
    />
    <div
      v-if="structureId!=''"
      class="heatingDetail"
    >
      <div class="item-detail">
        <h2
          class="item-title"
          title="共100台 淇滨热力55台 盾安供热25台 朝歌热力10台 浚州热力10台"
        >共100台 淇滨热力55台 盾安供热25台 朝歌热力10台 浚州热力10台</h2>
        <div class="chart-detail">
          <el-row style="height:50%;">
            <el-col
              :span="14"
              style="height:100%;"
            >
              <echart-p
                :id="tempObj.id"
                height="100%"
                width="100%"
                :series-data="tempObj.seriesData"
                :color-list="tempObj.colorList"
                :legend-title="tempObj.legendTitle"
                :legend-color="tempObj.textColor"
              ></echart-p>
              <!-- <echart-p
                :id="temperature"
                :pie-data="heatingData"
                :width="width"
                :height="height"
                :text-color="textColor"
                :color="temperatureColor"
              /> -->
            </el-col>
            <el-col
              :span="10"
              style="height:100%;padding:10px;box-sizing:border-box;display:flex;align-items:center;"
            >
              <div class="heatCard-content weatherCondition">
                <i class="icon">
                  <img
                    :src="weatherCondition.weatherImg"
                    alt
                  />
                </i>
                <h1>{{ weatherCondition.temp }}℃</h1>
                <ul>
                  <li>相对湿度：{{ weatherCondition.temp }}%</li>
                  <li>体感温度：{{ weatherCondition.realFeel }}℃</li>
                  <li>风向：{{ weatherCondition.windDir }}</li>
                  <li>风力等级：{{ weatherCondition.windLevel }}级</li>
                </ul>
              </div>
            </el-col>
          </el-row>
          <el-row style="height:50%;">
            <el-col
              :span="24"
              style="height:100%;"
            >
              <lineChart
                :id="chartId"
                :result-data="chartData"
                height="100%"
                width="100%"
              />
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 生成报告弹框 -->
    <el-dialog
      title="室温简报"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <div class="demo-image__lazy">
        <el-image
          v-for="(url,index) in srcList"
          :key="index"
          :src="url.imgUrl"
          lazy
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Qs from 'qs'
import AMap from 'AMap'
import echartP from '../../components/Charts/PieChart'
import lineChart from '@/components/Charts/LineChart'
import { isDot } from '@/utils/index'
var GDMap
export default {
  name: 'QBRoomTemperatureSurvey',
  components: {
    echartP,
    lineChart,
  },
  data() {
    return {
      dialogVisible: false,
      srcList: [
        { imgUrl: require('../../assets/temBriefing/1.png') },
        { imgUrl: require('../../assets/temBriefing/2.png') },
        { imgUrl: require('../../assets/temBriefing/3.png') },
        { imgUrl: require('../../assets/temBriefing/4.png') },
        { imgUrl: require('../../assets/temBriefing/5.png') },
        { imgUrl: require('../../assets/temBriefing/6.png') },
        { imgUrl: require('../../assets/temBriefing/7.png') },
        { imgUrl: require('../../assets/temBriefing/8.png') },
        { imgUrl: require('../../assets/temBriefing/9.png') },
      ],
      structureId: '', // 项目id
      chartId: 'chartId',
      chartData: [],
      weatherCondition: {
        temp: 0,
        realFeel: 0,
        windDir: '',
        windLevel: '',
      },

      hideSide: true,
      tempObj: {
        id: 'temperature',
        textColor: '#fff',
        legendTitle: [],
        seriesData: [],
        colorList: ['#437FF1', '#ECCF39', '#34da62', '#d0a00e', '#FF0000'],
      },

      treeProps: {
        // 配置父子树的属性名
        label: 'name',
        isLeaf: 'isLeaf',
        children: '',
      },
      selectNode: {},
      selectNodee: {},
      GaoDeMap: {
        // 百度地图
        AMap: {},
      },
      addDialogVisible: false, // 添加开关
      formTitle: '添加',
      form: {
        structureId: '',
        code: '',
        name: '',
        type: 0,
        remark: '',
        lonLat: '',
      },
      pipe: {
        id: '',
        structureId: '',
        code: '',
        name: '',
        type: 0,
        remark: '',
        lonLat: '',
      },
      node: {},
      resolve: '',
      isFirst: true,
      color: '',
      isDisabled: true,
      saveData: [],
      HeatArr: [],
      markerArr: [],
      marker_poly: -1,
      polylineArr: [],
      polyline_poly: -1,
      polygonArr: [],
      polygon_poly: -1,
      isTubeShow: 1,
      isShowConduit: 1,
      isShowRegion: 1,
      isShowHeat: 1,
      polylineEditorArr: [],
      polygonEditorArr: [],
      isChange: '2D',
      change_sign: true,
      image: 'https://demo-demo12.oss-cn-beijing.aliyuncs.com/1.png',
    }
  },
  mounted() {
    this.initMap()
    this.getCompanyStructure()
  },
  created: function () {
    // this.initMap()
  },
  methods: {
    initChart(data) {
      // console.error(data,'697')
      this.chartData = [
        data.filter((v) => {
          return v < 19
        }).length == 0
          ? 0
          : data.filter((v) => {
              return v < 19
            }).length,
        data.filter((v) => {
          return v >= 19 && v < 20
        }).length == 0
          ? 0
          : data.filter((v) => {
              return v >= 19 && v < 20
            }).length,
        data.filter((v) => {
          return v >= 20 && v < 21
        }).length == 0
          ? 0
          : data.filter((v) => {
              return v >= 20 && v < 21
            }).length,
        data.filter((v) => {
          return v >= 21 && v < 22
        }).length == 0
          ? 0
          : data.filter((v) => {
              return v >= 21 && v < 22
            }).length,
        data.filter((v) => {
          return v >= 22 && v < 23
        }).length == 0
          ? 0
          : data.filter((v) => {
              return v >= 22 && v < 23
            }).length,
        data.filter((v) => {
          return v >= 23 && v <= 24
        }).length == 0
          ? 0
          : data.filter((v) => {
              return v >= 23 && v <= 24
            }).length,
        data.filter((v) => {
          return v > 24
        }).length == 0
          ? 0
          : data.filter((v) => {
              return v > 24
            }).length,
      ]
    },
    /**
     * 获取天气实况
     */
    getWeatherCondition() {
      this.weatherCondition = {}
      this.$http
        .post(
          'S-WeatherForecast/WeatherCondition',
          Qs.stringify({ cityId: 426 })
        )
        .then((res) => {
          const data = res.data.condition
          data.weatherImg = require(`../../assets/weather/W${data.icon}.png`)
          this.weatherCondition = data
        })
    },
    /**
     * 室温分布
     */
    getTemperatureData(id) {
      this.$http
        .post(
          '/S-House/listRoomtemperature',
          Qs.stringify({ structureId: id, pageNo: 1, pageSize: 10000 })
        )
        .then((res) => {
          if (res.data.success) {
            const { list } = res.data.data
            const arr = []
            list.map((item) => {
              if (item.houseDev && item.houseDev.length != 0) {
                item.houseDev.map((v) => {
                  if (v.type == '室内温度' && v.realDataValue != null) {
                    arr.push(v.realDataValue)
                  }
                })
              }
            })
            this.getTemperatureDistribute(arr) // 室温分布
          }
        })
      // heatingData
    },
    // 计算室温
    getTemperatureDistribute(arr) {
      const resultArr = arr.map(function (item) {
        return +item
      }) // 字符串转numberheat
      this.initChart(resultArr) // 初始化柱形图
      const Less16 = resultArr.filter((v) => {
        return v < 16
      }) // 获取数组中小于18℃
      const Less18 = resultArr.filter((v) => {
        return v >= 16 && v < 18
      })
      const Between = resultArr.filter((v) => {
        return v >= 18 && v < 22
      })
      const Between22 = resultArr.filter((v) => {
        return v >= 22 && v <= 24
      })
      const Greater = resultArr.filter((v) => {
        return v > 24
      }) // 获取数组中大于24℃
      const a =
        resultArr.length == 0 ? 0 : isDot(Less16.length / resultArr.length, 2)
      const b =
        resultArr.length == 0 ? 0 : isDot(Less18.length / resultArr.length, 2)
      const c =
        resultArr.length == 0 ? 0 : isDot(Between.length / resultArr.length, 2)
      const d =
        resultArr.length == 0
          ? 0
          : isDot(Between22.length / resultArr.length, 2)
      const e =
        resultArr.length == 0 ? 0 : isDot(Greater.length / resultArr.length, 2)

      let heatingData = [
        {
          name: `小于16℃占比${parseFloat((a * 100).toPrecision(12))}%`,
          value: a,
        },
        {
          name: `16~18℃占比${parseFloat((b * 100).toPrecision(12))}%`,
          value: b,
        },
        {
          name: `18℃至22℃占比${parseFloat((c * 100).toPrecision(12))}%`,
          value: c,
        },
        {
          name: `22~24℃占比${parseFloat((d * 100).toPrecision(12))}%`,
          value: d,
        },
        {
          name: `大于24℃占比${parseFloat((e * 100).toPrecision(12))}%`,
          value: e,
        },
      ]
      this.tempObj.legendTitle = heatingData.map((item) => {
        return item.name
      })
      this.tempObj.seriesData = [
        {
          type: 'pie',
          name: '室温分布',
          radius: ['30%', '60%'],
          avoidLabelOverlap: false,
          center: ['50%', '40%'],
          labelLine: {
            // 取消线
            normal: {
              show: false,
            },
          },
          data: heatingData,
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
            },
          },
        },
      ]
    },
    /**
     * 点击收起展开
     */
    treeShow() {
      this.hideSide = !this.hideSide
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.data.name}</span>
        </span>
      )
    },
    add(val) {
      this.$refs.pipeWellTree.append(val, this.selectNodee)
    },
    // 3D-2D转换
    transformation: function () {
      if (this.change_sign) {
        this.isChange = '3D'
        this.GaoDeMap.AMap.setZoom(17)
        this.change_sign = false
      } else {
        this.isChange = '2D'
        this.change_sign = true
      }
      this.initMap()
      this.getCompanyStructure()
      this.pipelineDisplay()
      this.node.childNodes = []
      this.treeLoadNode(this.node, this.resolve)
      this.GaoDeMap.AMap.setLang('zh_cn')
    },
    showTube: function () {
      if (this.isTubeShow === 1) {
        for (var i = 0; i < this.markerArr.length; i++) {
          this.markerArr[i].hide()
        }
        this.isTubeShow = 2
      } else {
        for (var p = 0; p < this.markerArr.length; p++) {
          this.markerArr[p].show()
        }
        this.isTubeShow = 1
      }
    },
    showConduit: function () {
      if (this.isShowConduit === 1) {
        for (var i = 0; i < this.polylineArr.length; i++) {
          this.polylineArr[i].hide()
        }
        this.isShowConduit = 2
      } else {
        for (var m = 0; m < this.polylineArr.length; m++) {
          this.polylineArr[m].show()
        }
        this.isShowConduit = 1
      }
    },
    showRegion: function () {
      if (this.isShowRegion === 1) {
        for (var i = 0; i < this.polygonArr.length; i++) {
          this.polygonArr[i].hide()
        }
        this.isShowRegion = 2
      } else {
        for (var m = 0; m < this.polygonArr.length; m++) {
          this.polygonArr[m].show()
        }
        this.isShowRegion = 1
      }
    },
    showHeat: function () {
      if (this.isShowHeat === 1) {
        for (var i = 0; i < this.HeatArr.length; i++) {
          this.HeatArr[i].hide()
        }
        this.isShowHeat = 2
      } else {
        for (var m = 0; m < this.HeatArr.length; m++) {
          this.HeatArr[m].show()
        }
        this.isShowHeat = 1
      }
    },
    /**
     * 项目点标记
     */
    getMarker(list) {
      this.$http
        .post(
          '/S-House/listRoomtemperature',
          Qs.stringify({ structureId: list.id, pageNo: 1, pageSize: 10000 })
        )
        .then((res) => {
          if (res.data.success) {
            const arr = res.data.data.list

            let value = 0
            let content = ''

            let val = arr.filter((item) => {
              return item.houseDev && item.houseDev[0].realDataValue != null
            })

            for (let index = 0; index < val.length; index++) {
              const element = val[index]
              const houseValue = element.houseDev
              const communityName =
                element.community == null ? '' : element.community.name
              value += Number(houseValue[0].realDataValue)
              let address = element.addressOne == null ? '' : element.addressOne
              content +=
                '<label>小区：' +
                communityName +
                '</label><br/><label>楼栋单元：' +
                address +
                '</label><br/><label>温度值：' +
                houseValue[0].realDataValue +
                '</label><br/><hr />'
            }
            let result = 0
            if (val.length !== 0) {
              result = isDot(value / val.length, 2)
            }
            let img = ''

            if (result === 0) {
              img =
                'https://demo-demo12.oss-cn-beijing.aliyuncs.com/NoGreen.png'
            } else if ((result <= 18) & (result > 0)) {
              img = 'https://demo-demo12.oss-cn-beijing.aliyuncs.com/blue.png'
            } else if ((result > 18) & (result < 22)) {
              img =
                'https://demo-demo12.oss-cn-beijing.aliyuncs.com/yesGreen.png'
            } else if (result >= 22) {
              img = 'https://demo-demo12.oss-cn-beijing.aliyuncs.com/1.png'
            }
            var zoomStyleMapping2 = {
              6: 0,
              7: 0,
              8: 0,
              9: 0,
              10: 0,
              11: 0,
              12: 0,
              13: 0,
              14: 0,
              15: 1,
              16: 1,
              17: 1,
              18: 1,
              19: 1,
              20: 1,
            }
            var marker = new AMap.ElasticMarker({
              position: [list.lon, list.lat],
              zooms: [8, 20],
              styles: [
                {
                  icon: {
                    img: img,
                    size: [18, 20], // 可见区域的大小
                    ancher: [9, 10], // 锚点
                    scaleFactor: 2, // 地图放大一级的缩放比例系数
                    maxScale: 2, // 最大放大比例
                    minScale: 1, // 最小放大比例
                  },
                },
                {
                  icon: {
                    img: img,
                    size: [140, 150],
                    ancher: [70, 75],
                    fitZoom: 20,
                    scaleFactor: 2,
                    maxScale: 0.455,
                    minScale: 0.225,
                  },
                },
              ],
              zoomStyleMapping: zoomStyleMapping2,
            })
            var _that = this
            let Lname = list.NAME || list.name
            marker.on('click', () => {
              var MyComponent = Vue.extend({
                methods: {},
                template:
                  '<div className="custom-infowindow input-card">' +
                  '<label style="color:grey">' +
                  Lname +
                  '</label><br/>' +
                  '<label>平均温度：' +
                  result +
                  '℃</label><br/><hr />' +
                  content +
                  '</div>',
              })
              var component = new MyComponent().$mount()
              // 创建一个自定义内容的 infowindow 实例
              var infoWindow = new AMap.InfoWindow({
                position: [list.lon, list.lat],
                content: component.$el,
              })

              infoWindow.open(_that.GaoDeMap.AMap)
              this.structureId = list.id
              this.getWeatherCondition()
              this.getTemperatureData(list.id)
            })
            this.GaoDeMap.AMap.add(marker)
          }
        })
    },
    // 项目点展示
    getCompanyStructure() {
      this.$http
        .post('/S-House/listPipeNetwork', Qs.stringify({ type: 2 }))
        .then((res) => {
          if (res.data.success) {
            const val = res.data.data
            for (let index = 0; index < val.length; index++) {
              const element = val[index]
              if (element.lon == null) {
              } else {
                this.getMarker(element)
              }
            }
          }
        })
    },
    // 显示点 折现 区域
    displayBMap(data) {
      var point = []
      var pGon = []
      var xqo = JSON.parse(data.lonLat)
      if (data.type === 1) {
        for (var k in xqo) {
          var rel = [xqo[k].lon, xqo[k].lat]
          point.push(rel)
        }
        this.color = data.pipeColor
        var polyline = new AMap.Polyline({
          path: point,
          strokeColor: this.color,
          strokeOpacity: 1,
          strokeWeight: 3,
          // 折线样式还支持 'dashed'
          strokeStyle: 'solid',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
        })
        polyline.kfData = data.code
        this.polylineArr.push(polyline)
        polyline.setMap(this.GaoDeMap.AMap)
        var polyEditor = new AMap.PolyEditor(this.GaoDeMap.AMap, polyline)
        polyEditor.kfData = data.code
        this.polylineEditorArr.push(polyEditor)
        var infoWindow = new AMap.InfoWindow({
          anchor: 'top-left',
          content: data.name,
        })
        var _this = this
        polyline.on('mouseover', function (e) {
          infoWindow.open(_this.GaoDeMap.AMap, [e.lnglat.lng, e.lnglat.lat])
        })
        polyline.on('mouseout', function (e) {
          infoWindow.close()
        })
        // 缩放地图到合适的视野级别
        // this.GaoDeMap.AMap.setFitView([ polyline ])
      } else if (data.type === 2) {
        // const icon = new AMap.Icon({
        //   image: require('../../assets/gj.png'),
        //   imageSize: new AMap.Size(36, 36),
        //   anchor: 'center'
        // })
        // var marker = new AMap.Marker({
        //   position: [xqo[0].lon, xqo[0].lat],
        //   icon: icon,
        //   offset: new AMap.Pixel(-20, -30),
        //   cursor: 'move',
        //   // 设置拖拽效果
        //   raiseOnDrag: true
        // })
        // marker.kfData = data.code
        // this.markerArr.push(marker)
        // marker.setMap(this.GaoDeMap.AMap)
        // marker.setTitle(data.name)// 鼠标滑过标签
        var zoomStyleMapping2 = {
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 1,
          16: 1,
          17: 1,
          18: 1,
          19: 1,
          20: 1,
        }
        var marker = new AMap.ElasticMarker({
          position: [xqo[0].lon, xqo[0].lat],
          zooms: [8, 20],
          styles: [
            {
              icon: {
                img: 'https://demo-demo12.oss-cn-beijing.aliyuncs.com/gj.png',
                size: [100, 100], // 可见区域的大小
                ancher: [9, 10], // 锚点
                scaleFactor: 2, // 地图放大一级的缩放比例系数
                maxScale: 2, // 最大放大比例
                minScale: 1, // 最小放大比例
              },
            },
            {
              icon: {
                img: 'https://demo-demo12.oss-cn-beijing.aliyuncs.com/gj.png',
                size: [140, 150],
                ancher: [60, 75],
                fitZoom: 20,
                scaleFactor: 2,
                maxScale: 0.455,
                minScale: 0.225,
              },
            },
          ],
          zoomStyleMapping: zoomStyleMapping2,
        })
        marker.kfData = data.code
        this.markerArr.push(marker)
        marker.setMap(this.GaoDeMap.AMap)
        marker.setTitle(data.name) // 鼠标滑过标签
        // this.GaoDeMap.AMap.add(marker)
      } else {
        for (var j in xqo) {
          var rele = []
          rele.push(xqo[j].lon, xqo[j].lat)
          pGon.push(rele)
        }
        var polygon = new AMap.Polygon({
          path: pGon,
          strokeColor: '#FF33FF',
          strokeWeight: 3,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50,
        })
        polygon.kfData = data.code
        this.polygonArr.push(polygon)
        this.GaoDeMap.AMap.add(polygon)
        var GpolyEditor = new AMap.PolyEditor(this.GaoDeMap.AMap, polygon)
        GpolyEditor.kfData = data.code
        this.polygonEditorArr.push(GpolyEditor)
        var polygonInfoWindow = new AMap.InfoWindow({
          anchor: 'top-left',
          content: data.name,
        })
        var _that = this
        polygon.on('mouseover', function (e) {
          polygonInfoWindow.open(_that.GaoDeMap.AMap, [
            e.lnglat.lng,
            e.lnglat.lat,
          ])
        })
        polygon.on('mouseout', function (e) {
          polygonInfoWindow.close()
        })
      }
    },
    // 点 折现 区域 编辑
    editableBMap(obj) {
      if (obj.type === 1 || obj.type === 3) {
        var xqo = JSON.parse(obj.lonLat)
        this.GaoDeMap.AMap.setCenter([xqo[0].lon, xqo[0].lat]) // 设置地图中心点
        for (var o = 0; o < this.markerArr.length; o++) {
          this.markerArr[o].setAnimation(null)
        }
        var infoWindow = new AMap.InfoWindow({
          anchor: 'top-left',
          content: obj.name,
        })
        var _this = this
        infoWindow.open(_this.GaoDeMap.AMap, [xqo[0].lon, xqo[0].lat])
      } else if (obj.type === 2) {
        var xqo2 = JSON.parse(obj.lonLat)
        this.GaoDeMap.AMap.setCenter([xqo2[0].lon, xqo2[0].lat]) // 设置地图中心点
        for (var b = 0; b < this.polylineEditorArr.length; b++) {
          this.polylineEditorArr[b].close()
        }
        for (var m = 0; m < this.polygonEditorArr.length; m++) {
          this.polygonEditorArr[m].close()
        }
        for (var l = 0; l < this.markerArr.length; l++) {
          if (obj.code === this.markerArr[l].kfData) {
            if (this.marker_poly === -1) {
              this.markerArr[l].setAnimation('AMAP_ANIMATION_BOUNCE')
              this.markerArr[l].setDraggable(true)
              this.marker_poly = l
            } else {
              this.markerArr[this.marker_poly].setAnimation(null)
              this.markerArr[this.marker_poly].setDraggable(false)
              this.markerArr[l].setAnimation('AMAP_ANIMATION_BOUNCE')
              this.markerArr[l].setDraggable(true)
              this.marker_poly = l
            }
          }
        }
      }
    },
    getHeatingPositionLonLat(node) {
      this.$http
        .post(
          '/S-Base/getHeatingPositionByStructureId',
          Qs.stringify({ structureId: node.data.id })
        )
        .then((res) => {
          if (res.data.success) {
            for (let i = 0; i < res.data.data.length; i++) {
              const lon = res.data.data[i].lon
              const lat = res.data.data[i].lat
              if (lon != null) {
                var marker = new AMap.Marker({
                  position: [lon, lat],
                  icon: new AMap.Icon({
                    size: new AMap.Size(25, 34),
                    image: require('../../assets/poi-marker-default.png'),
                    imageSize: new AMap.Size(25, 34),
                    anchor: 'center',
                  }),
                  offset: new AMap.Pixel(-13, -30),
                })
                marker.setMap(this.GaoDeMap.AMap)
                this.HeatArr.push(marker)
                marker.setTitle(res.data.data[i].position) // 鼠标滑过标签
              }
            }
          }
        })
    },
    initMap: function () {
      // 默认地图中心点
      this.GaoDeMap.AMap = new AMap.Map('allmap', {
        center: [114.293298, 35.744579],
        resizeEnable: true,
        expandZoomRange: true,
        zooms: [3, 20],
        // zoom: 14,
        pitch: 80,
        viewMode: this.isChange,
        rotateEnable: true,
        buildingAnimation: true, // 楼块出现是否带动画
        pitchEnable: true,
      })
      this.GaoDeMap.AMap.setMapStyle('amap://styles/light')
      this.GaoDeMap.AMap.setFeatures(['road', 'bg', 'building']) // 多个种类要素显示
      GDMap = this.GaoDeMap.AMap
      this.GaoDeMap.AMap.addControl(
        new AMap.ControlBar({
          showZoomBar: false,
          showControlButton: true,
          position: {
            right: '10px',
            top: '10px',
          },
        })
      )
      this.pipelineDisplay()
      setTimeout(() => {
        this.getMapData()
      }, 100)
    },
    nodeSelect(obj, node, nodeArr) {
      this.structureId = ''
      this.selectNode = obj
      this.selectNodee = node
      // 百度地图中心点
      if (obj.lat > 0) {
        this.GaoDeMap.AMap.setCenter([obj.lon, obj.lat]) // 设置地图中心点
        if (obj.structureTypeName === '项目') {
          this.GaoDeMap.AMap.setZoom(obj.gdZoomlevel)
        } else if (obj.structureTypeName === '子公司') {
          this.GaoDeMap.AMap.setZoom(obj.gdZoomlevel)
        } else {
          this.GaoDeMap.AMap.setZoom(obj.gdZoomlevel)
        }
      } else {
        this.editableBMap(obj)
      }

      // 根据项目加载天气和室温信息
      // if (obj.structureTypeName === '项目') {
      this.structureId = obj.id
      this.getWeatherCondition()
      this.getTemperatureData(this.structureId)
      // }
      if (obj.lonLat !== undefined) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    // 所有一次管网显示
    pipelineDisplay() {
      this.$http.post('/S-Base/getPipeWellByRoleStrId').then((res) => {
        if (res.data.success) {
          var data = res.data.data
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            this.displayBMap(element)
            // var xqo = JSON.parse(element.lonLat)
            // for (var k in xqo) {
            //   var rel = [xqo[k].lon, xqo[k].lat]
            //   point.push(rel)
            // }
            // this.color = element.pipeColor
            // var polyline = new AMap.Polyline({
            //   path: point,
            //   strokeColor: this.color,
            //   strokeOpacity: 1,
            //   strokeWeight: 3,
            //   // 折线样式还支持 'dashed'
            //   strokeStyle: 'solid',
            //   // strokeStyle是dashed时有效
            //   strokeDasharray: [10, 5],
            //   lineJoin: 'round',
            //   lineCap: 'round',
            //   zIndex: 50
            // })
            // // this.GaoDeMap.AMap.setZoom(14)
            // polyline.kfData = element.code
            // this.polylineArr.push(polyline)
            // polyline.setMap(this.GaoDeMap.AMap)
            // var polyEditor = new AMap.PolyEditor(this.GaoDeMap.AMap, polyline)
            // polyEditor.kfData = element.code
            // this.polylineEditorArr.push(polyEditor)
            // var infoWindow = new AMap.InfoWindow({
            //   anchor: 'top-left',
            //   content: element.name
            // })
            // var _this = this
            // polyline.on('mouseover', function(e) {
            //   infoWindow.open(_this.GaoDeMap.AMap, [e.lnglat.lng, e.lnglat.lat])
            // })
            // polyline.on('mouseout', function(e) {
            //   infoWindow.close()
            // })
          }
        }
      })
    },
    treeLoadNode(node, resolve) {
      if (this.isFirst) {
        this.node = node
        this.resolve = resolve
        this.isFirst = false
      }
      // 根节点
      if (node.level === 0) {
        this.getTreeData(0, resolve)
      } else {
        // 查询管道  管井    node.state.isLeaf = true
        if (node.data.structureTypeName === '项目') {
          this.$http
            .post(
              '/S-Base/getPipeWellByStructureId',
              Qs.stringify({ structureId: node.data.id })
            )
            .then((res) => {
              this.getHeatingPositionLonLat(node, resolve)
              if (res.data.success) {
                if (res.data.data.length === 0) {
                  resolve([])
                } else {
                  const arr = []
                  for (let i = 0; i < res.data.data.length; i++) {
                    arr.push(res.data.data[i])
                    const flag = false
                    this.$set(res.data.data[i], 'isLeaf', flag)
                  }
                  for (var i in arr) {
                    this.displayBMap(arr[i])
                  }
                  resolve(arr)
                }
              }
            })
        } else {
          // 其它   非根节点  非管道管井
          this.getTreeData(node.data.id, resolve)
        }
      }
    },
    getTreeData(id, resolve) {
      this.$http
        .post('/S-House/listByCompanyStructure', Qs.stringify({ parentId: id }))
        .then(function (res) {
          if (res.data.success) {
            resolve(res.data.data)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    getMapData() {
      let val = []
      this.$http
        .post('/S-Base/getStructureByParentID', Qs.stringify({ parentId: 0 }))
        .then(function (res) {
          if (res.data.success) {
            val = res.data.data
            if (val.length !== 0) {
              var zoom = val[0].gdZoomlevel
              if (zoom === null) {
                GDMap.setZoom(11)
              } else {
                GDMap.setZoom(zoom)
              }
              if (val[0].lon === null) {
                GDMap.setCenter([116.397045, 39.909203])
              } else {
                GDMap.setCenter([val[0].lon, val[0].lat])
              }
            }
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.heatingDetail {
  width: 42%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 2px 2px 5px #000;
  color: #fff;
  .item-detail {
    width: 100%;
    height: 100%;
    background: #66d3fc;
    box-sizing: border-box;
  }
  .item-title {
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    color: #fff;
    background: #86dcfd;
    border-bottom: 1px solid #f1f7f7;
    text-indent: 5px;
  }
  .chart-detail {
    width: 100%;
    height: calc(100% - 40px);
  }
}

.weatherCondition h1 {
  color: #fff;
  font-size: 24px;
  text-indent: 20px;
  margin-top: 10px;
}
.weatherCondition i {
  width: 48px;
  height: 48px;
  display: block;
  margin-left: 20px;
}
.weatherCondition i > img {
  width: 100%;
  height: 100%;
  display: block;
}
.weatherCondition ul > li {
  padding: 10px;
  font-size: 15px;
}
.ul-list li {
  line-height: 24px;
}
.grid-content {
  height: 100%;
  position: relative;
}
.aside {
  position: absolute;
  top: 0;
  left: 0;
  width: 18%;
  height: 100%;
  z-index: 200;
  transition: all 0.5s linear;
  background: #fff;
}
.aside.collopseW {
  width: 0;
}
.aside .left-tree {
  width: calc(100% - 20px);
  padding: 15px 10px;
  height: calc(100% - 30px);
}

.aside .btn-container {
  width: 100%;
  background: #f4f4f4;
  padding: 10px 0;
  box-sizing: border-box;
}
.aside .btn-container .btn-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.aside .tree-node {
  background: none;
  color: #333;
  font-size: 16px;
}
.aside .arrow {
  position: absolute;
  right: 0;
  top: 50%;
  width: 22px;
  height: 44px;
  transform: translate(-50%, -50%);
  z-index: 500;
  transform: rotate(0deg);
  transition: all 0.5s linear;
  cursor: pointer;
}
.aside.collopseW .left-tree {
  display: none;
}
.aside.collopseW .arrow {
  right: -22px;
  transform: rotate(-180deg);
}
.MainContainer .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.totalText {
  line-height: 50px;
  height: 50px;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
