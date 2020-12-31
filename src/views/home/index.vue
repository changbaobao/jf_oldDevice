<template>
  <div class="grid-content MainContainer" style="padding:0;">
    <div class="aside" :class="{'collopseW':hideSide}">
      <div class="left-tree">
        <el-scrollbar style="height:90%;">
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
      </div>
      <span class="arrow" @click="treeShow">
        <img src="../../assets/arrow.png" alt="">
      </span>
      <div v-if="!hideSide" class="btn-container">
        <div class="btn-item m_b10">
          <el-button type="primary" plain size="mini" @click="transformation()">3D转换</el-button>
          <el-button type="danger" plain size="mini" @click="showRegion">隐藏区域</el-button>
        </div>
        <div class="btn-item m_b10">
          <el-select v-model="heatSystemvalue" clearable placeholder="供热系统分区隐藏" size="small" @change="heatSystemChange" @clear="heatSystemClear">
            <el-option
              v-for="item in heatSystem"
              :key="item.id"
              :label="item.systemName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="btn-item">
          <el-select v-model="value" clearable multiple placeholder="供暖位置温度压力值" size="small" @change="optionsChange" @clear="optionsClear" @remove-tag="removeOptions">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div id="allmap" style="width: 100%;height:100%;overflow:hidden;" />
  </div>

</template>

