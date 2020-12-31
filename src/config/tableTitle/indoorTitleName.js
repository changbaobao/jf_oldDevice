/**
 * 室内温度管理
 *
 */
/**
 * 室内温度（供暖位置管理）
 */
export const heatPosData = [{
  data: '项目名称',
  name: 'companyName',
  width: 140
}, {
  data: '小区',
  name: 'communityName',
  width: 120
}, {
  data: '锅炉房/换热站',
  name: 'boilerName',
  width: 120
}, {
  data: '系统',
  name: 'systemName'
}, {
  data: '楼号',
  name: 'buildingNum',
  width: 100
}, {
  data: '单元号',
  name: 'unitNum',
  width: 100
},
{
  data: '经度',
  name: 'lon',
  width: 100
},
{
  data: '纬度',
  name: 'lat',
  width: 100
},
{
  data: '位置',
  name: 'position',
  width: 120
}, {
  data: '描述',
  name: 'remark'
},
{
  data: '操作',
  width: 180,
  butname: [{ name: '编辑', btnType: 'primary' }, { name: '删除', btnType: 'danger' }]
}
]

// 住户管理
export const houseTableData = [{
  data: '项目名称',
  name: 'companyName',
  width: 100
}, {
  data: '小区名称',
  name: 'communityName',
  width: 120
}, {
  data: '锅炉房',
  name: 'boilerName',
  width: 120
},
{
  data: '设备',
  name: 'kfDevId',
  width: 140
},
{
  data: '楼号',
  name: 'buildingNum',
  width: 100
}, {
  data: '单元号',
  name: 'nuitNum',
  width: 100
}, {
  data: '室',
  name: 'room',
  width: 100
}, {
  data: '供暖位置',
  name: 'positionName'
},
  // {
  //   data: '时间',
  //   bindingTime: 'bindingTime',
  //   width: 120
  // },
  // {
  //   data: '解除绑定',
  //   width: 180,
  //   bindname: [{name: '解除', btnType: 'primary'}, {name: '绑定', btnType: 'danger'}]
  // },
{
  data: '操作',
  width: 180,
  butname: [{ name: '编辑', btnType: 'primary' }, { name: '删除', btnType: 'danger' }]
}
]

// 室温设备管理
export const devTemData = [{
  data: '设备编号',
  name: 'devNum',
  width: 160
},
{
  data: 'CCID 号',
  name: 'cCIDNum',
  width: 200
}, {
  data: 'IMEI号',
  name: 'iMEINum',
  width: 150
}, {
  data: '信号强度',
  name: 'signal',
  width: 150
},
{
  data: '温度',
  name: 'tem',
  width: 150
},
{
  data: '湿度',
  name: 'hum',
  width: 150
},
{
  data: '电量',
  name: 'power',
  width: 150
},
{
  data: '最后在线时间',
  name: 'date',
  width: 180
}, {
  data: '是否发放',
  format: 'houseId'
},
{
  data: '操作',
  width: 180,
  butname: [{ name: '编辑', btnType: 'primary' }, { name: '删除', btnType: 'danger' }]
}
]
