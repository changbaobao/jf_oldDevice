import go from "gojs";
import timer from "./setTime";
import Qs from "qs";
var vm = null;
var GOJS = {};
GOJS.$GO = go.GraphObject.make;

function setVm(vue) {
    vm = vue;
}

/**
 *
 * @param {左侧aside} side
 */
function GOJSTypeInIt(side) {
    GOJS.myPalette = GOJS.$GO(go.Palette, side, {
        initialContentAlignment: go.Spot.Center, // 整个拓扑图的位置
        // 'grid.visible': true,
        "grid.gridCellSize": new go.Size(30, 20),
        "draggingTool.isGridSnapEnabled": true,
        "resizingTool.isGridSnapEnabled": true,
        "rotatingTool.snapAngleMultiple": 90,
        "rotatingTool.snapAngleEpsilon": 45,
        "undoManager.isEnabled": true
    });
    GOJS.template(GOJS.myPalette, [function() {}]);
    var typeModleJson = { class: "go.GraphLinksModel", nodeDataArray: [] };
    for (var k in GOJS.type) {
        typeModleJson.nodeDataArray.push(GOJS.type[k]);
    }
    GOJS.myPalette.model = go.Model.fromJson(typeModleJson); // 加载josn刷新画布
}

/**
 *
 * @param {画布内容} side
 */
function GOJSInit(side) {
    GOJS.myDiagram = GOJS.$GO(go.Diagram, "myDiagramDiv", {
        initialContentAlignment: go.Spot.Center, // 整个拓扑图的位置
        "grid.gridCellSize": new go.Size(5, 5), // 最小偏移量
        "draggingTool.isGridSnapEnabled": true,
        "resizingTool.isGridSnapEnabled": true,
        "rotatingTool.snapAngleMultiple": 90,
        "grid.visible": vm.gridVisible,
        LinkDrawn: GOJS.showLinkLabel,
        LinkRelinked: GOJS.showLinkLabel,
        "rotatingTool.snapAngleEpsilon": 45,
        "undoManager.isEnabled": true,
        initialScale: 0.58, // 初始化显示比例
        allowDrop: true
    });
    GOJS.template(GOJS.myDiagram, [GOJS.mClick]);
    GOJS.loopNode();
    GOJS.loopLink(); // 动态特效开始执行
    // GOJS.isReadOnly(true)// 默认只读
}
/**
 * 节点双击事件/默认为空 后期与页面交互部分加载
 * @param e  事件对象
 * @param obj 选中的对象 节点/连线
 */
GOJS.mClick = function(e, obj) {
    vm.dialogFormVisible = true;
    GOJS.thisNode = obj.part.data; // 当前双击选中的图形节点数据预留，暂时无用
    vm.isLabeVisible = false;
    vm.isPipelineVisible = false;
    vm.isPathVisible = false;
    /* if (!TAB.node.nname) { // 默认名称  显示顺序  自定义命名-数据命名（数据带的名字）-数据点名称-节点名称
                                                                                                                                                                                                                                                                                                                                                                                          TAB.node.nname = TAB.node.name
                                                                                                                                                                                                                                                                                                                                                                                        } */
    if (!GOJS.thisNode.nname) {
        // 默认名称  显示顺序  自定义命名-数据命名（数据带的名字）-数据点名称-节点名称
        GOJS.thisNode.nname = GOJS.thisNode.name;
    }
    vm.form.name = GOJS.thisNode.nname;
    vm.form.fl_value = GOJS.thisNode.dataType;
    if (GOJS.thisNode.nname) {
        vm.remoteMethod(GOJS.thisNode.nname);
    }
    vm.form.sjd_value = GOJS.thisNode.devDetailed;
    vm.form.node_projectId = GOJS.thisNode.projectId;
    if (typeof GOJS.thisNode.fill === "number") {
        GOJS.thisNode.fill = "#131AAC";
    }
    if (typeof GOJS.thisNode.stroke === "number") {
        GOJS.thisNode.fill = "#409EFF";
    }
    if (GOJS.thisNode.category === "Comment") {
        vm.form.projectVal = GOJS.thisNode.projectVal;
        vm.isPathVisible = true;
        if (GOJS.thisNode.pathId) {
            vm.$http
                .post(
                    "/S-Base/getConfigurationByStructureId",
                    Qs.stringify({
                        StructureId: GOJS.thisNode.projectVal[GOJS.thisNode.projectVal.length - 1]
                    })
                )
                .then(res => {
                    if (res.data.success) {
                        vm.form.chartList = res.data.data.map(item => ({
                            value: item.id,
                            label: item.name
                        }));
                        vm.form.pathId = GOJS.thisNode.pathId;
                    } else {
                        vm.$message.error(res.data.msg);
                    }
                });
        }
    }
    if (
        GOJS.thisNode.category === "Comment" ||
        GOJS.thisNode.category === "datatitle"
    ) {
        // 【数据标签】可进行自定义底图颜色和字体颜色
        vm.isLabeVisible = true;
        vm.isPipelineVisible = false;
        vm.form.zh_value = GOJS.thisNode.font;
        vm.form.zt_value = GOJS.thisNode.fontFamily;
        vm.form.bjcolor_value = GOJS.thisNode.fill;
        vm.form.fontcolor_value = GOJS.thisNode.stroke;
    }
    if (GOJS.thisNode.from || GOJS.thisNode.to) {
        // 管道可进行自定义颜色
        vm.isPipelineVisible = true;
        vm.isLabeVisible = false;
        vm.form.gdgg_value = GOJS.thisNode.strokeWidth;
        vm.form.gdcolor_value = GOJS.thisNode.stroke;
    }
    // TAB.scope.$apply()
    // TAB.typeMadal.modal("show");
    if (GOJS.thisNode.dev) {
        // TAB.devChange(GOJS.thisNode.dev)// 如果节点已选中设备需加载设备与点并选中
    }
    // vm.loadDataPoint()
};
/**
 * 定制节点/连线模板
 * @param obj
 * @param pa
 */
