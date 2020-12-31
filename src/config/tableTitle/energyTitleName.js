import utils from "@/utils/heatTime";

/**
 * 能耗管理
 */
// 能耗排行
export const energyRankTitle = [{
        data: "单位",
        name: "boilerName",
        width: 120
    },
    // {
    //   data: '区县',
    //   name: 'areaCounty',
    //   width: 120,
    //   formatter: (row) => { // 写上formatter函数
    //     if (row.areaCounty && row.areaCounty !== '') {
    //       const str = row.areaCounty
    //       var index = str.lastIndexOf('\/')
    //       return str.substring(index + 1, str.length)
    //     } else {
    //       return ''
    //     }
    //   }
    // },
    {
        data: "面积",
        name: "totalArea",
        width: 120,
        formatter: row => {
            return utils.isDot(row.totalArea, 2);
        }
    },
    {
        data: "累计能耗(GJ)",
        name: "totalDaily",
        formatter: row => {
            return utils.isDot(row.totalDaily, 2);
        }
    },
    {
        data: "累计单方(GJ/㎡)",
        name: "totalDanFang",
        formatter: row => {
            return utils.isDot(row.totalDanFang, 4);
        }
    }
    //  {
    //     data: '标准度日数的单位面积耗气量',
    //     name: 'danFangGasNum',
    //     formatter: (row) => {
    //         if (row.totalDanFang != null && row.totalDanFang != 0 && row.totalDuRiShu != null && row.totalDuRiShu != 0) {
    //             return utils.isDot(row.totalDanFang / row.totalDuRiShu * 1000, 4)
    //         } else {
    //             return 0
    //         }
    //     }
    // }
    // {
    //     data: '热源燃料利用效率',
    //     name: 'danFangGasNum'
    // },{
    //     data: '单位供热量燃气消耗量',
    //     name: 'danFangGasNum'
    // }
];

// 达标率汇总表
export const daBiaoLvData = [{
        data: "项目名称",
        name: "boilerRoomName",
        width: 140
    },
    {
        data: "气",
        name: "",
        children: [{
                data: "日消耗量",
                name: "todayGasDaily",
                width: 120,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.todayGasDaily, 2);
                },
                sortable: true
            },
            {
                data: "日目标值",
                name: "gasjiYouMBZongLiangToday",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.gasjiYouMBZongLiangToday, 2);
                }
            },
            {
                data: "日达标率",
                name: "gasdaBiaoLvToday",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.gasdaBiaoLvToday, 2);
                }
            },
            {
                data: "周耗量",
                name: "gasDailyWeek",
                width: 120,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.gasDailyWeek, 2);
                },
                sortable: true
            },
            {
                data: "周目标值",
                name: "gasjiYouMBZongLiangWeek",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.gasjiYouMBZongLiangWeek, 2);
                }
            },
            {
                data: "周达标率",
                name: "gasdaBiaoLvWeek",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.gasdaBiaoLvWeek, 2);
                }
            },
            {
                data: "累计耗量",
                name: "gasDailyTotal",
                width: 120,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.gasDailyTotal, 2);
                },
                sortable: true
            },
            {
                data: "累计目标值",
                name: "gasjiYouMBZongLiangTotal",
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.gasjiYouMBZongLiangTotal, 2);
                },
                width: 120,
                sortable: true
            },
            {
                data: "累计达标率",
                name: "gasdaBiaoLvTotal",
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.gasdaBiaoLvTotal, 2);
                },
                width: 120,
                sortable: true
            }
        ]
    },
    {
        data: "水",
        name: "",
        children: [{
                data: "日消耗量",
                name: "todayWaterDaily",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.todayWaterDaily, 2);
                }
            },
            {
                data: "日目标值",
                name: "waterjiYouMBZongLiangToday",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.waterjiYouMBZongLiangToday, 2);
                }
            },
            {
                data: "日达标率",
                name: "waterdaBiaoLvToday",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.waterdaBiaoLvToday, 2);
                }
            },
            {
                data: "周耗量",
                name: "waterDailyWeek",
                width: 120,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.waterDailyWeek, 2);
                },
                sortable: true
            },
            {
                data: "周目标值",
                name: "waterjiYouMBZongLiangWeek",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.waterjiYouMBZongLiangWeek, 2);
                }
            },
            {
                data: "周达标率",
                name: "waterdaBiaoLvWeek",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.waterdaBiaoLvWeek, 2);
                }
            },
            {
                data: "累计耗量",
                name: "waterDailyTotal",
                width: 120,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.waterDailyTotal, 2);
                },
                sortable: true
            },
            {
                data: "累计目标值",
                name: "waterjiYouMBZongLiangTotal",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.waterjiYouMBZongLiangTotal, 2);
                }
            },
            {
                data: "累计达标率",
                name: "waterdaBiaoLvTotal",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.waterdaBiaoLvTotal, 2);
                }
            }
        ]
    },
    {
        data: "电",
        name: "",
        children: [{
                data: "日消耗量",
                name: "todayPowerDaily",
                width: 120,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.todayPowerDaily, 2);
                },
                sortable: true
            },
            {
                data: "日目标值",
                name: "powerjiYouMBZongLiangToday",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.powerjiYouMBZongLiangToday, 2);
                }
            },
            {
                data: "日达标率",
                name: "powerdaBiaoLvToday",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.powerdaBiaoLvToday, 2);
                }
            },
            {
                data: "周耗量",
                name: "powerDailyWeek",
                width: 120,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.powerDailyWeek, 2);
                },
                sortable: true
            },
            {
                data: "周目标值",
                name: "powerjiYouMBZongLiangWeek",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.powerjiYouMBZongLiangWeek, 2);
                }
            },
            {
                data: "周达标率",
                name: "powerdaBiaoLvWeek",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.powerdaBiaoLvWeek, 2);
                }
            },
            {
                data: "累计耗量",
                name: "powerDailyTotal",
                width: 120,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.powerDailyTotal, 2);
                },
                sortable: true
            },
            {
                data: "累计目标值",
                name: "powerjiYouMBZongLiangTotal",
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.powerjiYouMBZongLiangTotal, 2);
                },
                width: 120,
                sortable: true
            },
            {
                data: "累计达标率",
                name: "powerdaBiaoLvTotal",
                width: 120,
                sortable: true,
                formatter: row => {
                    // 写上formatter函数
                    return utils.isDot(row.powerdaBiaoLvTotal, 2);
                }
            }
        ]
    }
];

