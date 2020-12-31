
/**
 *  巡检管理
 */
// 巡检任务(巡检表格)

export const checkData = [
  {
    data: '巡检项目',
    name: 'name',
    width: 140
  }, {
    data: '起始时间',
    name: 'startTime'
  }, {
    data: '任务时长（小时）',
    name: 'taskDuration'
  }, {
    data: '任务步长',
    name: 'periodicStepLength'
  }, {
    data: '周期任务',
    name: 'periodicTasks'
  },
  {
    data: '操作',
    width: 120,
    butname: [{name: '启动', btnType: 'text' }, {name: '', btnType: 'text', icon: 'el-icon-edit'}, {name: '', btnType: 'text', icon: 'el-icon-delete'}]
  }
]

// 巡检任务(项目表格)

export const ProjectData = [
  {
    data: '项目名称',
    name: 'structName',
    width: 140
  },
  {
    data: '操作',
    butname: [{name: '启动一次', btnType: 'text' }, {name: '', btnType: 'text', icon: 'el-icon-delete'}]
  }
]

/**
 * 巡检状态
 */
export const statusData = [
  {
    data: '日期',
    name: 'name',
    width: 140
  }, {
    data: '项目名称',
    name: 'structName'
  }, {
    data: '巡检项目',
    name: 'templateName'
  }, {
    data: '数据点列表',
    width: '140',
    pointList: [{name: 'demo'}, {name: '测试'}]
  }, {
    data: '起始时间',
    name: 'name'
  },
  {
    data: '任务时长（小时）',
    width: 140,
    name: 'taskDuration'
  },
  {
    data: '任务结论',
    name: 'conclusion'
  },
  {
    data: '巡检状态',
    name: 'patrolStatus'
  },
  {
    data: '巡检备注',
    name: 'remarks'
  },
  {
    data: '完成时间',
    name: 'effectEndTime'
  },
  {
    data: '执行人',
    name: 'executor'
  },
  {
    data: '巡检照片',
    width: 100,
    butname: [{name: '查看', btnType: 'text'}]
  },
  {
    data: '操作',
    width: 120,
    butname: [{name: '', btnType: 'text', icon: 'el-icon-delete'}]
  }
]