GOJS.template = function(obj, pa) {
    obj.nodeTemplateMap.add(
        "Comment", // 【自定义】 标签
        GOJS.$GO(
            go.Node,
            "Auto", { doubleClick: pa[0] },
            GOJS.nodeStyle(), {
                locationSpot: new go.Spot(0.5, 0.5),
                resizable: true
            },
            GOJS.$GO(
                go.Shape,
                "Rectangle", { fill: "#1E0EB3", opacity: 1, stroke: null },
                new go.Binding("fill", "fill", function(num) {
                    if (num == 2) {
                        return "#41BFEC";
                    }
                    if (num == 3) {
                        return "#FFBC00";
                    }
                    if (num == 4) {
                        return "#FF0000";
                    }
                    if (num == 5) {
                        return "#423C4A";
                    }
                    if (num == 6) {
                        return "#00FF00";
                    }
                    if (num == 7) {
                        return "#0000FF";
                    }
                    if (num == 8) {
                        return "#191970";
                    }
                    if (num == 9) {
                        return "#00BFFF";
                    }
                    if (num == 10) {
                        return "#778899";
                    }
                    if (num == 11) {
                        return "#4682B4";
                    }
                    if (num == 12) {
                        return "#000000";
                    }
                    if (num == 13) {
                        return "#191970";
                    }
                    if (num == 14) {
                        return "#00008B";
                    }
                    if (num == 15) {
                        return "#0000CD";
                    }
                    if (num == 16) {
                        return "#1E90FF";
                    }
                    if (num == 17) {
                        return "#00BFFF";
                    }
                    if (num == 18) {
                        return "#B0C4DE";
                    }
                    if (num == 19) {
                        return "#4682B4";
                    }
                    if (num == 20) {
                        return "#5F9EA0";
                    }
                    if (num == 21) {
                        return "#000080";
                    }
                    if (num == 22) {
                        return "#483D8B";
                    }
                    if (num == 23) {
                        return "#4169E1";
                    }
                    if (num == 24) {
                        return "#6495ED";
                    }
                    if (num == 25) {
                        return "#87CEFA";
                    }
                    if (num == 26) {
                        return "#ADD8E6";
                    }
                    if (num == 27) {
                        return "#008B8B";
                    }
                    if (num == 28) {
                        return "#00CED1";
                    }
                    if (num) {
                        return num;
                    } else {
                        return "#1E0EB3";
                    }
                }),
                new go.Binding("opacity", "fill", function(fill) {
                    if (fill == 1) {
                        return 0;
                    }
                    return 1;
                })
            ),
            GOJS.$GO(
                go.TextBlock, {
                    margin: 5,
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    editable: true,
                    font: "bold 12pt Helvetica, Arial, sans-serif",
                    // stroke: '#454545'
                    stroke: "#409EFF"
                },
                new go.Binding("stroke", "stroke", function(stroke) {
                    // 定义字体颜色，默认为黑色
                    if (stroke != null && stroke != "" && stroke != undefined) {
                        return stroke;
                    }
                    // return '#454545';
                    return "#409EFF";
                }),
                new go.Binding("font", "fontSizeAndfontFamily", function(
                    fontSizeAndfontFamily
                ) {
                    if (fontSizeAndfontFamily) {
                        return fontSizeAndfontFamily;
                    } else {
                        return "bold 20pt 微软雅黑,宋体,Helvetica, Arial, sans-serif";
                    }
                }),
                new go.Binding("text").makeTwoWay()
            ),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
                go.Size.stringify
            ), {
                toolTip: GOJS.$GO(
                    go.Adornment,
                    "Auto",
                    GOJS.$GO(go.Shape, { fill: "lightyellow" }),
                    GOJS.$GO(
                        go.TextBlock, { margin: 10 },
                        new go.Binding("text", "", function(d) {
                            return d.name;
                        })
                    )
                )
            }
        )
    );
    obj.nodeTemplateMap.add(
        "datatitle", // 【数据标签】
        GOJS.$GO(
            go.Node,
            "Auto", { doubleClick: pa[0] },
            GOJS.nodeStyle(), {
                locationSpot: new go.Spot(0.5, 0.5),
                resizable: true
            },
            GOJS.$GO(
                go.Shape,
                "Rectangle", { fill: "#409EFF", opacity: 0, stroke: null },
                new go.Binding("fill", "fill", function(num) {
                    if (num == 2) {
                        return "#41BFEC";
                    }
                    if (num == 3) {
                        return "#FFBC00";
                    }
                    if (num == 4) {
                        return "#FF0000";
                    }
                    if (num == 5) {
                        return "#423C4A";
                    }
                    if (num == 6) {
                        return "#00FF00";
                    }
                    if (num == 7) {
                        return "#0000FF";
                    }
                    if (num == 8) {
                        return "#191970";
                    }
                    if (num == 9) {
                        return "#00BFFF";
                    }
                    if (num == 10) {
                        return "#778899";
                    }
                    if (num == 11) {
                        return "#4682B4";
                    }
                    if (num == 12) {
                        return "#000000";
                    }

                    if (num == 13) {
                        return "#191970";
                    }
                    if (num == 14) {
                        return "#00008B";
                    }
                    if (num == 15) {
                        return "#0000CD";
                    }
                    if (num == 16) {
                        return "#1E90FF";
                    }
                    if (num == 17) {
                        return "#00BFFF";
                    }
                    if (num == 18) {
                        return "#B0C4DE";
                    }
                    if (num == 19) {
                        return "#4682B4";
                    }
                    if (num == 20) {
                        return "#5F9EA0";
                    }
                    if (num == 21) {
                        return "#000080";
                    }
                    if (num == 22) {
                        return "#483D8B";
                    }
                    if (num == 23) {
                        return "#4169E1";
                    }
                    if (num == 24) {
                        return "#6495ED";
                    }
                    if (num == 25) {
                        return "#87CEFA";
                    }
                    if (num == 26) {
                        return "#ADD8E6";
                    }
                    if (num == 27) {
                        return "#008B8B";
                    }
                    if (num == 28) {
                        return "#00CED1";
                    }
                    if (num) {
                        return num;
                    } else {
                        return "#409EFF";
                    }
                }),
                new go.Binding("opacity", "fill", function(fill) {
                    if (fill == null) {
                        return 0;
                    }
                    if (fill == 1) {
                        return 0;
                    }
                    return 1;
                })
            ),
            GOJS.$GO(
                go.TextBlock, {
                    margin: 5,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    editable: false,
                    font: "bold 12pt Helvetica, Arial, sans-serif",
                    // stroke: '#454545'
                    stroke: "#409EFF"
                },
                new go.Binding("stroke", "stroke", function(stroke) {
                    // 定义字体颜色，默认为黑色
                    if (stroke != null && stroke != "" && stroke != undefined) {
                        return stroke;
                    }
                    return "#409EFF";
                }),
                new go.Binding("font", "fontSizeAndfontFamily", function(
                    fontSizeAndfontFamily
                ) {
                    // 定义字体系列
                    return fontSizeAndfontFamily;
                }),
                new go.Binding("text", "", function(d) {
                    if (d.enums_value) {
                        return d.enums_value;
                    }
                    if (d.value !== null && d.value !== undefined) {
                        return d.value;
                    }
                    if (d.vname !== null && d.vname !== undefined) {
                        return d.vname;
                    }
                    if (d.nname !== null && d.nname !== undefined) {
                        return d.nname;
                    }
                    if (d.name !== null && d.name !== undefined) {
                        return d.name;
                    }
                }).makeTwoWay()
            ), {
                toolTip: GOJS.$GO(
                    go.Adornment,
                    "Auto",
                    GOJS.$GO(go.Shape, { fill: "lightyellow" }),
                    GOJS.$GO(
                        go.TextBlock, { margin: 10 },
                        new go.Binding("text", "", function(d) {
                            var name = d.nname;
                            if (d.vname !== null && d.vname !== undefined) {
                                name = d.vname;
                            }
                            if (d.warning && d.onLine) {
                                return (
                                    "名称:" +
                                    name +
                                    "\n\n" +
                                    "日期:" +
                                    d.date +
                                    "\n\n" +
                                    "报警状态:" +
                                    d.warning +
                                    "\n\n" +
                                    "在线状态:" +
                                    d.onLine
                                );
                            } else if (d.warning) {
                                return (
                                    "名称:" +
                                    name +
                                    "\n\n" +
                                    "日期:" +
                                    d.date +
                                    "\n\n" +
                                    "报警状态:" +
                                    d.warning
                                );
                            } else if (d.onLine) {
                                return (
                                    "名称:" +
                                    name +
                                    "\n\n" +
                                    "日期:" +
                                    d.date +
                                    "\n\n" +
                                    "在线状态:" +
                                    d.onLine
                                );
                            } else {
                                return "名称:" + name + "\n\n" + "日期:" + d.date;
                            }
                        })
                    )
                )
            }
        )
    );
    obj.nodeTemplateMap.add(
        "pic",
        GOJS.$GO(
            go.Node,
            "Auto", { doubleClick: pa[0] },
            GOJS.nodeStyle(), {
                locationSpot: new go.Spot(0.5, 0.5),
                locationObjectName: "PICVER",
                resizable: true,
                resizeObjectName: "PICVER"
            },
            GOJS.$GO(
                go.Picture, {
                    name: "PICVER",
                    imageStretch: go.GraphObject.Uniform
                },
                new go.Binding("source", "", function(d) {
                    var yd = 0;
                    if (d.nid == 0) {
                        return "";
                    }
                    if (d.yd) {
                        yd = d.yd;
                    }

                    let path = require("@/assets/images/node_pic/" +
                        d.nid +
                        "-" +
                        yd +
                        ".png");
                    return path;
                }),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
                    go.Size.stringify
                )
            ),
            GOJS.$GO(
                go.TextBlock, {
                    margin: new go.Margin(3, 0, 0, 0),
                    editable: false,
                    isMultiline: false
                },
                new go.Binding("text", "text")
            ),
            GOJS.makePort("C", go.Spot.Center, true, true), {
                toolTip: GOJS.$GO(
                    go.Adornment,
                    "Auto",
                    GOJS.$GO(go.Shape, { fill: "lightyellow" }),
                    GOJS.$GO(
                        go.TextBlock, { margin: 10 },
                        new go.Binding("text", "", function(d) {
                            if (d.name) {
                                return d.name;
                            }
                        })
                    )
                )
            }
        )
    );

    obj.nodeTemplateMap.add(
        "nodeLink",
        GOJS.$GO(
            go.Node,
            "Spot",
            GOJS.nodeStyle(),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
                go.Point.stringify
            ),
            GOJS.$GO(
                go.Panel,
                "Auto",
                GOJS.$GO(
                    go.Shape,
                    "Circle", { minSize: new go.Size(30, 30), fill: "yellow", stroke: null },
                    new go.Binding("opacity")
                ),
                GOJS.$GO(
                    go.TextBlock,
                    "", {
                        textAlign: "right",
                        font: "bold 11pt Helvetica, Arial, sans-serif"
                    },
                    new go.Binding("text")
                )
            ),
            GOJS.makePort("C", go.Spot.Center, true, true), {
                toolTip: GOJS.$GO(
                    go.Adornment,
                    "Auto",
                    GOJS.$GO(go.Shape, { fill: "lightyellow" }),
                    GOJS.$GO(
                        go.TextBlock, { margin: 10 },
                        new go.Binding("text", "", function(d) {
                            return d.name;
                        })
                    )
                )
            }
        )
    );
    obj.linkTemplate = GOJS.$GO(
        go.Link, {
            doubleClick: pa[0],
            toShortLength: -2,
            fromShortLength: -2,
            layerName: "Background",
            corner: 15,
            reshapable: true,
            resegmentable: true
        }, { adjusting: go.Link.Stretch }, // optional
        new go.Binding("points", "points").makeTwoWay(),
        GOJS.$GO(
            go.Shape, { isPanelMain: true, stroke: "#CCC", strokeWidth: 10 },
            new go.Binding("stroke", "", GOJS.creatTemp),
            new go.Binding("strokeWidth", "strokeWidth", function(strokeWidth) {
                if (strokeWidth) {
                    return strokeWidth * 5;
                }
                return 10;
            })
        ),
        GOJS.$GO(
            go.Shape, {
                isPanelMain: true,
                stroke: "#409EFF",
                strokeWidth: 2,
                name: "PIPE",
                strokeDashArray: [20, 40]
            },
            new go.Binding("strokeWidth", "strokeWidth", function(strokeWidth) {
                if (strokeWidth) {
                    return strokeWidth;
                }
                return 2;
            })
        )
    );
};