<script>
import Vue from 'vue'
import Qs from 'qs'
import AMap from 'AMap'
var GDMap
export default {
  name: 'Main',
  data() {
    return {
      options: [{
        value: 'ST',
        label: '供水温度'
      }, {
        value: 'BT',
        label: '回水温度'
      }, {
        value: 'SP',
        label: '供水压力'
      }, {
        value: 'BP',
        label: '回水压力'
      }, {
        value: 'VO',
        label: '阀门开度'
      }, {
        value: 'VF',
        label: '瞬时流量'
      }],
      heatSystem: [],
      value: '',
      heatSystemvalue: '',
      hideSide: true,
      treeProps: {
        // 配置父子树的属性名
        label: 'name',
        isLeaf: 'leaf',
        children: ''
      },
      selectNode: {},
      selectNodee: {},
      GaoDeMap: {// 百度地图
        AMap: {}
      },
      addDialogVisible: false, // 添加开关
      formTitle: '添加',
      form: {
        structureId: '',
        code: '',
        name: '',
        type: 0,
        remark: '',
        lonLat: ''
      },
      pipe: {
        id: '',
        structureId: '',
        code: '',
        name: '',
        type: 0,
        remark: '',
        lonLat: ''
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
      partitionPlay: 1,
      polylineEditorArr: [],
      polygonEditorArr: [],
      isChange: '2D',
      change_sign: true,
      isDisplayST: 'none',
      isDisplaySP: 'none',
      isDisplayBT: 'none',
      isDisplayBP: 'none',
      isDisplayVO: 'none',
      isDisplayVF: 'none'
    }
  },
  mounted() {
    this.initMap()
    this.getCompanyStructure()
    // this.pipelineDisplay()
  },
  methods: {
    removeOptions(data) {
      var str = ''
      if (this.selectNode.structureTypeName === '项目') {
        str = this.selectNode.id
      } else {
        str = this.selectNode.structureId
      }
      if (data === 'ST') {
        this.isDisplayST = 'none'
      }
      if (data === 'SP') {
        this.isDisplaySP = 'none'
      }
      if (data === 'BT') {
        this.isDisplayBT = 'none'
      }
      if (data === 'BP') {
        this.isDisplayBP = 'none'
      }
      if (data === 'VO') {
        this.isDisplayVO = 'none'
      }
      if (data === 'VF') {
        this.isDisplayVF = 'none'
      }
      for (let index = 0; index < this.HeatArr.length; index++) {
        const element = this.HeatArr[index]
        this.GaoDeMap.AMap.remove(element)
      }
      this.getHeatingPositionLonLat(str)
    },
    optionsClear(data) {
      var str = ''
      if (this.selectNode.structureTypeName === '项目') {
        str = this.selectNode.id
      } else {
        str = this.selectNode.structureId
      }

      this.isDisplayST = 'none'
      this.isDisplaySP = 'none'
      this.isDisplayBT = 'none'
      this.isDisplayBP = 'none'
      this.isDisplayVO = 'none'
      this.isDisplayVF = 'none'
      for (let index = 0; index < this.HeatArr.length; index++) {
        const element = this.HeatArr[index]
        this.GaoDeMap.AMap.remove(element)
      }
      this.getHeatingPositionLonLat(str)
    },
    optionsChange(data) {
      var str = ''
      if (this.selectNode.structureTypeName === '项目') {
        str = this.selectNode.id
      } else {
        str = this.selectNode.structureId
      }
      let all = ''
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        all = all + element + ','
        if (all.indexOf('ST') >= 0) {
          this.isDisplayST = 'block'
        } else {
          this.isDisplayST = 'none'
        }
        if (all.indexOf('SP') >= 0) {
          this.isDisplaySP = 'block'
        } else {
          this.isDisplaySP = 'none'
        }
        if (all.indexOf('BT') >= 0) {
          this.isDisplayBT = 'block'
        } else {
          this.isDisplayBT = 'none'
        }
        if (all.indexOf('BP') >= 0) {
          this.isDisplayBP = 'block'
        } else {
          this.isDisplayBP = 'none'
        }

        if (all.indexOf('VO') >= 0) {
          this.isDisplayVO = 'block'
        } else {
          this.isDisplayVO = 'none'
        }

        if (all.indexOf('VF') >= 0) {
          this.isDisplayVF = 'block'
        } else {
          this.isDisplayVF = 'none'
        }
      }
      if (data.length === 0) {
        this.isDisplayST = 'none'
        this.isDisplaySP = 'none'
        this.isDisplayBT = 'none'
        this.isDisplayBP = 'none'
        this.isDisplayVO = 'none'
        this.isDisplayVF = 'none'
      }
      for (let i = 0; i < this.HeatArr.length; i++) {
        const marker = this.HeatArr[i]
        this.GaoDeMap.AMap.remove(marker)
      }
      this.getHeatingPositionLonLat(str)
    },
    /**
     * 点击供热系统下拉菜单清空选项触发
     */
    heatSystemClear() {
      for (var i = 0; i < this.polylineArr.length; i++) {
        this.polylineArr[i].show()
      }
      this.partitionPlay = 1
    },
    /**
     * 点击供热系统隐藏
     */
    heatSystemChange(data) {
      if (this.partitionPlay === 1) {
        for (var i = 0; i < this.polylineArr.length; i++) {
          if (data !== this.polylineArr[i].heatSystemId) {
            this.polylineArr[i].hide()
          }
        }
        for (var k = 0; k < this.polylineArr.length; k++) {
          if (data === this.polylineArr[k].heatSystemId) {
            this.polylineArr[k].show()
          }
        }
        this.partitionPlay = 2
      }
      if (this.partitionPlay === 2) {
        for (var h = 0; h < this.polylineArr.length; h++) {
          if (data !== this.polylineArr[h].heatSystemId) {
            this.polylineArr[h].hide()
          }
        }
        for (var j = 0; j < this.polylineArr.length; j++) {
          if (data === this.polylineArr[j].heatSystemId) {
            this.polylineArr[j].show()
          }
        }
        this.partitionPlay = 1
      }
      // if (this.partitionPlay === 1) {
      //   for (var i = 0; i < this.polylineArr.length; i++) {
      //     if (data === this.polylineArr[i].heatSystemId) {
      //       this.polylineArr[i].hide()
      //     }
      //   }
      //   this.partitionPlay = 2
      // }
    },
    /**
     * 查询供热系统
     */
    getByHeatSystem(node) {
      this.$http.post('/S-Base/getByHeatSystem', Qs.stringify({ structureId: node.data.id, pageNo: 1, pageSize: 1000 })).then(res => {
        if (res.data.success) {
          this.heatSystem = res.data.data.list
        }
      })
    },
    /**
     * 点击收起展开
     */
    treeShow() {
      this.hideSide = !this.hideSide
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.data.name}</span>
        </span>)
    },
    add(val) {
      this.$refs.pipeWellTree.append(val, this.selectNodee)
    },
    // 3D-2D转换
    transformation: function() {
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
    showTube: function() {
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
    showConduit: function() {
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
    showRegion: function() {
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
    showHeat: function() {
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
    // 项目点展示
    getCompanyStructure() {
      this.$http.post('/S-Base/getCompanyStructureByRole', Qs.stringify({ type: 2 })).then(res => {
        if (res.data.success) {
          const val = res.data.data
          for (let index = 0; index < val.length; index++) {
            const element = val[index]
            if (element.lon == null) {
            } else {
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
                20: 1
              }
              var marker = new AMap.ElasticMarker({
                position: [element.lon, element.lat],
                zooms: [8, 20],
                styles: [{
                  icon: {
                    img: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
                    size: [18, 20], // 可见区域的大小
                    ancher: [9, 10], // 锚点
                    scaleFactor: 2, // 地图放大一级的缩放比例系数
                    maxScale: 2, // 最大放大比例
                    minScale: 1// 最小放大比例
                  }
                }, {
                  icon: {
                    img: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
                    size: [140, 150],
                    ancher: [70, 75],
                    fitZoom: 20,
                    scaleFactor: 2,
                    maxScale: 0.455,
                    minScale: 0.225
                  }
                }],
                zoomStyleMapping: zoomStyleMapping2
              })
              var _that = this
              marker.on('click', () => {
                var MyComponent = Vue.extend({
                  methods: {
                    reShow: function() {
                      if (element.threeDUrl) {
                        window.open(element.threeDUrl)
                      }
                      // _that.transformation()
                    },
                    Technology: function() {
                      _that.$router.push({ name: 'configurationMonitor', params: { structureId: element.id }})
                    },
                    dataSelect: function() {
                      _that.$router.push({ name: 'saveHistoryManage', params: { structId: element.id }})
                    },
                    energy: function() {
                      _that.$router.push({ name: 'energyTotal' })
                      // _that.$http.post('/S-Base/getStructureParentIdById', Qs.stringify({ parentId: element.id })).then(res => {
                      //   if (res.data.success) {
                      //     const { parentID1, parentID2, parentID3 } = res.data.data
                      //     _that.$router.push({ name: 'heatEnergyDisplay', params: { structId: parentID1, parent: parentID2, grandId: parentID3 }})
                      //   }
                      // })
                    }
                  },
                  template: '<div className="custom-infowindow input-card">' +
                      '<label style="color:grey">' + element.name + '</label><br/>' +
                      // 为 infowindow 添加自定义事件
                      '<input type="button" class="btn" value="3D" v-on:click ="reShow"/>' +
                      '<input type="button" class="btn" value="工艺" v-on:click="Technology"/>' +
                      '<input type="button" class="btn" value="查询" v-on:click="dataSelect"/>' +
                      '<input type="button" class="btn" value="能耗" v-on:click="energy"/>' +
                  '</div>'
                })
                var component = new MyComponent().$mount()
                // 创建一个自定义内容的 infowindow 实例
                var infoWindow = new AMap.InfoWindow({
                  position: [element.lon, element.lat],
                  content: component.$el
                })

                infoWindow.open(_that.GaoDeMap.AMap)
              })
              this.GaoDeMap.AMap.add(marker)
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
          zIndex: 50
        })
        polyline.kfData = data.code
        polyline.heatSystemId = data.heatSystemId
        this.polylineArr.push(polyline)
        polyline.setMap(this.GaoDeMap.AMap)
        var polyEditor = new AMap.PolyEditor(this.GaoDeMap.AMap, polyline)
        polyEditor.kfData = data.code
        polyEditor.heatSystemId = data.heatSystemId
        this.polylineEditorArr.push(polyEditor)
        var infoWindow = new AMap.InfoWindow({
          anchor: 'top-left',
          content: data.name
        })
        var _this = this
        polyline.on('mouseover', function(e) {
          infoWindow.open(_this.GaoDeMap.AMap, [e.lnglat.lng, e.lnglat.lat])
        })
        polyline.on('mouseout', function(e) {
          infoWindow.close()
        })
        // 缩放地图到合适的视野级别
        // this.GaoDeMap.AMap.setFitView([ polyline ])
      } else if (data.type === 2) {
        // 管井显示（已废除）
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
          zIndex: 50
        })
        polygon.kfData = data.code
        this.polygonArr.push(polygon)
        this.GaoDeMap.AMap.add(polygon)
        var GpolyEditor = new AMap.PolyEditor(this.GaoDeMap.AMap, polygon)
        GpolyEditor.kfData = data.code
        this.polygonEditorArr.push(GpolyEditor)
        var polygonInfoWindow = new AMap.InfoWindow({
          anchor: 'top-left',
          content: data.name
        })
        var _that = this
        polygon.on('mouseover', function(e) {
          polygonInfoWindow.open(_that.GaoDeMap.AMap, [e.lnglat.lng, e.lnglat.lat])
        })
        polygon.on('mouseout', function(e) {
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
          content: obj.name
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
    getHeatingPositionLonLat(id) {
      this.$http.post('/S-Base/listHeatingPositionRealDataBystructureId', Qs.stringify({ structureId: id })).then(res => {
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
                  anchor: 'center'
                }),
                offset: new AMap.Pixel(-13, -30)
              })
              marker.setMap(this.GaoDeMap.AMap)
              this.HeatArr.push(marker)
              var msg_label = '<b>' + res.data.data[i].position + '</b><br/>' +
              "<b>面积：<span style='color:red'>" + res.data.data[i].area + '</sapn></b>' +
              "<div style='display:" + this.isDisplayST + "'><b>供水温度：<span style='color:red'>" + res.data.data[i].供水温度 + '</sapn></b></div>' +
              "<div style='display:" + this.isDisplayBT + "'><b>回水温度：<span style='color:red'>" + res.data.data[i].回水温度 + '</sapn></b></div>' +
              "<div style='display:" + this.isDisplaySP + "'><b>供水压力：<span style='color:red'>" + res.data.data[i].供水压力 + '</sapn></b></div>' +
              "<div style='display:" + this.isDisplayBP + "'><b>回水压力：<span style='color:red'>" + res.data.data[i].回水压力 + '</sapn></b></div>' +
              "<div style='display:" + this.isDisplayVO + "'><b>阀门开度：<span style='color:red'>" + res.data.data[i].阀门开度 + '</sapn></b></div>' +
              "<div style='display:" + this.isDisplayVF + "'><b>瞬时流量：<span style='color:red'>" + res.data.data[i].阀门瞬时流量 + '</sapn></b></div>'
              marker.setLabel({
                // offset: new AMap.Pixel(20, 20), // 设置文本标注偏移量
                // content: res.data.data[i].position + '<br/>' + res.data.data[i].供水压力, // 设置文本标注内容
                content: msg_label, // 设置文本标注内容
                direction: res.data.data[i].textLocation // 设置文本标注方位
              })
              marker.setTitle(res.data.data[i].position)// 鼠标滑过标签
            }
          }
        }
      })
    },
    initMap: function() { // 默认地图中心点
      this.GaoDeMap.AMap = new AMap.Map('allmap', {
        center: [114.2932980, 35.7445790],
        resizeEnable: true,
        expandZoomRange: true,
        zooms: [3, 20],
        // zoom: 14,
        pitch: 80,
        viewMode: this.isChange,
        rotateEnable: true,
        buildingAnimation: true, // 楼块出现是否带动画
        pitchEnable: true
      })
      GDMap = this.GaoDeMap.AMap
      this.GaoDeMap.AMap.addControl(new AMap.ControlBar({
        showZoomBar: false,
        showControlButton: true,
        position: {
          right: '10px',
          top: '10px'
        }
      }))
      this.pipelineDisplay()
      setTimeout(() => {
        this.getMapData()
      }, 100)
    },
    nodeSelect(obj, node, nodeArr) {
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
      if (obj.lonLat !== undefined) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    // 所有一次管网显示
    pipelineDisplay() {
      this.$http.post('/S-Base/getPipeWellByRoleStrId').then(res => {
        // this.$http.post('/S-Base/getPipeWellByStructureId', Qs.stringify({structureId: '7e69e14d835145fda3369c69071e8e4d'})).then(res => {
        if (res.data.success) {
          var data = res.data.data
          for (let index = 0; index < data.length; index++) {
            // var point = []
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
          this.getHeatingPositionLonLat(node.data.id)
          this.getByHeatSystem(node, resolve)
          this.getPieData(node.data.id)
          resolve([])
          // this.$http.post('/S-Base/getPipeWellByStructureId', Qs.stringify({structureId: node.data.id})).then(res => {
          //   this.getHeatingPositionLonLat(node.data.id)
          //   this.getByHeatSystem(node, resolve)
          //   if (res.data.success) {
          //     if (res.data.data.length === 0) {
          //       resolve([])
          //     } else {
          //       let arr = []
          //       for (let i = 0; i < res.data.data.length; i++) {
          //         let flag = false
          //         this.$set(res.data.data[i], 'leaf', flag)
          //         arr.push(res.data.data[i])
          //       }
          //       for (var i in arr) {
          //         this.displayBMap(arr[i])
          //       }
          //       resolve(arr)
          //     }
          //   }
          // })
        } else {
          // 其它   非根节点  非管道管井
          this.getTreeData(node.data.id, resolve)
        }
      }
    },
    getPieData(id) {
      this.$http.post('/S-Base/getPipeWellByStructureId', Qs.stringify({ structureId: id })).then(res => {
        if (res.data.success) {
          const arr = res.data.data
          arr.sort(function(a, b) {
            return b.type - a.type
          })
          for (var i in arr) {
            this.displayBMap(arr[i])
          }
        }
      })
    },
    getTreeData(id, resolve) {
      this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({ parentId: id }))
        .then(function(res) {
          if (res.data.success) {
            resolve(res.data.data)
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getMapData() {
      let val = []
      this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({ parentId: 0 }))
        .then(function(res) {
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
    }
  }
}
</script>

<style scoped>
.amap-marker-label{
      position: absolute;
      z-index: 2;
      border: 1px solid #fcf2f5f2;
      background-color: #ffffff61;
      white-space: nowrap;
      cursor: default;
      padding: 3px;
      font-size: 12px;
      line-height: 14px;
   }
.grid-content {
  height: 100%;
  position: relative;
}
.aside {
  position: absolute;
  top:0;
  left:0;
  width:220px;
  height: 100%;
  z-index: 200;
  transition:all .5s linear;
  background:#fff;
}
.aside.collopseW {
    width:0;
}

.aside .left-tree {
   width:calc(100% - 20px);
   padding:15px 10px;
   height: calc(100% - 30px);
}

.aside .btn-container {
  position: absolute;
  top:10px;
  left: 240px;
  background:#fff;
  box-shadow: 1px 5px 8px #000;
  padding:20px 30px;
}
.aside .btn-container .btn-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.aside .tree-node {
  background:none;
  color:#333;
  font-size:16px;
}
.aside .arrow {
    position: absolute;
    right:0;
    top:50%;
    width:22px;
    height:44px;
    transform: translate(-50%,-50%);
    z-index: 500;
    transform: rotate(0deg);
    transition:all .5s linear;
    cursor: pointer;
}
.aside.collopseW .left-tree {
     display: none;
}
.aside.collopseW .arrow {
    right:-22px;
   transform: rotate(-180deg);
}
.MainContainer .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
</style>