// 能耗排行

export const energyRankName = [{
        name: "气",
        unit: "单位面积燃气消耗量（Nm3/m2）",
        advancedValue: 5.8,
        limitValue: 7.5,
        accessValue: 9.0
    },
    {
        name: "水",
        unit: "单位面积水消耗量（L/m2）",
        advancedValue: 6,
        limitValue: 15,
        accessValue: 23
    },
    {
        name: "电",
        unit: "单位面积电能消耗量（kWh/m2）",
        advancedValue: 1.3,
        limitValue: 2.0,
        accessValue: 2.9
    },
    {
        name: "热",
        unit: "单位面积热量消耗量（GJ/m2）",
        advancedValue: 0.21,
        limitValue: 0.25,
        accessValue: 0.28
    }
];

// 站点能耗日报energyDailyData
// energyDailyData
export const energyDailyData = [{
        data: "日期",
        name: "date"
    },
    {
        data: "基表日耗",
        name: "dailyGasBase",
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyGasBase, 2);
        }
    },
    {
        data: "卡表日耗",
        name: "dailyGasCard",
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyGasCard, 2);
        }
    },
    {
        data: "基卡差值",
        name: "dailyGasBaseCard",
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyGasBaseCard, 2);
        }
    },
    {
        data: "卡基比值",
        name: "dailyBiBaseCard",
        formatter: row => {
            // 写上formatter函数
            if (
                row.dailyGasBase &&
                row.dailyGasCard &&
                row.dailyGasBase != 0 &&
                row.dailyGasCard != 0
            ) {
                const biValue = row.dailyGasCard / row.dailyGasBase;
                return utils.isDot(biValue, 2);
            } else {
                return 0;
            }
        }
    },
    {
        data: "水表日耗(不含热水)",
        name: "dailyWaterNoHot",
        width: 150,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyWaterNoHot, 2);
        }
    },
    {
        data: "电表日耗",
        name: "dailyPower",
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyPower, 2);
        }
    },
    {
        data: "热表日耗",
        name: "dailyHeat",
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyHeat, 2);
        }
    },
    {
        data: "水表日耗(含热水)",
        name: "dailyWater",
        width: 140,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyWater, 2);
        }
    },
    {
        data: "操作",
        butname: [{ name: "计算", btnType: "primary" }]
    }
];