/**
 * link绘制基础事件，GOJS内置
 * @param e
 */
GOJS.showLinkLabel = function(e) {
    var label = e.subject.findObject("LABEL");
    if (label !== null)
        label.visible = e.subject.fromNode.data.figure === "Diamond";
};

/**
 * 节点基础样式
 * @returns {{locationSpot: (L.Center|*|Q.Center), mouseEnter: Function, mouseLeave: Function}[]}
 */
GOJS.nodeStyle = function() {
    return [
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        {
            locationSpot: go.Spot.Center,
            mouseEnter: function(e, obj) {
                GOJS.showPorts(obj.part, true);
            },
            mouseLeave: function(e, obj) {
                GOJS.showPorts(obj.part, false);
            }
        }
    ];
};
/**
 * 基础编辑模板
 * 节点类型/暂时不动/后期需改为配置
 */
GOJS.type = {
    /**
     * n1-n1000预留特殊类型标签
     */
    // 未知问题导致1017会排在n0之后，导致排版问题，故n0放在下边
    n1: {
        name: "连接点",
        size: "30 22",
        nid: "1",
        dy: 0,
        category: "nodeLink",
        opacity: 0.5
    },
    n2: {
        name: "自定义",
        size: "80 30",
        nid: "2",
        dy: 0,
        category: "Comment",
        text: "自定义"
    },
    n3: {
        name: "数据标签",
        size: "30 22",
        nid: "3",
        dy: 0,
        category: "datatitle",
        text: "数据标签"
    },
    /**
     * n1001-图形节点
     * dy:4  动画张数规则为1001-(0,1,2,3,4).png
     * url =  assets/images/node_pic/[nid]-0.png
     */
    n1001: { name: "白烟囱", size: "30 22", nid: "1001", dy: 0, category: "pic" },
    n1002: { name: "板换", size: "30 22", nid: "1002", dy: 0, category: "pic" },
    n1003: { name: "卧式泵", size: "30 22", nid: "1003", dy: 2, category: "pic" },
    /* n1004: {name: '大燃气炉', size: "30 22", nid: "1004", dy: 1, "category": "pic"}, */
    n1076: {
        name: "大燃气炉",
        size: "30 22",
        nid: "1076",
        dy: 2,
        category: "pic"
    },
    n1005: { name: "电表", size: "30 22", nid: "1005", dy: 0, category: "pic" },
    n1006: { name: "蝶阀", size: "30 22", nid: "1006", dy: 0, category: "pic" },
    n1007: { name: "空压机", size: "30 22", nid: "1007", dy: 0, category: "pic" },
    n1009: { name: "气表", size: "30 22", nid: "1009", dy: 0, category: "pic" },
    n1010: { name: "球阀", size: "30 22", nid: "1010", dy: 0, category: "pic" },
    n1011: { name: "燃气炉", size: "30 22", nid: "1011", dy: 1, category: "pic" },
    n1012: { name: "热表", size: "30 22", nid: "1012", dy: 0, category: "pic" },
    n1013: { name: "软化水", size: "30 22", nid: "1013", dy: 0, category: "pic" },
    n1014: { name: "水表", size: "30 22", nid: "1014", dy: 0, category: "pic" },
    n1015: { name: "水箱", size: "30 22", nid: "1015", dy: 0, category: "pic" },
    n1017: { name: "烟囱", size: "30 22", nid: "1017", dy: 0, category: "pic" },
    // n0: {name: '占位', size: "70 95", loc: "0 0", nid: "0", dy: 0, "category": "pic"},//未知问题导致1017会排在n0之后，导致排版问题，故放在此处
    n1018: { name: "阀", size: "30 22", nid: "1018", dy: 1, category: "pic" },
    n1019: { name: "阀", size: "30 22", nid: "1019", dy: 1, category: "pic" },
    n1020: { name: "阀", size: "30 22", nid: "1020", dy: 0, category: "pic" },
    n1021: { name: "阀", size: "30 22", nid: "1021", dy: 0, category: "pic" },
    n1022: { name: "风机", size: "30 22", nid: "1022", dy: 2, category: "pic" },
    n1023: { name: "罐", size: "30 22", nid: "1023", dy: 0, category: "pic" },
    n1024: { name: "罐", size: "30 22", nid: "1024", dy: 0, category: "pic" },
    n1025: { name: "罐", size: "30 22", nid: "1025", dy: 0, category: "pic" },
    n1026: { name: "罐", size: "30 22", nid: "1026", dy: 0, category: "pic" },
    n1027: { name: "罐", size: "30 22", nid: "1027", dy: 0, category: "pic" },
    n1028: { name: "过滤器", size: "30 22", nid: "1028", dy: 0, category: "pic" },
    n1029: { name: "换热器", size: "30 22", nid: "1029", dy: 0, category: "pic" },
    n1030: { name: "换热器", size: "30 22", nid: "1030", dy: 0, category: "pic" },
    n1031: { name: "冷凝", size: "30 22", nid: "1031", dy: 0, category: "pic" },
    n1032: { name: "冷凝", size: "30 22", nid: "1032", dy: 0, category: "pic" },
    n1033: { name: "压力表", size: "30 22", nid: "1033", dy: 0, category: "pic" },
    n1034: {
        name: "压力表(横向)",
        size: "30 22",
        nid: "1034",
        dy: 0,
        category: "pic"
    },
    n1075: {
        name: "压力表(纵向)",
        size: "30 22",
        nid: "1075",
        dy: 0,
        category: "pic"
    },
    n1035: { name: "温度表", size: "30 22", nid: "1035", dy: 0, category: "pic" },
    n1036: { name: "药罐", size: "30 22", nid: "1036", dy: 0, category: "pic" },
    n1037: { name: "按钮", size: "30 22", nid: "1037", dy: 0, category: "pic" },
    n1038: { name: "报警灯", size: "30 22", nid: "1038", dy: 0, category: "pic" },
    n1039: { name: "电动阀", size: "30 22", nid: "1039", dy: 0, category: "pic" },
    n1040: { name: "反应器", size: "30 22", nid: "1040", dy: 0, category: "pic" },
    n1041: { name: "集水器", size: "30 22", nid: "1041", dy: 0, category: "pic" },
    n1042: { name: "冷凝器", size: "30 22", nid: "1042", dy: 0, category: "pic" },
    n1043: { name: "冷凝器", size: "30 22", nid: "1044", dy: 0, category: "pic" },
    n1045: {
        name: "立式过滤器",
        size: "30 22",
        nid: "1045",
        dy: 0,
        category: "pic"
    },
    n1046: {
        name: "立式过滤器",
        size: "30 22",
        nid: "1046",
        dy: 0,
        category: "pic"
    },
    n1047: {
        name: "流量计热表",
        size: "30 22",
        nid: "1047",
        dy: 0,
        category: "pic"
    },
    n1048: { name: "盘管", size: "30 22", nid: "1048", dy: 0, category: "pic" },
    n1049: {
        name: "热泵核心",
        size: "30 22",
        nid: "1049",
        dy: 0,
        category: "pic"
    },
    n1050: {
        name: "热泵机组",
        size: "30 22",
        nid: "1050",
        dy: 0,
        category: "pic"
    },
    n1051: {
        name: "热泵机组",
        size: "30 22",
        nid: "1051",
        dy: 0,
        category: "pic"
    },
    n1052: {
        name: "热泵自图",
        size: "30 22",
        nid: "1052",
        dy: 0,
        category: "pic"
    },
    n1053: {
        name: "热泵自图",
        size: "30 22",
        nid: "1053",
        dy: 0,
        category: "pic"
    },
    n1054: {
        name: "热泵自图",
        size: "30 22",
        nid: "1054",
        dy: 0,
        category: "pic"
    },
    n1055: { name: "热表", size: "30 22", nid: "1055", dy: 0, category: "pic" },
    n1056: { name: "软水器", size: "30 22", nid: "1056", dy: 0, category: "pic" },
    n1057: {
        name: "竖直电动阀",
        size: "30 22",
        nid: "1057",
        dy: 0,
        category: "pic"
    },
    n1058: {
        name: "竖直手动阀",
        size: "30 22",
        nid: "1058",
        dy: 0,
        category: "pic"
    },
    n1059: {
        name: "双良锅炉",
        size: "30 22",
        nid: "1059",
        dy: 0,
        category: "pic"
    },
    n1060: { name: "水泵", size: "30 22", nid: "1060", dy: 0, category: "pic" },
    n1061: { name: "指示灯", size: "30 22", nid: "1061", dy: 0, category: "pic" },
    n1044: {
        name: "冷凝器(纵向)",
        size: "30 22",
        nid: "1044",
        dy: 0,
        category: "pic"
    },
    n1067: {
        name: "冷凝器(口朝右侧)",
        size: "30 22",
        nid: "1067",
        dy: 0,
        category: "pic"
    },
    n1068: {
        name: "冷凝器(口朝左侧)",
        size: "30 22",
        nid: "1068",
        dy: 0,
        category: "pic"
    },
    n1062: {
        name: "电动碟阀(横向)",
        size: "15 35",
        nid: "1062",
        dy: 0,
        category: "pic"
    },
    n1063: {
        name: "电动碟阀(纵向)",
        size: "30 22",
        nid: "1063",
        dy: 0,
        category: "pic"
    },
    n1065: {
        name: "温度变送器(纵向)",
        size: "30 22",
        nid: "1065",
        dy: 0,
        category: "pic"
    },
    n1066: {
        name: "温度变送器(横向)",
        size: "30 22",
        nid: "1066",
        dy: 0,
        category: "pic"
    },
    n1008: {
        name: "立式泵(横向)",
        size: "30 22",
        nid: "1008",
        dy: 2,
        category: "pic"
    },
    n1069: {
        name: "立式泵(纵向)",
        size: "30 22",
        nid: "1069",
        dy: 2,
        category: "pic"
    },
    n1016: {
        name: "泵(横向)",
        size: "30 22",
        nid: "1016",
        dy: 2,
        category: "pic"
    },
    n1070: {
        name: "泵(纵向)",
        size: "30 22",
        nid: "1070",
        dy: 2,
        category: "pic"
    },
    n1071: {
        name: "电动球阀(横向)",
        size: "30 22",
        nid: "1071",
        dy: 2,
        category: "pic"
    },
    n1072: {
        name: "电动球阀(纵向)",
        size: "30 22",
        nid: "1072",
        dy: 2,
        category: "pic"
    },
    n1073: {
        name: "电动球阀(横向)",
        size: "30 22",
        nid: "1073",
        dy: 2,
        category: "pic"
    },
    n1074: {
        name: "电动球阀(纵向)",
        size: "30 22",
        nid: "1074",
        dy: 2,
        category: "pic"
    },
    n1064: {
        name: "电动三通阀",
        size: "30 22",
        nid: "1064",
        dy: 0,
        category: "pic"
    },
    n1077: {
        name: "水泵(横向)",
        size: "30 22",
        nid: "1077",
        dy: 2,
        category: "pic"
    },
    n1078: {
        name: "水泵(纵向)",
        size: "30 22",
        nid: "1078",
        dy: 2,
        category: "pic"
    },

    n1079: {
        name: "板换样式一",
        size: "30 22",
        nid: "1079",
        dy: 0,
        category: "pic"
    },
    n1080: {
        name: "板换样式二",
        size: "30 22",
        nid: "1080",
        dy: 0,
        category: "pic"
    },
    n1081: {
        name: "真空锅炉",
        size: "30 22",
        nid: "1081",
        dy: 0,
        category: "pic"
    },
    n1082: {
        name: "锅炉样式一",
        size: "30 22",
        nid: "1082",
        dy: 0,
        category: "pic"
    },
    n1083: {
        name: "锅炉样式三",
        size: "30 22",
        nid: "1083",
        dy: 0,
        category: "pic"
    },
    n1084: {
        name: "水泵样式一(纵向)",
        size: "30 22",
        nid: "1084",
        dy: 2,
        category: "pic"
    },
    n1085: {
        name: "水泵样式一(横向)",
        size: "30 22",
        nid: "1085",
        dy: 2,
        category: "pic"
    },
    n1086: {
        name: "水泵样式二(纵向)",
        size: "30 22",
        nid: "1086",
        dy: 2,
        category: "pic"
    },
    n1087: {
        name: "水泵样式二(横向)",
        size: "30 22",
        nid: "1087",
        dy: 2,
        category: "pic"
    },
    n1088: {
        name: "水泵样式三(纵向)",
        size: "30 22",
        nid: "1088",
        dy: 2,
        category: "pic"
    },
    n1089: {
        name: "水泵样式三(横向)",
        size: "30 22",
        nid: "1089",
        dy: 2,
        category: "pic"
    },
    n1090: {
        name: "水泵样式四(纵向)",
        size: "30 22",
        nid: "1090",
        dy: 2,
        category: "pic"
    },
    n1091: {
        name: "水泵样式四(横向)",
        size: "30 22",
        nid: "1091",
        dy: 2,
        category: "pic"
    },
    n1092: { name: "变频柜", size: "30 22", nid: "1092", dy: 2, category: "pic" },
    n1093: { name: "建筑物", size: "30 22", nid: "1093", dy: 2, category: "pic" },
    n1094: { name: "房子", size: "30 22", nid: "1094", dy: 2, category: "pic" },
    n1095: {
        name: "气候补偿器",
        size: "30 22",
        nid: "1095",
        dy: 2,
        category: "pic"
    },
    n1096: {
        name: "锅炉控制柜",
        size: "30 22",
        nid: "1096",
        dy: 2,
        category: "pic"
    },
    n1097: {
        name: "无线室温",
        size: "30 22",
        nid: "1097",
        dy: 2,
        category: "pic"
    }
};

/**
 * 自定义连线
 * @param name 名称
 * @param spot 位置(上下左右中)
 * @param output 是否连出
 * @param input  是否连进
 * @returns {*}
 */
GOJS.makePort = function(name, spot, output, input) {
    return GOJS.$GO(go.Shape, "Circle", {
        fill: "transparent",
        stroke: null,
        desiredSize: new go.Size(8, 8),
        alignment: spot,
        alignmentFocus: spot,
        portId: name,
        fromSpot: spot,
        toSpot: spot,
        fromLinkable: output,
        toLinkable: input,
        cursor: "pointer"
    });
};

/**
 * 鼠标悬浮时显示可连线的点
 * @param node
 * @param show
 */
GOJS.showPorts = function(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
        port.stroke = show ? "red" : null;
    });
};

/**
 * 颜色变化
 * @param num 温度
 * @returns {string}
 */
GOJS.creatTemp = function(d) {
    if (d.temp == 1) {
        return "#abc0e7";
    }
    var num = d.stroke;
    if (num == 1) {
        return "#CCC";
    }
    if (num == 2) {
        return "#41BFEC";
    }
    if (num == 3) {
        return "#FFBC00";
    }
    if (num == 4) {
        return "#FF0000";
    }
    if (num == 5) {
        return "#423C4A";
    }
    if (num == 6) {
        return "#00FF00";
    }
    if (num == 7) {
        return "#0000FF";
    }
    if (num) {
        return num;
    }
    return "#CCC";
    // if (0 == num) {
    //    return '#CCC';
    // }
    // if (num < 50) {
    //    return '#41BFEC';
    // }
    // if (num > 50 && num < 80) {
    //    return '#FFBC00'
    // }
    // return 'red'
};
/**
 * 节点动画效果
 */