// 能耗一览表
export const energyConsumptionTitle = [{
        data: "机构",
        name: "name",
        width: 160
    },
    {
        data: "锅炉房站点",
        name: "BoilerStation",
        width: 120
    },
    {
        data: "区县",
        name: "areaCounty",
        formatter: row => {
            // 写上formatter函数
            if (row.areaCounty && row.areaCounty !== "") {
                const str = row.areaCounty;
                var index = str.lastIndexOf("/");
                return str.substring(index + 1, str.length);
            } else {
                return "";
            }
        }
    },
    {
        data: "面积(m³)",
        name: "heatingArea",
        width: 140
    },
    {
        data: "燃料类型",
        name: "fuelType",
        width: 100
    },
    {
        data: "属性",
        name: "attribute",
        width: 120
    },
    {
        data: "台数",
        name: "heatNum"
    },
    {
        data: "蒸吨",
        name: "heatDimensions"
    },
    {
        data: "气（耗气量m³）",
        name: "daily.gasDailyTotal",
        width: 140,
        formatter: row => {
            // 写上formatter函数
            if (row.daily.gasDailyTotal == null || !row.daily.gasDailyTotal) {
                return 0;
            }
            return utils.isDot(row.daily.gasDailyTotal, 2);
        }
    },
    {
        data: "水（耗气量t）",
        name: "daily.waterDailyTotal",
        width: 140,
        formatter: row => {
            // 写上formatter函数
            if (row.daily.waterDailyTotal == null || !row.daily.waterDailyTotal) {
                return 0;
            }
            return utils.isDot(row.daily.waterDailyTotal, 2);
        }
    },
    {
        data: "电（耗气量kw.h）",
        name: "daily.powerDailyTotal",
        width: 140,
        formatter: row => {
            // 写上formatter函数
            if (row.daily.powerDailyTotal == null || !row.daily.powerDailyTotal) {
                return 0;
            }
            return utils.isDot(row.daily.powerDailyTotal, 2);
        }
    },
    {
        data: "热（耗热量）",
        name: "daily.heatDailyTotal",
        width: 140,
        formatter: row => {
            // 写上formatter函数
            if (row.daily.heatDailyTotal == null || !row.daily.heatDailyTotal) {
                return 0;
            }
            return utils.isDot(row.daily.heatDailyTotal, 2);
        }
    },

    {
        data: "供暖系统综合能耗",
        name: "zonEnergy",
        width: 150
    },
    {
        data: "供暖系统单位面积综合能耗",
        name: "areaEnergy",
        width: 200,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.areaEnergy, 2);
        }
    },
    {
        data: "供暖系统单位热量综合能耗",
        name: "heatZonEnergy",
        width: 200,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.heatZonEnergy, 2);
        }
    }
    // {
    //     data: '一次管网热损失率',
    //     name: 'heatEnergy',
    //     check: false,
    //     width: 200
    // }
];