GOJS.loopNode = function() {
    GOJS.myDiagram.nodes.each(function(node) {
        var data = node.part.data;
        if (data.dyn && data.dyn > 0 && data.dy > 0) {
            if (data.yd == null || data.yd + 1 > data.dy) {
                data.yd = 1;
            } else {
                data.yd = data.yd + 1;
            }
            GOJS.myDiagram.model.updateTargetBindings(data);
        }
    });
    timer.at("gojs.loopNode", GOJS.loopNode, 500);
};

/**
 * 管道动态效果
 */
GOJS.opacity = 1; // 管道动态连线所需的透明度，默认不透明
GOJS.down = true; // 管道动态连线所需的公共变量
GOJS.loopLink = function() {
    var diagram = GOJS.myDiagram;
    var oldskips = diagram.skipsUndoManager;
    diagram.skipsUndoManager = true;
    diagram.links.each(function(link) {
        var d = link.part.data;
        if (d.dyn == 1) {
            var shape = link.findObject("PIPE");
            if (shape) {
                var off = shape.strokeDashOffset - 3;
                // animate (move) the stroke dash
                shape.strokeDashOffset = off <= 0 ? 60 : off;
                // animte (strobe) the opacity:
                if (GOJS.down) GOJS.opacity = GOJS.opacity - 0.02;
                else GOJS.opacity = GOJS.opacity + 0.006;
                if (GOJS.opacity <= 0) {
                    GOJS.down = !GOJS.down;
                    GOJS.opacity = 0;
                }
                if (GOJS.opacity > 1) {
                    GOJS.down = !GOJS.down;
                    GOJS.opacity = 1;
                }
                shape.opacity = GOJS.opacity;
            }
        }
    });
    diagram.skipsUndoManager = oldskips;
    timer.at("gojs.loopLink", GOJS.loopLink, 100);
};

/**
 * 设置管路连接点的透明度
 * 编辑模式完全不透明 true
 * 展示模式完全透明   false
 * @param opacity
 */
GOJS.setOpacity = function(opacity) {
    GOJS.myDiagram.nodes.each(function(node) {
        var data = node.part.data;
        if (opacity) {
            data.opacity = 0.5;
        } else {
            data.opacity = 0;
        }

        GOJS.myDiagram.model.updateTargetBindings(data);
    });
};

// 设置只读属性
GOJS.isReadOnly = function(isReadOnly) {
    GOJS.myDiagram.isReadOnly = isReadOnly;
};

GOJS.test = function() {
    /**
     * 500秒修改一次管道状态
     */
    var isGo = 1;
    GOJS.myDiagram.links.each(function(link) {
        if (isGo < 3) {
            isGo++;
            var data = link.part.data;
            if (data.temp == 1) {
                data.temp = 0;
            } else {
                data.temp = 1;
            }
            GOJS.myDiagram.model.updateTargetBindings(data);
        }
    });
    timer.at("gojs.test", GOJS.test, 500);
};

var TAB = {};
TAB.node = {}; // 当前选中的图形信息
// 设备选择后查询数据点
TAB.devChange = function(devId) {
    if (devId) {
        vm.$http
            .post("/S-Base/getDevDetailedByDevId", Qs.stringify({ devId: devId }))
            .then(res => {
                if (res.data.success) {
                    TAB.devInfoList.devDetaileds = {};
                    var jj = 0;
                    for (var k in res.data.data) {
                        TAB.devInfoList.devDetaileds[jj] = res.data.data[k];
                        jj++;
                    }
                } else {
                    vm.$message.error(res.data.msg);
                }
            });
    }
};