// 能耗分析报表
export const energyReportTitle = [{
        data: "日期",
        name: "input.date",
        fixed: true,
        width: 120
    },
    {
        data: "平均温度",
        name: "input.outDoorAvgWDu",
        fixed: true,
        formatter: row => {
            // 写上formatter函数
            if (row.input.outDoorAvgWDu == null) {
                return "";
            } else {
                return utils.isDot(row.input.outDoorAvgWDu, 4);
            }
        }
    },
    {
        data: "面积(m2)",
        name: "",
        children: [{
                data: "正常总面积",
                name: "gas.zongMianJi",
                width: 120
            },
            {
                data: "既有",
                name: "input.jiYouArea",
                width: 120
            },
            {
                data: "新增正常",
                name: "input.xinZengArea",
                width: 120
            },
            {
                data: "低温",
                name: "input.diWenArea",
                width: 120
            }
        ]
    },
    {
        data: "燃气",
        name: "",
        children: [{
                data: "是否节能",
                name: "",
                children: [{
                    data: "节能/不节能",
                    name: "jienng",
                    formatter: row => {
                        if (row.gas == null) {
                            return "";
                        } else {
                            if (row.gas.daBiaoLv < 100) {
                                return "节能";
                            } else {
                                return "不节能";
                            }
                        }
                    }
                }]
            },
            {
                data: "达标率",
                name: "gas.daBiaoLv"
            },
            {
                data: "目标总量(m3)",
                name: "",
                children: [{
                        data: "正常总量",
                        name: "zongMianJi",
                        formatter: row => {
                            if (row.gas === null) {
                                return "";
                            } else {
                                const MZ =
                                    row.gas.jiYouMBZongLiang + row.gas.xinZengMBZongLiang;
                                return utils.isDot(MZ, 2);
                            }
                        }
                    },
                    {
                        data: "既有",
                        name: "gas.jiYouMBZongLiang"
                    },
                    {
                        data: "新增正常",
                        name: "gas.xinZengMBZongLiang",
                        formatter: row => {
                            if (row.gas === null) {
                                return "";
                            } else {
                                return utils.isDot(row.gas.xinZengMBZongLiang, 2);
                            }
                        }
                    },
                    {
                        data: "低温",
                        name: "gas.diWenMBZongLiang",
                        formatter: row => {
                            if (row.gas === null) {
                                return "";
                            } else {
                                return utils.isDot(row.gas.diWenMBZongLiang, 2);
                            }
                        }
                    }
                ]
            },
            {
                data: "完成总量(m3)",
                name: "",
                children: [{
                        data: "正常总量",
                        name: "gas.zongMianJi",
                        formatter: row => {
                            if (row.gas === null) {
                                return "";
                            } else {
                                const WZ =
                                    row.gas.jiYouWChZongLiang + row.gas.xinZengWChZongLiang;
                                return utils.isDot(WZ, 2);
                            }
                        }
                    },
                    {
                        data: "既有",
                        name: "gas.jiYouWChZongLiang"
                    },
                    {
                        data: "新增正常",
                        name: "gas.xinZengWChZongLiang",
                        formatter: row => {
                            if (row.gas === null) {
                                return "";
                            } else {
                                return utils.isDot(row.gas.xinZengWChZongLiang, 2);
                            }
                        }
                    },
                    {
                        data: "低温",
                        name: "gas.diWenWChZongLiang",
                        formatter: row => {
                            if (row.gas === null) {
                                return "";
                            } else {
                                return utils.isDot(row.gas.diWenWChZongLiang, 2);
                            }
                        }
                    }
                ]
            },
            {
                data: "目标单方（m3/m2）",
                name: "",
                children: [{
                        data: "既有",
                        name: "gas.jiYouMBDanFang"
                    },
                    {
                        data: "新增正常",
                        name: "gas.xinZengMBDanFang",
                        width: 120
                    },
                    {
                        data: "低温",
                        name: "gas.diWenMBDanFang"
                    }
                ]
            },
            {
                data: "完成单方（m3/m2）",
                name: "",
                children: [{
                        data: "既有",
                        name: "gas.jiYouWChDanFang"
                    },
                    {
                        data: "新增正常",
                        name: "gas.xinZengWChDanFang",
                        width: 120
                    },
                    {
                        data: "低温",
                        name: "gas.diWenWChDanFang"
                    }
                ]
            }
        ]
    },
    {
        data: "水",
        name: "",
        children: [{
                data: "是否节能",
                name: "",
                children: [{
                    data: "节能/不节能",
                    name: "jienng",
                    formatter: row => {
                        if (row.water == null) {
                            return "";
                        } else {
                            if (row.water.daBiaoLv < 100) {
                                return "节能";
                            } else {
                                return "不节能";
                            }
                        }
                    }
                }]
            },
            {
                data: "达标率(%)",
                name: "water.daBiaoLv"
            },
            {
                data: "目标总量(t)",
                name: "",
                children: [{
                        data: "正常总量",
                        name: "zongMianJi",
                        formatter: row => {
                            if (row.water === null) {
                                return "";
                            } else {
                                const MZ =
                                    row.water.jiYouMBZongLiang + row.water.xinZengMBZongLiang;
                                return utils.isDot(MZ, 2);
                            }
                        }
                    },
                    {
                        data: "既有",
                        name: "water.jiYouMBZongLiang"
                    },
                    {
                        data: "新增正常",
                        name: "water.xinZengMBZongLiang",
                        formatter: row => {
                            if (
                                row.water === null ||
                                row.water.xinZengMBZongLiang == undefined
                            ) {
                                return "";
                            } else {
                                return utils.isDot(row.water.xinZengMBZongLiang, 2);
                            }
                        }
                    },
                    {
                        data: "低温",
                        name: "water.diWenMBZongLiang",
                        formatter: row => {
                            if (
                                row.water === null ||
                                row.water.diWenMBZongLiang == undefined
                            ) {
                                return "";
                            } else {
                                return utils.isDot(row.water.diWenMBZongLiang, 2);
                            }
                        }
                    }
                ]
            },
            {
                data: "完成总量(t)",
                name: "",
                children: [{
                        data: "正常总量",
                        name: "water.zongMianJi",
                        formatter: row => {
                            if (row.water === null) {
                                return "";
                            } else {
                                const WZ =
                                    row.water.jiYouWChZongLiang + row.water.xinZengWChZongLiang;
                                return utils.isDot(WZ, 2);
                            }
                        }
                    },
                    {
                        data: "既有",
                        name: "water.jiYouWChZongLiang"
                    },
                    {
                        data: "新增正常",
                        name: "water.xinZengWChZongLiang",
                        formatter: row => {
                            if (row.water === null) {
                                return "";
                            } else {
                                const val = row.water.xinZengWChZongLiang;
                                return utils.isDot(val, 2);
                            }
                        }
                    },
                    {
                        data: "低温",
                        name: "water.diWenWChZongLiang",
                        formatter: row => {
                            if (row.water === null) {
                                return "";
                            } else {
                                const val = row.water.diWenWChZongLiang;
                                return utils.isDot(val, 2);
                            }
                        }
                    }
                ]
            },
            {
                data: "目标单方（L/m2）",
                name: "",
                children: [{
                        data: "既有",
                        name: "water.jiYouMBDanFang"
                    },
                    {
                        data: "新增正常",
                        name: "water.xinZengMBDanFang",
                        width: 120
                    },
                    {
                        data: "低温",
                        name: "water.diWenMBDanFang"
                    }
                ]
            },
            {
                data: "完成单方（L/m2）",
                name: "",
                children: [{
                        data: "既有",
                        name: "water.jiYouWChDanFang"
                    },
                    {
                        data: "新增正常",
                        name: "water.xinZengWChDanFang",
                        width: 120
                    },
                    {
                        data: "低温",
                        name: "water.diWenWChDanFang"
                    }
                ]
            }
        ]
    },
    {
        data: "电",
        name: "",
        children: [{
                data: "是否节能",
                name: "",
                children: [{
                    data: "节能/不节能",
                    name: "jienng",
                    formatter: row => {
                        if (row.power == null) {
                            return "";
                        } else {
                            if (row.power.daBiaoLv < 100) {
                                return "节能";
                            } else {
                                return "不节能";
                            }
                        }
                    }
                }]
            },
            {
                data: "达标率(%)",
                name: "power.daBiaoLv"
            },
            {
                data: "目标总量(kwh)",
                name: "",
                children: [{
                        data: "正常总量",
                        name: "zongMianJi",
                        formatter: row => {
                            if (row.power === null) {
                                return "";
                            } else {
                                const MZ =
                                    row.power.jiYouMBZongLiang + row.power.xinZengMBZongLiang;
                                return utils.isDot(MZ, 2);
                            }
                        }
                    },
                    {
                        data: "既有",
                        name: "power.jiYouMBZongLiang"
                    },
                    {
                        data: "新增正常",
                        name: "power.xinZengMBZongLiang",
                        formatter: row => {
                            if (row.power === null) {
                                return "";
                            } else {
                                const val = row.power.xinZengMBZongLiang;
                                return utils.isDot(val, 2);
                            }
                        }
                    },
                    {
                        data: "低温",
                        name: "power.diWenMBZongLiang",
                        formatter: row => {
                            if (row.power === null) {
                                return "";
                            } else {
                                const val = row.power.diWenMBZongLiang;
                                return utils.isDot(val, 2);
                            }
                        }
                    }
                ]
            },
            {
                data: "完成总量(kwh)",
                name: "",
                children: [{
                        data: "正常总量",
                        name: "power.zongMianJi",
                        formatter: row => {
                            if (row.power === null) {
                                return "";
                            } else {
                                const WZ =
                                    row.power.jiYouWChZongLiang + row.power.xinZengWChZongLiang;
                                return utils.isDot(WZ, 2);
                            }
                        }
                    },
                    {
                        data: "既有",
                        name: "power.jiYouWChZongLiang"
                    },
                    {
                        data: "新增正常",
                        name: "power.xinZengWChZongLiang",
                        formatter: row => {
                            if (row.power === null || row.power.xinZengWChZongLiang) {
                                return "";
                            } else {
                                const val = row.power.xinZengWChZongLiang;
                                return utils.isDot(val, 2);
                            }
                        }
                    },
                    {
                        data: "低温",
                        name: "power.diWenWChZongLiang",
                        formatter: row => {
                            if (
                                row.power === null ||
                                row.power.diWenWChZongLiang == undefined
                            ) {
                                return "";
                            } else {
                                return utils.isDot(row.power.diWenWChZongLiang, 2);
                            }
                        }
                    }
                ]
            },
            {
                data: "目标单方（kwh/m2）",
                name: "",
                children: [{
                        data: "既有",
                        name: "power.jiYouMBDanFang"
                    },
                    {
                        data: "新增正常",
                        name: "power.xinZengMBDanFang",
                        width: 120
                    },
                    {
                        data: "低温",
                        name: "power.diWenMBDanFang"
                    }
                ]
            },
            {
                data: "完成单方（kwh/m2）",
                name: "",
                children: [{
                        data: "既有",
                        name: "power.jiYouWChDanFang"
                    },
                    {
                        data: "新增正常",
                        name: "power.xinZengWChDanFang",
                        width: 120
                    },
                    {
                        data: "低温",
                        name: "power.diWenWChDanFang"
                    }
                ]
            }
        ]
    }
];