// 保存修改后的节点数据
function GOJSSaveNode() {
    let node = GOJS.thisNode;
    node.nname = vm.form.name;
    node.dataType = vm.form.fl_value;
    node.devDetailed = vm.form.sjd_value;
    node.projectId = vm.projectVal[vm.projectVal.length - 1];
    node.pathId = vm.form.pathId;
    node.projectVal = vm.form.projectVal;
    if (node.category === "Comment" || GOJS.thisNode.category === "datatitle") {
        node.font = vm.form.zh_value;
        node.fontFamily = vm.form.zt_value;
        node.fill = vm.form.bjcolor_value;
        node.stroke = vm.form.fontcolor_value;
    } else if (GOJS.thisNode.from || GOJS.thisNode.to) {
        node.strokeWidth = vm.form.gdgg_value;
        node.stroke = vm.form.gdcolor_value;
    }
    node.fontSizeAndfontFamily = node.font + "pt " + node.fontFamily;

    GOJS.myDiagram.model.updateTargetBindings(node); // 根据节点数据对象更改节点属性
}
/**
 * 保存当前编辑的图形
 * 因无法判断用户是否进行了编辑，故不做判断，直接保存
 * 保存成功后按取消编辑处理
 */
function GOJSSave() {
    GOJS.myDiagram.nodes.each(function(node) {
        var data = node.part.data;
        if (data["value"] || data["date"]) {
            delete data["value"];
            delete data["vname"];
            delete data["text"];
            delete data["date"];
        }
        delete data["dyn"];
        delete data["yd"];
        GOJS.myDiagram.model.updateTargetBindings(data);
    });
    GOJS.myDiagram.links.each(function(link) {
        var data = link.part.data;
        if (data["temp"]) {
            delete data["temp"];
        }
        delete data["dyn"];
        GOJS.myDiagram.model.updateTargetBindings(data);
    });
    var json = GOJS.myDiagram.model;

    let projectId = vm.projectVal[vm.projectVal.length - 1];
    if (vm.saveType === "add") {
        let params = Object.assign({}, vm.addChartForm, {
            structureId: projectId,
            content: JSON.stringify(json)
        });
        vm.$http
            .post("/S-Base/AddConfiguration", Qs.stringify(params))
            .then(res => {
                if (res.data.success) {
                    vm.addChartVisible = false;
                    vm.$message({
                        message: res.data.msg,
                        type: "success"
                    });
                } else {
                    vm.$message.error(res.data.msg);
                }
            });
    } else {
        let params = {
            backgroundColor: vm.addChartForm.backgroundColor,
            offlineColor: vm.addChartForm.offlineColor,
            alarmColor: vm.addChartForm.alarmColor,
            structureId: projectId,
            content: JSON.stringify(json),
            id: vm.chartId
        };
        vm.$http
            .post("/S-Base/updateConfiguration", Qs.stringify(params))
            .then(res => {
                if (res.data.success) {
                    vm.addChartVisible = false;
                    vm.$message({
                        message: res.data.msg,
                        type: "success"
                    });
                    vm.getConfigurationByStructureId();
                } else {
                    vm.$message.error(res.data.msg);
                }
            });
    }
    /* dataServer.upMon({id: TAB.id, modulejson: JSON.stringify(json)}, function (data) {
                                                                                  if (data.success) {
                                                                                    ngTip.tip(data.msg, 'success', 'icon fa fa-check')
                                                                                    TAB.scope.edit(false, 'onlyButt')// 保存成功后按取消编辑处理
                                                                                  }
                                                                                }) */
}