// 能耗日报管理
// 水表

export const waterData = [{
        data: "数据日期",
        name: "saveDate",
        formatter: (value, column) => {
            // 写上formatter函数
            const payStatus = utils.parseTime(value.saveDate, "{y}-{m}-{d}");
            return payStatus;
        },
        width: 120
    },
    {
        data: "设备编号",
        name: "meter.deviceCoding",
        width: 150
    },
    {
        data: "表名称",
        name: "meter.meterName",
        width: 180,
        filtersData: [],
        filterHandler: (value, row) => {
            return row.meter.meterName === value;
        }
    },
    {
        data: "表号",
        name: "meter.meterNum",
        width: 180
    },
    {
        data: "类型",
        name: "meter.type",
        width: 150
    },
    {
        data: "换算",
        name: "meter.conversion",
        width: 150
    },
    {
        data: "累计水量",
        name: "totalWater",
        width: 150
    },
    {
        data: "换算累计水量",
        name: "totalWaterCal",
        width: 150
    },
    {
        data: "日耗",
        name: "dailyWaterCal"
    },
    {
        data: "单价",
        name: "waterPrice"
    },
    {
        data: "金额",
        name: "dailyWaterMoneyCal"
    },
    {
        data: "换表标志",
        name: "replaceTag",
        formatter: row => {
            // 写上formatter函数
            if (row.replaceTag === 0) {
                return "";
            } else {
                return "换表";
            }
        },
        width: 150
    },
    {
        data: "录入次数",
        name: "saveNum"
    },
    {
        data: "录入日期",
        name: "saveDateTime",
        formatter: (value, column) => {
            // 写上formatter函数
            const payStatus = utils.parseTime(
                value.saveDateTime,
                "{y}-{m}-{d} {h}:{i}"
            );
            return payStatus;
        },
        width: 150
    }
];
// 电
export const ElectricData = [{
        data: "数据日期",
        name: "saveDate",
        formatter: (value, column) => {
            // 写上formatter函数
            const payStatus = utils.parseTime(value.saveDate, "{y}-{m}-{d}");
            return payStatus;
        },
        width: 120
    },
    {
        data: "设备编号",
        name: "meter.deviceCoding",
        width: 150
    },
    {
        data: "表名称",
        name: "meter.meterName",
        width: 150,
        filtersData: [],
        filterHandler: (value, row) => {
            return row.meter.meterName === value;
        }
    },
    {
        data: "表号",
        name: "meter.meterNum",
        width: 150
    },
    {
        data: "类型",
        name: "meter.type",
        width: 100
    },
    {
        data: "换算",
        name: "meter.conversion",
        width: 100
    },
    {
        data: "累计电量",
        name: "totalPower",
        width: 100
    },
    {
        data: "换算累计电量",
        name: "totalPowerCal",
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(parseFloat(row.totalPowerCal), 2);
        },
        width: 150
    },
    {
        data: "日耗",
        name: "dailyPowerCal",
        formatter: row => {
            // 写上formatter函数
            return parseFloat(row.dailyPowerCal).toFixed(2);
        },
        width: 100
    },
    {
        data: "单价",
        name: "powerPrice",
        formatter: row => {
            // 写上formatter函数
            return parseFloat(row.powerPrice).toFixed(2);
        },
        width: 100
    },
    {
        data: "金额",
        name: "dailyPowerMoneyCal",
        formatter: row => {
            // 写上formatter函数
            return parseFloat(row.dailyPowerMoneyCal).toFixed(2);
        },
        width: 100
    },
    {
        data: "换表标志",
        name: "replaceTag",
        formatter: row => {
            // 写上formatter函数
            if (row.replaceTag === 0) {
                return "";
            } else {
                return "换表";
            }
        },
        width: 100
    },
    {
        data: "录入次数",
        name: "saveNum"
    },
    {
        data: "录入日期",
        name: "saveDateTime",
        formatter: (value, column) => {
            // 写上formatter函数
            const payStatus = utils.parseTime(
                value.saveDateTime,
                "{y}-{m}-{d} {h}:{i}"
            );
            return payStatus;
        },
        width: 150
    }
];
// 气
export const GasData = [{
        data: "数据日期",
        name: "saveDate",
        formatter: (value, column) => {
            // 写上formatter函数
            const payStatus = utils.parseTime(value.saveDate, "{y}-{m}-{d}");
            return payStatus;
        },
        width: 100
    },
    {
        data: "设备编号",
        name: "meter.deviceCoding",
        width: 150
    },
    {
        data: "表名称",
        name: "meter.meterName",
        width: 100,
        filtersData: [],
        filterHandler: (value, row) => {
            return row.meter.meterName === value;
        }
    },
    {
        data: "类型",
        name: "meter.type",
        width: 80
    },
    {
        data: "卡表累计换算",
        name: "cardAccumulatedCal",
        width: 140,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.cardAccumulatedCal, 2);
        }
    },
    {
        data: "卡表日耗",
        name: "dailyCardCal",
        width: 100,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyCardCal, 2);
        }
    },
    {
        data: "卡基比值",
        name: "baseCardValueCompare",
        width: 100,
        formatter: row => {
            // 写上formatter函数
            if (row.dailyBaseCal != 0 && row.dailyCardCal != 0) {
                const val = row.dailyCardCal / row.dailyBaseCal;
                return utils.isDot(val, 2);
            } else {
                return 0;
            }
        }
    },
    {
        data: "换算",
        name: "meter.conversion",
        width: 80
    },
    {
        data: "卡表累计",
        name: "cardAccumulated",
        width: 120,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.cardAccumulated, 4);
        }
    },
    //           {
    //   data: '基卡差值',
    //   name: 'baseCardValueCal',
    //   width: 100,
    //   formatter: (row) => { // 写上formatter函数
    //     return utils.isDot(row.baseCardValueCal, 2)
    //   }
    // },
    {
        data: "累计基表",
        name: "totalBase",
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.totalBase, 4);
        },
        width: 120
    },
    {
        data: "換算累计基表",
        name: "totalBaseCal",
        width: 120,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.totalBaseCal, 2);
        }
    },
    {
        data: "基表日耗",
        name: "dailyBaseCal",
        width: 100,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyBaseCal, 2);
        }
    },
    {
        data: "卡表余数",
        name: "totalCard",
        width: 100,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.totalCard, 4);
        }
    },
    {
        data: "单价",
        name: "gasPrice",
        width: 100,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.gasPrice, 3);
        }
    },
    {
        data: "金额",
        name: "dailyCardMoneyCal",
        width: 100,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.dailyCardMoneyCal, 2);
        }
    },
    {
        data: "余额",
        name: "balance",
        width: 100,
        formatter: row => {
            // 写上formatter函数
            return utils.isDot(row.balance, 2);
        }
    },
    {
        data: "換算充气量",
        name: "rechargeGasCal",
        width: 120
    },
    {
        data: "换表标志",
        name: "replaceTag",
        formatter: row => {
            // 写上formatter函数
            if (row.replaceTag === 0) {
                return "";
            } else {
                return "换表";
            }
        }
    },
    {
        data: "录入次数",
        name: "saveNum"
    },
    {
        data: "最后录入日期",
        name: "saveDateTime",
        formatter: (value, column) => {
            // 写上formatter函数
            const payStatus = utils.parseTime(
                value.saveDateTime,
                "{y}-{m}-{d} {h}:{i}"
            );
            return payStatus;
        },
        width: 150
    }
];
/** 热表 */
export const HotData = [{
        data: "数据日期",
        name: "saveDate",
        formatter: (value, column) => {
            // 写上formatter函数
            const payStatus = utils.parseTime(value.saveDate, "{y}-{m}-{d}");
            return payStatus;
        },
        width: 120
    },
    {
        data: "设备编号",
        name: "deviceCoding",
        width: 150
    },
    {
        data: "表名称",
        name: "meter.meterName",
        width: 150,
        filtersData: [],
        filterHandler: (value, row) => {
            return row.meter.meterName === value;
        }
    },
    {
        data: "表号",
        name: "meter.meterNum",
        width: 150
    },
    {
        data: "类型",
        name: "meter.type",
        width: 100
    },
    {
        data: "换算",
        name: "meter.conversion",
        width: 100
    },
    {
        data: "累计热量",
        name: "totalHeat",
        width: 100
    },
    {
        data: "换算累计热量",
        name: "totalHeatCal",
        width: 150
    },
    {
        data: "累计流量",
        name: "totalFlow",
        width: 100
    },
    {
        data: "热量日耗",
        name: "dailyHeatCal",
        width: 100
    },
    {
        data: "单价",
        name: "heatPrice",
        width: 100
    },
    {
        data: "金额",
        name: "dailyHeatMoneyCal",
        width: 100
    },
    {
        data: "换表标志",
        name: "replaceTag",
        formatter: row => {
            // 写上formatter函数
            if (row.replaceTag === 0) {
                return "";
            } else {
                return "换表";
            }
        },
        width: 100
    },
    {
        data: "录入次数",
        name: "saveNum"
    },
    {
        data: "录入日期",
        name: "saveDateTime",
        formatter: (value, column) => {
            // 写上formatter函数
            const payStatus = utils.parseTime(
                value.saveDateTime,
                "{y}-{m}-{d} {h}:{i}"
            );
            return payStatus;
        },
        width: 150
    }
];

// 能耗表管理 energyMeterManage
export const energyMeterData = [{
        data: "表名称",
        name: "meterName",
        width: 220
    },
    {
        data: "表号",
        name: "meterNum",
        width: 180
    },
    {
        data: "设备编号",
        name: "meter.deviceCoding",
        width: 160
    },
    {
        data: "类型",
        name: "type",
        width: 100
    },
    {
        data: "用途",
        name: "used",
        width: 100
    },
    {
        data: "换算",
        name: "conversion",
        width: 120
    },
    {
        data: "原始单位",
        name: "originalUnit",
        width: 100
    },
    {
        data: "热源计量关系",
        name: "heatRelationship",
        width: 120,
        formatter: row => {
            if (row.heatRelationship == 1) {
                return "加";
            } else if (row.heatRelationship == 0) {
                return "不计算";
            } else {
                return "减";
            }
        }
    },
    {
        data: "品牌",
        name: "brand",
        width: 100
    },
    {
        data: "型号",
        name: "model",
        width: 120
    },
    {
        data: "备注",
        name: "remark"
    },
    {
        data: "操作",
        width: 150,
        butname: [
            { name: "编辑", btnType: "primary" },
            { name: "删除", btnType: "danger" }
        ]
    }
];