/**
 * 加载图形数据
 */
function GOSJLoad(json, readOnly) {
    if (!json) {
        json = {};
    }
    if (typeof json === "string") {
        json = JSON.parse(json);
    }
    GOJS.myDiagram.model = go.Model.fromJson(json);
    GOJS.myDiagram.delayInitialization(function() {
        GOJS.myDiagram.requestUpdate();
    });
    GOJS.setOpacity(!readOnly); // 默认为透明
    reData(true);
    GOJS.isReadOnly(readOnly); // 默认只读
    // GOJS.myDiagram.computebounds();
    // GOJS.myDiagram.delayinitialization();
}

/**
 * 图形加载后进行数据刷新
 */
function reData(cycle) {
    var model = GOJS.myDiagram.model,
        node = model.nodeDataArray,
        link = model.linkDataArray;

    if (node.length > 0 || link.length > 0) {
        var delList = "";
        // 循环所有组态图节点生成需要更新的数据点
        for (var k in node) {
            if (node[k]["devDetailed"]) {
                if (delList.length == 0) {
                    delList += node[k]["devDetailed"];
                } else {
                    delList = delList + "," + node[k]["devDetailed"];
                }
            }
        }
        for (var k in link) {
            // dataPoint
            if (link[k]["devDetailed"]) {
                if (delList.length == 0) {
                    delList += link[k]["devDetailed"];
                } else {
                    delList = delList + "," + link[k]["devDetailed"];
                }
            }
        }
        vm.$http
            .post(
                "/S-RealData/getRealDataValue",
                Qs.stringify({ dataCodes: delList })
            )
            .then(res => {
                let data = res.data;
                if (data.success) {
                    var datakey = {};
                    for (var k in data.data) {
                        datakey[data.data[k]["dataCode"]] = data.data[k];
                    }
                    for (var k in node) {
                        if (datakey[node[k]["devDetailed"]]) {
                            node[k]["value"] = datakey[node[k]["devDetailed"]]["value"];
                            if (datakey[node[k]["devDetailed"]]["enums"]) {
                                if (datakey[node[k]["devDetailed"]]["enums"].length > 0) {
                                    node[k]["enums"] = datakey[node[k]["devDetailed"]]["enums"];
                                    node[k]["enums_list"] = node[k]["enums"].filter(
                                        item => item.value == node[k]["value"]
                                    )[0];
                                    node[k]["enums_value"] = node[k]["enums_list"] ?
                                        node[k]["enums_list"]["name"] :
                                        node[k]["value"];
                                } else {
                                    delete node[k]["enums"];
                                    delete node[k]["enums_list"];
                                    delete node[k]["enums_value"];
                                }
                            } else {
                                delete node[k]["enums"];
                                delete node[k]["enums_list"];
                                delete node[k]["enums_value"];
                            }
                            node[k]["date"] = new Date(
                                datakey[node[k]["devDetailed"]]["date"]
                            ).Format("yyyy-MM-dd hh:mm:ss");
                            node[k]["colour"] = datakey[node[k]["devDetailed"]]["colour"];
                            if (!node[k]["nname"] || node[k]["nname"] == node[k]["name"]) {
                                node[k]["vname"] = datakey[node[k]["devDetailed"]]["dataName"];
                            }
                            node[k]["onLine"] = datakey[node[k]["devDetailed"]]["onLine"];
                            node[k]["warning"] = datakey[node[k]["devDetailed"]]["warning"];
                            if (datakey[node[k]["devDetailed"]]["value"] > 0) {
                                node[k]["dyn"] = 1;
                            } else {
                                node[k]["dyn"] = 0;
                            }

                            if (node[k].onLine === "在线" && node[k].warning === "是") {
                                node[k].stroke = vm.addChartForm.alarmColor;
                            } else if (node[k].onLine === "离线") {
                                node[k].stroke = vm.addChartForm.offlineColor;
                            }
                            node[k]["projectVal"] =
                                datakey[node[k]["devDetailed"]]["projectVal"];
                            node[k]["pathId"] = datakey[node[k]["devDetailed"]]["pathId"];
                            GOJS.myDiagram.model.updateTargetBindings(node[k]);
                        }
                    }
                    for (var k in link) {
                        if (
                            datakey[link[k]["devDetailed"]] &&
                            datakey[link[k]["devDetailed"]]["value"] > 0
                        ) {
                            link[k]["dyn"] = 1;
                        } else {
                            link[k]["dyn"] = 0;
                        }
                        GOJS.myDiagram.model.updateTargetBindings(link[k]);
                    }
                }
                if (cycle) {
                    timer.at(
                        "reData",
                        function() {
                            reData(cycle);
                        },
                        10000
                    );
                }
            });
    }
}
Date.prototype.Format = function(fmt) {
    // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    }
    return fmt;
};
export default {
    GOJSInit,
    GOJSTypeInIt,
    setVm,
    GOJSSaveNode,
    GOSJLoad,
    GOJSSave,
    reData
};