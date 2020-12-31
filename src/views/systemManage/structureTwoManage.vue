<template>
  <el-row :gutter="20">
    <el-col :span="7">
      <div class="grid-content bg-fff">
        <div class="top-btn m_b10">
          <el-button type="primary" size="mini" @click="changemodule('添加架构')">添加架构</el-button>
          <el-button type="primary" size="mini" @click="changemodule('编辑架构')">编辑架构</el-button>
          <el-button type="primary" size="mini" @click="dialogVisible3 = true">删除架构</el-button>
        </div>
        <el-tree
          ref="treekf"
          :props="props2"
          :load="loadNode"
          node-key="id"
          :append="add"
          :highlight-current="true"
          :remove="delnode"
          :render-content="renderContent"
          :expand-on-click-node="false"
          lazy
          @node-click="handleNodeClick"
        />
        <el-dialog
          title="提示"
          :close-on-click-modal="notClose"
          close-on-click-modal:false
          :visible.sync="dialogVisible3"
          width="30%"
        >
          <span>是否删除{{ formInline.name }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible3 = false">取 消</el-button>
            <el-button type="primary" size="small" @click="delModule()">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :close-on-click-modal="notClose"
          :title="titleName"
          :visible.sync="dialogVisible"
          width="50%"
        >
          <div>
            <el-form ref="lonAndlat" :model="formInline" class="demo-form-inline" size="small" label-width="80px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="名称">
                    <el-input v-model="formInline.name" placeholder="必填" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名1">
                    <el-input v-model="formInline.byname1" placeholder="别名1" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名2">
                    <el-input v-model="formInline.byname2" placeholder="别名1" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名3">
                    <el-input v-model="formInline.byname3" placeholder="别名1" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="排序">
                    <el-input v-model="formInline.sort" placeholder=" 请输入数字" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="类型">
                    <el-select v-model="formInline.structureTypeName" placeholder="请选择" style="width:100%;">
                      <el-option v-for="( t, index ) in selectType" :key="index" :label="t.name" :value="t.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="经纬度"
                    prop="lon"
                  >
                    <el-input v-model="formInline.lonLat" placeholder="非必填，例如：116.564800,39.154873" auto-complete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="3D地址"
                    prop="threeDUrl"
                  >
                    <el-input v-model="formInline.threeDUrl" placeholder="请输入3D地址" auto-complete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="组织机构"
                    prop="ncOrg"
                  >
                    <el-input v-model="formInline.ncOrg" placeholder="请填写组织机构" auto-complete="off" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="项目仓库"
                    prop="ncWarehouse"
                  >
                    <el-input v-model="formInline.ncWarehouse" placeholder="请填写项目仓库" auto-complete="off" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="货位"
                    prop="ncStorageroom"
                  >
                    <el-input v-model="formInline.ncStorageroom" placeholder="请填写货位" auto-complete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="地图级数"
                    prop="gdZoomlevel"
                  >
                    <el-input v-model="formInline.gdZoomlevel" placeholder="请填写...." auto-complete="off" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button type="primary" size="small" @click="sunbmitStructure()">确 定</el-button>
              <el-button size="small" @click="closeStructure()">取 消</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </el-col>
    <el-col :span="17">
      <el-tabs type="border-card">
        <el-tab-pane label="小区管理">
          <div class="grid-content bg-fff">
            <el-button type="primary" size="small" class="m_b10" @click="changeVillage('添加小区')">添加小区
            </el-button>
            <el-dialog
              :close-on-click-modal="notClose"
              :title="villagetitle"
              :visible.sync="dialogVisiblea"
              width="30%"
            >
              <el-form ref="village" label-width="80px" class="demo-formInline">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="village.name" />
                </el-form-item>
                <el-form-item label="锅炉房" prop="boilerRoomId" style="margin-left:12px;">
                  <el-select v-model="village.boilerRoomId" placeholder="请选择">
                    <el-option
                      v-for="item in boilerRoomData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-model="village.remark" type="textarea" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisiblea = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitVillage()">确 定</el-button>
              </span>
            </el-dialog>
            <div class="kfScreenFull" style="width:100%;height:100%">
              <el-table
                ref="multipleTable"
                :data="tableData3"
                :header-cell-style="{'background-color': '#fafafa'}"
                tooltip-effect="dark"
                style="width: 100%"
              >
                <el-table-column
                  prop="name"
                  label="名称"
                  width="120"
                />
                <el-table-column
                  prop="remark"
                  label="描述"
                  show-overflow-tooltip
                />
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="handleEdit('编辑小区', scope.row)"
                    >编辑</el-button>
                    <el-button
                      class="del"
                      type="danger"
                      size="mini"
                      @click.native.prevent="deleteRow(scope.$index,tableData3)"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="锅炉房管理">
          <div class="grid-content">
            <div class="top-btn">
              <el-button type="primary" size="small" @click="addBoilerRoomClick('add')">新增锅炉房</el-button>
              <el-form :inline="true" class="fr" />
            </div>
            <div class="table m-t10">
              <el-table :header-cell-style="{'background-color': '#fafafa'}" :data="bolierTableData" style="width: 100%;text-align:center;">
                <el-table-column
                  prop="name"
                  width="120"
                  label="锅炉房名字"
                />
                <el-table-column
                  prop="ownedArea"
                  width="120"
                  label="既有面积"
                />
                <el-table-column
                  prop="addArea"
                  width="120"
                  label="新增面积"
                />
                <el-table-column
                  prop="lowArea"
                  width="120"
                  label="低温面积"
                />
                <el-table-column
                  prop="standardRoomTemp"
                  width="80"
                  label="标准室温"
                />
                <el-table-column
                  prop="meteorological"
                  width="120"
                  label="气象信息区域"
                />
                <el-table-column
                  prop="remark"
                  width="120"
                  label="备注"
                />
                <el-table-column
                  label="时间"
                  width="160"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.saveDate | dateformat }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="180"
                  align="center"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.$index,scope.row )">编辑</el-button>
                    <el-button type="danger" size="mini" @click="boilerDeleteRow(scope.$index,bolierTableData )">删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  width="180"
                  align="center"
                  label="能源设备"
                >
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDevRow(scope.$index,scope.row )">编辑设备</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 锅炉房添加或编辑弹框 -->
            <AddOrEditDialog v-if="boilerRoomDialog.show" :structure-id="new Array(clickId)" :is-show="boilerRoomDialog.show" :dialog-row="boilerRoomDialog.dialogRow" @closeDialog="closeDialog" @getTableData="getTableData" />
            <!-- 锅炉房编辑 -->
            <el-dialog
              :title="dialogName"
              width="70%"
              :visible.sync="DevVisible"
            >
              <el-form ref="boilerRoom" :model="boilerRoom" :rules="rules" class="demo-form-inline" size="small" label-width="130px">
                <span style="font-weight:bold;font-size:15px;">年度计划：</span>
                <el-row>
                  <el-col :span="6">
                    <el-form-item prop="yearPlanGasConsumption" label="气耗量">
                      <el-input v-model="boilerRoom.yearPlanGasConsumption" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="yearPlanWaterConsumption" label="水耗量">
                      <el-input v-model="boilerRoom.yearPlanWaterConsumption" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="yearPlanPowerConsumption" label="电耗量">
                      <el-input v-model="boilerRoom.yearPlanPowerConsumption" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="yearPlanHeatConsumption" label="热耗量">
                      <el-input v-model="boilerRoom.yearPlanHeatConsumption" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <span style="font-weight:bold;font-size:15px;">面积：</span>
                <el-row>
                  <el-col :span="6">
                    <el-form-item prop="ownedArea" label="既有">
                      <el-input v-model="boilerRoom.ownedArea" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="addArea" label="低温">
                      <el-input v-model="boilerRoom.lowArea" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="lowArea" label="新增">
                      <el-input v-model="boilerRoom.addArea" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="lowArea" label="室温">
                      <el-input v-model="boilerRoom.standardRoomTemp" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span style="font-weight:bold;font-size:15px;">燃气指标（1-6月）：</span>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="gasOwnedAreaUp" label="正常单方">
                          <el-input v-model="boilerRoom.gasOwnedAreaUp" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="gasLowAreaUp" label="低温单方">
                          <el-input v-model="boilerRoom.gasLowAreaUp" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <span style="font-weight:bold;font-size:15px;">（7-12月）：</span>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="gasOwnedAreaDown" label="正常单方">
                          <el-input v-model="boilerRoom.gasOwnedAreaDown" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="gasLowAreaDown" label="低温单方">
                          <el-input v-model="boilerRoom.gasLowAreaDown" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span style="font-weight:bold;font-size:15px;">水指标（1-6月）：</span>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="waterOwnedAreaUp" label="正常单方">
                          <el-input v-model="boilerRoom.waterOwnedAreaUp" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="waterLowAreaUp" label="低温单方">
                          <el-input v-model="boilerRoom.waterLowAreaUp" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <span style="font-weight:bold;font-size:15px;">（7-12月）：</span>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="waterOwnedAreaDown" label="正常单方">
                          <el-input v-model="boilerRoom.waterOwnedAreaDown" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="waterLowAreaDown" label="低温单方">
                          <el-input v-model="boilerRoom.waterLowAreaDown" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span style="font-weight:bold;font-size:15px;">电指标（1-6月）：</span>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="powerOwnedAreaUp" label="正常单方">
                          <el-input v-model="boilerRoom.powerOwnedAreaUp" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="powerLowAreaUp" label="低温单方">
                          <el-input v-model="boilerRoom.powerLowAreaUp" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <span style="font-weight:bold;font-size:15px;">（7-12月）：</span>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="powerOwnedAreaDown" label="正常单方">
                          <el-input v-model="boilerRoom.powerOwnedAreaDown" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="powerLowAreaDown" label="低温单方">
                          <el-input v-model="boilerRoom.powerLowAreaDown" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span style="font-weight:bold;font-size:15px;">热量指标（1-6月）：</span>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="heatOwnedAreaUp" label="正常单方">
                          <el-input v-model="boilerRoom.heatOwnedAreaUp" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="heatLowAreaUp" label="低温单方">
                          <el-input v-model="boilerRoom.heatLowAreaUp" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <span style="font-weight:bold;font-size:15px;">（7-12月）：</span>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="heatOwnedAreaDown" label="正常单方">
                          <el-input v-model="boilerRoom.heatOwnedAreaDown" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="heatLowAreaDown" label="低温单方">
                          <el-input v-model="boilerRoom.heatLowAreaDown" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item>
                    <el-button @click="resetDevForm('boilerRoom')">取 消</el-button>
                    <el-button type="primary" @click="addDevRoom('boilerRoom')">确 定</el-button>
                  </el-form-item>
                </el-row>
              </el-form>
            </el-dialog>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统管理">
          <div class="box">
            <el-dialog
              title="添加"
              width="40%"
              :visible.sync="systemDialogVisible"
              :modal-append-to-body="true"
              :append-to-body="true"
              :before-close="handleClose"
              :close-on-click-modal="shade"
            >
              <el-form ref="from" :model="heatSystem" class="demo-form-inline" :inline="true">
                <el-form-item label="小区名称:" prop="communtityId" style="margin-left:28px;">
                  <el-select v-model="heatSystem.communtityId" size="small" style="width:92%; margin-left:3px;" clearable @change="handleSelect">
                    <el-option
                      v-for="item in communityData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="锅炉房名字:" prop="boilerRoomId" style="margin-left:12px;">
                  <el-select v-model="heatSystem.boilerRoomId" size="small" style="width:90%;margin-left:5px;" clearable @change="handleboilerName">
                    <el-option
                      v-for="item in boilerRoomData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="systemName" label="供热系统名字:">
                  <el-input v-model="heatSystem.systemName" />
                </el-form-item>
                <el-form-item prop="systemArea" label="供热系统面积:">
                  <el-input v-model="heatSystem.systemArea" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="systemDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addHeatSystem(addOrEdit,heatSystem)">确 定</el-button>
              </div>
            </el-dialog>
            <el-row>
              <el-form :inline="true" :model="heatSystem">
                <el-form-item label="小区:">
                  <t-select v-model="communtityId" style="width:200px;" :placeholder="placeSelect" :data="communityData" :select-val="communtityId" @handleSelect="handle" />
                </el-form-item>
                <el-form-item label="锅炉房:">
                  <t-select v-model="boilerRoomId" style="width:200px;" :placeholder="placeSelect" :data="boilerRoomData" :select-val="boilerRoomId" @handleSelect="handleboiler" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="systemHandleSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" size="small" @click="addHeatSystemClick()">新增</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <div class="table">
              <el-table
                ref="multipleTable"
                :data="systemTableData"
                style="width: 100%;text-align:center;"
                :header-cell-style="{
                  'background-color': '#fafafa'}"
              >
                <el-table-column
                  prop="companyName"
                  label="项目名字"
                />
                <el-table-column
                  prop="communityName"
                  label="小区名字"
                />
                <el-table-column
                  prop="boilerName"
                  label="锅炉房名字"
                />
                <el-table-column
                  prop="systemName"
                  label="系统名字"
                />
                <el-table-column
                  prop="systemArea"
                  label="系统面积"
                />
                <el-table-column
                  width="100"
                  label="编辑"
                >
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="systemEditRow(scope.$index,systemTableData )">编辑</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100"
                  label="删除"
                >
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="systemDeleteRow(scope.$index,systemTableData )">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="供暖位置管理">
          <el-row :gutter="20">
            <div class="grid-content">
              <div class="top-btn clearfix">
                <el-form :inline="true" :model="heat_formInline" class="demo-form-inline" size="small">
                  <el-form-item label="小区：">
                    <t-select v-model="heat_formInline.communityName" :data="heat_communityData" :width="150" @handleSelect="handleCommunity" />
                  </el-form-item>
                  <el-form-item label="锅炉房/换热站">
                    <t-select v-model="heat_formInline.boilerName" :data="heat_boilerRoom" :width="150" @handleSelect="heat_handleSelect" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small" @click="heat_handleSearch">搜索</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" size="small" @click="handleAdd('添加')">新增</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="table-content">
                <g-table
                  :hidden="false"
                  :table-data="heat_tableData"
                  :table-height="460"
                  :table-title-name="heat_tableTitle"
                  :total="page.total"
                  :page="page.currentPage"
                  :limit="page.pageSize"
                  @handleClick="handleBtnClick"
                  @handleCurrentChange="handleCurrentChange"
                  @handleSizeChange="handleSizeChange"
                />
                <!-- <g-table  :isPage="true" :pages="page" :tableData="heat_tableData" :tableTitleName="heat_tableTitle" @handleClick="handleBtnClick" @hadleCurrentChange="handleCurrentChange" @hadleSizeChange="handleSizeChange"></g-table> -->
              </div>
            </div>
            <!-- 添加或编辑弹框 -->
            <el-dialog
              :title="title"
              :visible.sync="heatDialogVisible"
              width="48%"
            >
              <el-form ref="ruleForm" :model="ruleForm" :rules="heat_rules" label-width="120px" class="demo-ruleForm" size="small">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="小区" prop="communityId">
                      <el-select v-model="ruleForm.communityId" style="width:100%;" @change="handleCommunitySelect">
                        <el-option
                          v-for="item in heat_communityData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="锅炉房/换热站" prop="boilerRoomId">
                      <el-select v-model="ruleForm.boilerRoomId" style="width:100%;" @change="handleBoilerSelect">
                        <el-option
                          v-for="item in heat_boilerRoom"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="系统" prop="heatStationId">
                      <el-select v-model="ruleForm.heatStationId" size="small" style="width:100%;" @change="handleSystemSelect">
                        <el-option
                          v-for="item in SystemData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="楼号" prop="buildingNum">
                      <el-input v-model="ruleForm.buildingNum" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="单元号" prop="unitNum">
                      <el-input v-model="ruleForm.unitNum" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="供暖位置" prop="position">
                      <el-input v-model="ruleForm.position" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="经度" prop="lon">
                      <el-input v-model="ruleForm.lon" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="纬度" prop="lat">
                      <el-input v-model="ruleForm.lat" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="描述" prop="remark">
                      <el-input v-model="ruleForm.remark" type="textarea" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item style="margin-top:20px;">
                  <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                  <el-button @click="heat_resetForm('ruleForm')">取消</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import Qs from 'qs'
import { getTreeDeepArr, deepCloneEs6 } from '@/utils/index'
import tSelect from '../../components/base/t-select'
import systemtCascader from '../../components/base/syncB-cascader'
import gTable from '../../components/TableBase/tablePage'
import { heatPosData } from '../../config/tableTitle/indoorTitleName'
import AddOrEditDialog from '../dataMange/components/boilerRoomAddOrEdit'
export default {
  name: 'StructureTwoManage',
  components: {
    tSelect,
    systemtCascader,
    gTable,
    AddOrEditDialog
  },
  data() {
    return {
      notClose: false,
      selectnode: {},
      titleName: '',
      formInline: {
        id: '',
        name: '',
        byname1: '',
        byname2: '',
        byname3: '',
        sort: '',
        structureTypeName: '',
        parentId: '',
        parentName: '无父级',
        user: '',
        region: '',
        lat: '',
        lon: '',
        lonLat: '',
        threeDUrl: '', // 3d地址
        ncOrg: '北京金方暖通节能技术股份有限公司', // 组织机构
        ncWarehouse: '项目库', // 项目仓库
        ncStorageroom: '', // 货位
        gdZoomlevel: ''// 地图缩放级数
      },
      selectType: [{ name: '子公司', id: '子公司' }, { name: '分组', id: '分组' }, { name: '项目', id: '项目' }],
      modules: [],
      props2: {
        // 配置父子树的属性名
        label: 'name',
        isLeaf: 'isLeaf'
        // children: 'structureTypeName'
      },
      tableData3: [],
      village: {
        structureId: '',
        boilerRoomId: '',
        name: '',
        remark: ''
      },
      dialogVisiblea: false,
      dialogVisible: false,
      dialogVisible3: false,
      multipleSelection: [],
      modulechangetype: '',
      villagetitle: '',
      selectRow: '',
      addnodeData: {},
      clickId: '',
      node: {},
      resolve: '',
      isFirst: true,
      dialogName: '', // 弹框标题
      structureId: [], // 项目
      projectList: [],
      projectId: '',
      editRowIndex: null,
      boilerRoom: {
        saveDate: '', // 时间
        ownedArea: '', // 既有面积
        addArea: '', // 新增面积
        lowArea: '', // 低温面积
        gasOwnedAreaUp: '',
        gasLowAreaUp: '',
        gasOwnedAreaDown: '',
        gasLowAreaDown: '',
        waterOwnedAreaUp: '',
        waterLowAreaUp: '',
        waterOwnedAreaDown: '',
        waterLowAreaDown: '',
        powerOwnedAreaUp: '',
        powerLowAreaUp: '',
        powerOwnedAreaDown: '',
        powerLowAreaDown: '',
        heatOwnedAreaUp: '',
        heatLowAreaUp: '',
        heatOwnedAreaDown: '',
        heatLowAreaDown: '',
        standardRoomTemp: '',
        yearPlanGasConsumption: '',
        yearPlanWaterConsumption: '',
        yearPlanPowerConsumption: '',
        yearPlanHeatConsumption: ''
      },
      loading: false,
      rules: {
        ownedArea: [
          { required: true, message: '请输入既有面积', trigger: 'blur' }
        ],
        addArea: [
          { required: true, message: '请输入新增面积', trigger: 'blur' }
        ],
        lowArea: [
          { required: true, message: '请输入低温面积', trigger: 'blur' }
        ],
        gasOwnedAreaUp: [
          { required: true, message: '请输入燃气正常单方面积（1-6月）', trigger: 'blur' }
        ],
        gasLowAreaUp: [
          { required: true, message: '请输入燃气低温单方面积（1-6月）', trigger: 'blur' }
        ],
        gasOwnedAreaDown: [
          { required: true, message: '请输入燃气正常单方面积（7-12月）', trigger: 'blur' }
        ],
        gasLowAreaDown: [
          { required: true, message: '请输入燃气低温单方面积（7-12月）', trigger: 'blur' }
        ],
        waterOwnedAreaUp: [
          { required: true, message: '请输入水正常单方面积（1-6月）', trigger: 'blur' }
        ],
        waterLowAreaUp: [
          { required: true, message: '请输入水低温单方面积（1-6月）', trigger: 'blur' }
        ],
        waterOwnedAreaDown: [
          { required: true, message: '请输入水正常单方面积（7-12月）', trigger: 'blur' }
        ],
        waterLowAreaDown: [
          { required: true, message: '请输入水低温单方面积（7-12月）', trigger: 'blur' }
        ],
        powerOwnedAreaUp: [
          { required: true, message: '请输入电正常单方面积（1-6月）', trigger: 'blur' }
        ],
        powerLowAreaUp: [
          { required: true, message: '请输入电低温单方面积（1-6月）', trigger: 'blur' }
        ],
        powerOwnedAreaDown: [
          { required: true, message: '请输入电正常单方面积（7-12月）', trigger: 'blur' }
        ],
        powerLowAreaDown: [
          { required: true, message: '请输入电低温单方面积（7-12月）', trigger: 'blur' }
        ],
        heatOwnedAreaUp: [
          { required: true, message: '请输入气正常单方面积（1-6月）', trigger: 'blur' }
        ],
        heatLowAreaUp: [
          { required: true, message: '请输入气低温单方面积（1-6月）', trigger: 'blur' }
        ],
        heatOwnedAreaDown: [
          { required: true, message: '请输入气正常单方面积（7-12月）', trigger: 'blur' }
        ],
        heatLowAreaDown: [
          { required: true, message: '请输入气低温单方面积（7-12月）', trigger: 'blur' }
        ]
      },
      boilerRoomDialog: {
        show: false, // 弹框显示隐藏
        dialogRow: {}
      },
      bolierTableData: [],
      boilersData: [],
      DevVisible: false,
      saveDate: '',
      // ---------系统----------
      radio: '小区',
      communtityId: '',
      boilerRoomId: '',
      shade: false,
      isshow: false,
      companyName: '', // 项目名字
      communityName: '', // 小区名称
      boilerName: '', // 锅炉房名字
      placeSelect: '请选择',
      communityData: [], // 小区
      boilerRoomData: [], // 锅炉房
      tableTitle: [], // 表头
      editRowData: {},
      systemEditRowIndex: -11,
      heatSystem: {
        structureId: '',
        communtityId: '',
        boilerRoomId: '',
        heatStationId: '',
        systemName: '',
        systemArea: '0'
      },
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 分页
        total: 0 // 总条数
      },
      systemTableData: [],
      systemDialogVisible: false,
      // ----------------供暖位置---------------
      placeholder: '项目名称/小区/楼号/位置查询',
      title: '', // 弹框名称,
      heatDialogVisible: false, // 弹框显示隐藏
      heat_formInline: {
        proName: '', // 项目名称
        communityName: '', // 小区
        boilerName: '' // 锅炉房/换热站
      },
      heat_structureId: '', // 项目id
      heat_boilerRoom: [], // 锅炉房
      heat_communityData: [], // 小区
      heat_tableData: [],
      heat_tableTitle: [], // 表头
      heat_page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 分页
        total: 0 // 总条数
      },
      ruleForm: {
        communityId: '', // 小区
        boilerRoomId: '', // 锅炉房
        heatStationId: '', // 系统
        buildingNum: '', // 楼号
        unitNum: '', // 单元号
        position: '', // 供暖位置
        lon: '', // 经度
        lat: '', // 纬度
        remark: ''// 描述
      },
      heat_communityName: '', // 小区
      heat_boilerName: '', // 锅炉房
      SystemData: [], // 系统
      selectedIndex: null,
      heat_rules: {
        // communityId: [{ required: true, message: '请选择小区名称', trigger: 'change' }],
        buildingNum: [{ required: true, message: '请输入楼号', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }],
        unitNum: [{ required: true, message: '请输入单元号', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }],
        position: [{ required: true, message: '请输入供暖位置', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dianame() {
      return this.$store.state.dialogname.toString()
    },
    tableData() {
      return this.tableData3
    }
  },
  mounted() {
    this.heat_tableTitle = heatPosData
  },
  created() {
    this.projectId = this.$route.query.projectId
    this.getNode()
  },
  methods: {

    closeStructure() {
      this.dialogVisible = false
      this.$refs.lonAndlat.resetFields()
    },
    add() {
      this.$refs.treekf.append(this.addnodeData, this.selectnode)
    },
    deleteRow(index, rows) {
      this.$confirm('此操作将彻底删除[' + rows[index].name + '], 确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/S-Base/deleteCommunity', Qs.stringify({ id: rows[index].id })).then(res => {
          if (res.data.success) {
            rows.splice(index, 1)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success' })
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }
        })
      })
    },
    changeVillage(type) {
      // console.log(this.selectnode.data)
      if (typeof (this.selectnode.data) === 'undefined') {
        this.$notify.error({
          title: '错误',
          message: '请选择一个项目节点！'
        })
        return
      }
      if (this.selectnode.data.structureTypeName !== '项目') {
        this.$notify.error({
          title: '错误',
          message: '请选择一个项目节点！'
        })
        return
      }
      this.village.name = ''
      this.village.remark = ''
      this.village.boilerRoomId = ''
      this.dialogVisiblea = true
      this.villagetitle = type
    },
    handleEdit(type, row) {
      this.dialogVisiblea = true
      this.selectRow = row
      this.village.name = row.name
      this.village.remark = row.remark
      this.village.boilerRoomId = row.boilerRoomId
      this.villagetitle = type
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.data.name}</span>
        </span>)
    },
    submitVillage() {
      const village = {}
      village.structureId = this.village.structureId
      village.name = this.village.name
      village.boilerRoomId = this.village.boilerRoomId
      village.remark = this.village.remark
      let url = ''
      if (this.villagetitle === '添加小区') {
        url = '/S-Base/addCommunity'
      } else {
        village.id = this.selectRow.id
        url = '/S-Base/updateCommunity'
      }
      this.$http.post(url, Qs.stringify(village)).then(res => {
        if (res.data.success) {
          if (this.villagetitle === '添加小区') {
            this.tableData3.push(res.data.data)
          } else {
            this.selectRow.name = this.village.name
            this.selectRow.boilerRoomId = this.village.boilerRoomId
            this.selectRow.remark = this.village.remark
          }
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          })
        }
      }).catch(function(err) {
        console.log(err)
      })
      this.dialogVisiblea = false
    },
    delnode() {
      this.$refs.treekf.remove(this.selectnode)
    },
    changemodule(type) {
      if (typeof (this.selectnode.data) === 'undefined') {
        if (type === '编辑架构') {
          this.$notify.error({
            title: '错误',
            message: '请选择一个节点！'
          })
          return
        }
      }
      this.dialogVisible = true
      this.modulechangetype = type
      this.titleName = type
      if (type === '编辑架构') {
        this.getEditorData()
      }
      if (type === '添加架构') {
        // this.formInline = {}
        this.formInline.name = ''
        this.formInline.byname1 = ''
        this.formInline.byname2 = ''
        this.formInline.byname3 = ''
        this.formInline.sort = ''
        this.formInline.structureTypeNam = ''
        this.formInline.lat = ''
        this.formInline.lon = ''
        this.formInline.lonLat = ''
        this.formInline.ncOrg = '北京金房暖通节能技术股份有限公司'
        this.formInline.ncWarehouse = '项目库'
        this.formInline.ncStorageroom = ''
        this.formInline.threeDUrl = ''
        this.formInline.gdZoomlevel = ''
      }
    },
    test(view) {
      this.formInline.viewtype = view.id
    },
    test2(modeltype) {
      this.formInline.moduletype = modeltype.id
    },
    /**
     * 点击树节点
     */
    handleNodeClick(data, node, child) {
      this.clickId = data.id
      this.getEditorData()
      this.selectnode = node
      if (data.structureTypeName === '项目') {
        this.village.structureId = data.id
        this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: data.id })).then(res => {
          this.tableData3 = res.data.data
        })
        this.getTableData()
        this.companyName = data.name
        this.heatSystem.structureId = data.id
        this.getBoilerRoom(data.id)
        this.getCommunityData(data.id)
        this.systemHandleSearch()
        this.heat_formInline.proName = data.name
        this.heat_structureId = data.id
        this.heat_getCommunityData(data.id)
        this.heat_getBoilerRoom(data.id)
        this.heat_handleSearch()
      } else {
        this.tableData3 = []
      }
    },
    /**
     * 编辑查询
     */
    getEditorData() {
      const id = this.clickId
      this.$http.post(`S-Base/getCompanyStructureById?id=${id}`, Qs.stringify(id)).then(res => {
        if (res.data.success) {
          this.formInline.name = res.data.data.name
          this.formInline.byname1 = res.data.data.beforeNameOne
          this.formInline.byname2 = res.data.data.beforeNameTwo
          this.formInline.byname3 = res.data.data.beforeNameThree
          this.formInline.sort = res.data.data.orderBy
          this.formInline.structureTypeName = res.data.data.structureTypeName
          this.formInline.ncOrg = res.data.data.ncOrg
          this.formInline.ncWarehouse = res.data.data.ncWarehouse
          this.formInline.ncStorageroom = res.data.data.ncStorageroom
          this.formInline.lon = res.data.data.lon
          this.formInline.lat = res.data.data.lat
          this.formInline.threeDUrl = res.data.data.threeDUrl
          this.formInline.gdZoomlevel = res.data.data.gdZoomlevel
          if (res.data.data.lon !== null) {
            this.formInline.lonLat = res.data.data.lon + ',' + res.data.data.lat
          }
        }
      }).catch(function(err) {
        console.log(err)
      })
    },
    /**
     * 点击确定
     */
    sunbmitStructure() {
      if (typeof (this.selectnode.data) === 'undefined') {
        const structure = {}
        structure.name = this.formInline.name
        structure.beforeNameOne = this.formInline.byname1
        structure.beforeNameTwo = this.formInline.byname2
        structure.beforeNameThree = this.formInline.byname3
        structure.orderBy = this.formInline.sort
        structure.structureTypeName = this.formInline.structureTypeName
        structure.shortName = ''
        structure.parentId = 0
        var result = this.formInline.lonLat.split(',')
        structure.lat = result[1]
        structure.lon = result[0]
        structure.ncOrg = this.formInline.ncOrg
        structure.ncWarehouse = this.formInline.ncWarehouse
        structure.ncStorageroom = this.formInline.ncStorageroom
        structure.threeDUrl = this.formInline.threeDUrl
        structure.gdZoomlevel = this.formInline.gdZoomlevel
        let url = ''
        if (this.modulechangetype === '添加架构') {
          url = '/S-Base/addCompanyStructure'
        }
        this.$http.post(url, Qs.stringify(structure)).then(res => {
          if (res.data.success) {
            this.addnodeData = res.data.data
            this.add()
            this.node.childNodes = []
            this.loadNode(this.node, this.resolve)
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }
        }).catch(function(err) {
          console.log(err)
        })
      } else {
        if (this.modulechangetype === '添加架构' && this.selectnode.data.structureTypeName === '项目') {
          this.$notify.error({
            title: '错误',
            message: '不能在类型【项目】下添加'
          })
        }
        const structure = {}
        structure.name = this.formInline.name
        structure.beforeNameOne = this.formInline.byname1
        structure.beforeNameTwo = this.formInline.byname2
        structure.beforeNameThree = this.formInline.byname3
        structure.orderBy = this.formInline.sort
        structure.structureTypeName = this.formInline.structureTypeName
        var result1 = this.formInline.lonLat.split(',')
        structure.lat = result1[1]
        structure.shortName = 22
        structure.lon = result1[0]
        structure.ncOrg = this.formInline.ncOrg
        structure.ncWarehouse = this.formInline.ncWarehouse
        structure.ncStorageroom = this.formInline.ncStorageroom
        structure.threeDUrl = this.formInline.threeDUrl
        structure.gdZoomlevel = this.formInline.gdZoomlevel
        let url = ''
        if (this.modulechangetype === '添加架构') {
          url = '/S-Base/addCompanyStructure'
          if (this.selectnode === '') { structure.parentId = 0 } else { structure.parentId = this.selectnode.data.id }
        } else { // 编辑架构
          url = '/S-Base/updateCompanyStructure'
          structure.id = this.selectnode.data.id
        }
        this.$http.post(url, Qs.stringify(structure)).then(res => {
          if (res.data.success) {
            this.addnodeData = res.data.data
            if (this.modulechangetype === '添加架构') {
              this.add()
            }
            if (this.modulechangetype === '编辑架构') {
              this.selectnode.data.name = res.data.data.name
              this.getEditorData()
            }
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.node.childNodes = []
            this.loadNode(this.node, this.resolve)
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }
        }).catch(function(err) {
          console.log(err)
        })
      }
      this.addnodeData = {}
      this.formInline.byname1 = ''
      this.formInline.byname2 = ''
      this.formInline.byname3 = ''
      this.formInline.sort = ''
      this.formInline.name = ''
      this.formInline.structureTypeName = ''
      this.formInline.lat = ''
      this.formInline.lon = ''
      this.formInline.lonLat = ''
      this.formInline.ncStorageroom = ''
      this.formInline.threeDUrl = ''
      this.formInline.gdZoomlevel = ''
      this.dialogVisible = false
    },
    delModule() {
      if (this.selectnode.childNodes.length !== 0) {
        this.$notify.error({
          title: '错误',
          message: '请先删除子节点' })
      } else {
        this.$http.post('/S-Base/deleteCompanyStructure', Qs.stringify({ id: this.selectnode.data.id })).then(res => {
          if (res.data.success) {
            this.delnode()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }
        }).catch(function(err) {
          console.log(err)
        })
      }
      this.dialogVisible3 = false
    },
    structureTypeName(data, node) {
      if (data.structureTypeName === 0) {
        node.isLeaf(true, node)
      } else {
        node.isLeaf(false, node)
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // handleSelectionChange (val) {
    //   this.multipleSelection = val
    // },
    changedialogVisible(name) {
      this.$store.commit('changedialog')
      this.$store.commit('changediaName', name)
    },
    handleClose3(done) {
      done()
    },
    loadNode(node, resolve) {
      if (this.isFirst) {
        this.node = node
        this.resolve = resolve
        this.isFirst = false
      }
      if (node.level === 0) {
        this.getTreeData(0, resolve)
      } else {
        this.getTreeData(node.data.id, resolve)
      }
    },
    getTreeData(id, resolve) {
      this.$http.post('/S-Base/getStructureByParentID', Qs.stringify({ parentId: id })).then(res => {
        if (res.data.success) {
          for (let i = 0; i < res.data.data.length; i++) {
            const flag = res.data.data[i].structureTypeName === '项目'
            this.$set(res.data.data[i], 'isLeaf', flag)
          }
          resolve(res.data.data)
        }
      }).catch(function(err) {
        console.log(err)
      })
    },
    // ----------------------------锅炉房-----------------------------
    getNode() {
      this.$http.post('/S-Base/getCompanyStructureByRoleTreeJson')
        .then(res => {
          if (res.data.success) {
            this.projectList = res.data.data
            if (this.projectId !== undefined) {
              this.structureId = getTreeDeepArr(this.projectId, this.projectList)
            }
          }
        })
    },
    /** 编辑设备 */
    editDevRow(index, rows) {
      // console.log(rows, 'ahah')
      this.DevVisible = true
      this.dialogName = '编辑'
      this.editRowIndex = index
      // this.boilerRoom = Object.assign({}, rows)
      this.boilerRoom.id = rows.id
      this.boilerRoom.name = rows.name
      this.boilerRoom.meteorological = rows.meteorological
      this.boilerRoom.remark = rows.remark
      this.boilerRoom.lowArea = rows.lowArea
      this.boilerRoom.addArea = rows.addArea
      this.boilerRoom.ownedArea = rows.ownedArea
      this.boilerRoom.gasOwnedAreaUp = rows.gasOwnedAreaUp
      this.boilerRoom.gasLowAreaUp = rows.gasLowAreaUp
      this.boilerRoom.gasOwnedAreaDown = rows.gasOwnedAreaDown
      this.boilerRoom.gasLowAreaDown = rows.gasLowAreaDown
      this.boilerRoom.waterOwnedAreaUp = rows.waterOwnedAreaUp
      this.boilerRoom.waterLowAreaUp = rows.waterLowAreaUp
      this.boilerRoom.waterOwnedAreaDown = rows.waterOwnedAreaDown
      this.boilerRoom.waterLowAreaDown = rows.waterLowAreaDown
      this.boilerRoom.powerOwnedAreaUp = rows.powerOwnedAreaUp
      this.boilerRoom.powerLowAreaUp = rows.powerLowAreaUp
      this.boilerRoom.powerOwnedAreaDown = rows.powerOwnedAreaDown
      this.boilerRoom.powerLowAreaDown = rows.powerLowAreaDown
      this.boilerRoom.heatOwnedAreaUp = rows.heatOwnedAreaUp
      this.boilerRoom.heatLowAreaUp = rows.heatLowAreaUp
      this.boilerRoom.heatOwnedAreaDown = rows.heatOwnedAreaDown
      this.boilerRoom.heatLowAreaDown = rows.heatLowAreaDown
      this.boilerRoom.standardRoomTemp = rows.standardRoomTemp
      this.saveDate = rows.saveDate
      this.boilerRoom.yearPlanGasConsumption = rows.yearPlanGasConsumption
      this.boilerRoom.yearPlanWaterConsumption = rows.yearPlanWaterConsumption
      this.boilerRoom.yearPlanPowerConsumption = rows.yearPlanPowerConsumption
      this.boilerRoom.yearPlanHeatConsumption = rows.yearPlanHeatConsumption
    },
    /** 编辑设备确定 */
    addDevRoom(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/S-Base/updateBoilerRoom', Qs.stringify(this.boilerRoom)).then(res => {
            const data = res.data.data
            data.saveDate = this.saveDate
            this.$set(this.bolierTableData, this.editRowIndex, data)
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            })
            this.DevVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /** 取消编辑 */
    resetDevForm(formName) {
      this.$refs[formName].resetFields()
      this.DevVisible = false
    },
    /** 删除 */
    boilerDeleteRow(index, rows) {
      this.$confirm('此操作将彻底删除[' + rows[index].name + '], 确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/S-Base/delBoilerRoom', {
          params: {
            id: rows[index].id
          }
        }).then(response => {
          if (response.data.success) {
            rows.splice(index, 1)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          }
        })
      })
    },
    /** 编辑 */
    editRow(index, rows) {
      this.boilerRoomDialog.dialogRow = { ...rows }
      this.addBoilerRoomClick('编辑')
    },
    /** 添加 锅炉房 */
    addBoilerRoomClick(type) {
      if (type === 'add') {
        if (this.clickId.length === 0) {
          return this.$message({
            message: '警告，请选择项目',
            type: 'warning'
          })
        }
      }
      this.$store.commit('setBoilerRoomDialog', type)
      this.boilerRoomDialog.show = true
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.boilerRoomDialog.show = false
    },
    /**
     * 搜索查询
     */
    handleSearch() {
      if (this.clickId.length === 0) {
        this.$notify({
          title: '请选择查询内容',
          type: 'error'
        })
      } else {
        this.getTableData()
      }
    },
    /**
     * 根据项目id查询锅炉房表格数据
     */
    getTableData(params) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: this.clickId })).then(res => {
        this.bolierTableData = res.data.data
      })
    },
    // -----------------系统----------------
    showToggle() {
      this.isShow = !this.isShow
      if (this.isShow) {
        this.radio = '小区'
      } else {
        this.radio = '锅炉房'
      }
    },
    /**
     * 分页点击上一页
     */
    prevClick(val) {
      const item = this.systemTableData[this.systemTableData.length - 1]
      const params = { id: item.id, pageNo: val, pageSize: this.pageSize }
      this.ststemGetTableData(params)
    },
    /**
     * 分页点击下一页
     */
    nextClick(val) {
      const item = this.systemTableData[this.systemTableData.length - 1]
      const params = { id: item.id, pageNo: val, pageSize: this.pageSize }
      this.ststemGetTableData(params)
    },
    getCommunityData(id) {
      this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: id })).then(res => {
        const data = res.data.data
        const arr = []
        for (const i in data) {
          const obj = { label: data[i].name, value: data[i].id }
          arr.push(obj)
        }
        this.communityData = arr
      })
    },
    /**
     * 添加修改获取小区名称和id
     */
    handleSelect(val) {
      if (val === '' || val === undefined || val === null) {
        this.heatSystem.communtityId = val
      } else {
        let obj = {}
        obj = this.communityData.find(item => {
          return item.value === val
        })
        this.communityName = obj.label
        this.heatSystem.communtityId = obj.value
      }
    },
    // 查询获取小区id
    handle(val) {
      if (val === '' || val === undefined || val === null) {
        this.communtityId = val
      } else {
        this.communtityId = val
      }
    },

    getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        if (res.data.success) {
          const data = res.data.data
          const arr = []
          for (const i in data) {
            const obj = { label: data[i].name, value: data[i].id }
            arr.push(obj)
          }
          this.boilerRoomData = arr
        }
      })
    },

    /**
     * 添加获取获取锅炉房名称和id
     */
    handleboilerName(val) {
      if (val === '' || val === undefined || val === null) {
        this.heatSystem.boilerRoomId = val
      } else {
        let obj = {}
        obj = this.boilerRoomData.find((item) => {
          return item.value === val
        })
        this.boilerName = obj.label
        this.heatSystem.boilerRoomId = obj.value
      }
    },
    // 查询获取锅炉房的id
    handleboiler(val) {
      if (val === '' || val === undefined || val === null) {
        this.boilerRoomId = val
      } else {
        this.boilerRoomId = val
      }
    },
    handleClose(done) {
      this.systemDialogVisible = false
    },

    systemDeleteRow(index, rows) {
      const _this = this
      this.$confirm('此操作将彻底删除用户[' + rows[index].systemName + '], 确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/S-Base/delHeatSystem', {
          params: {
            id: rows[index].id
          }
        })
          .then(function(response) {
            if (response.data.success) {
              rows.splice(index, 1)
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
            }
          })
      })
    },

    systemEditRow(index, rows) {
      this.addOrEdit = rows[index].id
      this.systemEditRowIndex = index
      this.editRowData = rows[index]
      this.heatSystem = deepCloneEs6(rows[index])
      this.systemDialogVisible = true
    },
    addHeatSystemClick() {
      if (this.companyName === '') {
        this.$message({
          message: '请选择项目',
          type: 'warning'
        })
      } else {
        this.addOrEdit = 'add'
        this.heatSystem.structureId = this.heatSystem.structureId
        this.heatSystem.communtityId = ''
        this.heatSystem.boilerRoomId = ''
        this.communityName = ''
        this.boilerName = ''
        this.heatSystem.systemName = ''
        this.heatSystem.systemArea = ''
        this.systemDialogVisible = true
      }
    },
    addHeatSystem(addOrEdit, from) {
      this.$refs.from.validate((valid) => {
        if (valid) {
          var _this = this
          if (addOrEdit === 'add') {
            this.$http.get('/S-Base/addHeatSystem', {
              params: {
                structureId: this.heatSystem.structureId,
                communtityId: this.heatSystem.communtityId,
                boilerRoomId: this.heatSystem.boilerRoomId,
                systemName: this.heatSystem.systemName,
                systemArea: this.heatSystem.systemArea
              }
            })
              .then(function(response) {
                if (response.data.success) {
                  const data = response.data.data
                  data.companyName = _this.companyName
                  if (data.communtityId === '' || data.communtityId === undefined || data.communtityId === null) {
                    data.communityName = null
                  } else {
                    data.communityName = _this.communityName
                  }
                  if (data.boilerRoomId === '' || data.boilerRoomId === undefined || data.boilerRoomId === null) {
                    data.boilerName = null
                  } else {
                    data.boilerName = _this.boilerName
                  }
                  _this.systemTableData.push(data)
                  _this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success'
                  })
                  _this.systemDialogVisible = false
                } else {
                  _this.$notify({
                    title: '添加失败',
                    message: response.data.msg,
                    type: 'error'
                  })
                }
              })
          } else {
            this.$http.get('/S-Base/updateHeatSystem', {
              params: {
                id: this.addOrEdit,
                structureId: this.heatSystem.structureId,
                communtityId: this.heatSystem.communtityId,
                boilerRoomId: this.heatSystem.boilerRoomId,
                systemName: this.heatSystem.systemName,
                systemArea: this.heatSystem.systemArea
              }
            }).then(function(response) {
              if (response.data.success) {
                const data = response.data.data
                if (data.communtityId === '' || data.communtityId === undefined || data.communtityId === null) {
                  _this.editRowData.communityName = null
                  _this.editRowData.communtityId = null
                } else {
                  if (_this.editRowData.communityName === null) {
                    _this.editRowData.communityName = _this.communityName
                  }
                  _this.editRowData.communtityId = _this.heatSystem.communtityId
                }
                if (data.boilerRoomId === '' || data.boilerRoomId === undefined || data.boilerRoomId === null) {
                  _this.editRowData.boilerName = null
                  _this.editRowData.boilerRoomId = null
                } else {
                  if (_this.editRowData.boilerName === null) {
                    _this.editRowData.boilerName = _this.boilerName
                  }
                  _this.editRowData.boilerRoomId = _this.heatSystem.boilerRoomId
                }
                _this.editRowData.companyName = _this.companyName
                _this.editRowData.id = _this.addOrEdit
                _this.editRowData.structureId = _this.heatSystem.structureId
                _this.editRowData.systemName = _this.heatSystem.systemName
                _this.editRowData.systemArea = _this.heatSystem.systemArea
                _this.$set(_this.systemTableData, _this.editRowData, data)
                _this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                })
                _this.systemDialogVisible = false
              } else {
                _this.$notify({
                  title: '修改失败',
                  message: response.data.msg,
                  type: 'error'
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 搜索查询
     */
    systemHandleSearch() {
      const params = {
        structureId: this.heatSystem.structureId,
        communtityId: this.communtityId,
        boilerRoomId: this.boilerRoomId,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      this.ststemGetTableData(params)
    },
    ststemGetTableData(params) {
      var _this = this
      if (this.heatSystem.structureId === null || this.heatSystem.structureId === '') {
        _this.$notify({
          title: '请选择项目',
          type: 'error'
        })
      } else {
        this.$http.post('/S-Base/getByHeatSystem', Qs.stringify(params)).then(res => {
          this.systemTableData = res.data.data.list
        })
      }
    },
    // ------- 供暖位置----------
    /**
     * 获取项目名称
     */
    handleItemChange(id, val) {
      const item = val[val.length - 1]
      this.heat_formInline.proName = item.name
      this.heat_structureId = item.id
      this.heat_getCommunityData(item.id)
      this.heat_getBoilerRoom(item.id)
    },
    heat_getBoilerRoom(id) {
      this.$http.post('/S-Base/selectByBoilerRoom', Qs.stringify({ structureId: id })).then(res => {
        if (res.data.success) {
          const data = res.data.data
          const arr = []
          for (const i in data) {
            const obj = { label: data[i].name, value: data[i].id }
            arr.push(obj)
          }
          this.heat_boilerRoom = arr
        }
      })
    },
    /** 获取小区 */
    handleCommunity(val) {
      this.heat_formInline.communityName = val
    },
    // 弹框获取小区
    handleCommunitySelect(val) {
      this.ruleForm.communityId = val
      let obj = {}
      obj = this.heat_communityData.find(item => {
        return item.value === val
      })
      this.heat_communityName = obj.label
    },
    heat_getCommunityData(id) {
      this.$http.post('/S-Base/getCommunityByStructureId', Qs.stringify({ structureId: id })).then(res => {
        const data = res.data.data
        const arr = []
        for (const i in data) {
          const obj = { label: data[i].name, value: data[i].id }
          arr.push(obj)
        }
        this.heat_communityData = arr
      })
    },
    /**
     * 获取锅炉房名称
     */
    heat_handleSelect(val) {
      this.heat_formInline.boilerName = val
    },
    /**
     * 弹框获取锅炉房id
     */
    handleBoilerSelect(val) {
      this.ruleForm.boilerRoomId = val
      let obj = {}
      obj = this.heat_boilerRoom.find(item => {
        return item.value === val
      })
      this.heat_boilerName = obj.label
    },
    /**
     * 搜索查询
     */
    heat_handleSearch() {
      if (this.clickId.length === 0) {
        this.$message({
          message: '请选择项目名称',
          type: 'warning'
        })
      } else {
        const params = {
          structureId: this.clickId,
          communityId: this.heat_formInline.communityName,
          boilerRoomId: this.heat_formInline.boilerName,
          pageNo: this.heat_page.currentPage,
          pageSize: this.heat_page.pageSize
        }
        this.heat_getTableData(params)
      }
    },
    /**
     * 查询分页数据
     */
    heat_getTableData(params) {
      this.$http.post('/S-Base/selectByHeatingPosition', Qs.stringify(params)).then(res => {
        this.heat_tableData = res.data.data.list
        this.heat_page.total = res.data.data.total
      })
    },
    /**
     * 获取系统值
     */
    handleSystemSelect(val) {
      this.ruleForm.heatStationId = val
    },
    /**
     * 当前页发生改变
     */
    handleCurrentChange(val) {
      const params = {
        structureId: this.heat_structureId,
        boilerRoomId: this.heat_formInline.boilerName,
        pageNo: val,
        pageSize: this.heat_page.pageSize
      }
      this.heat_getTableData(params)
    },
    /**
     * 页码发生改变
     */
    handleSizeChange(val) {
      const params = {
        structureId: this.heat_structureId,
        boilerRoomId: this.heat_formInline.boilerName,
        pageNo: this.heat_page.currentPage,
        pageSize: val
      }
      this.heat_getTableData(params)
    },
    /**
     * 添加
     */
    handleAdd(val) {
      if (this.heat_formInline.proName === '') {
        this.$message({
          message: '请选择项目名称',
          type: 'warning'
        })
      } else {
        this.title = val
        this.ruleForm = {}
        this.heatDialogVisible = true
      }
    },
    /**
     * 表格编辑或删除
     */
    handleBtnClick(index, row, data, name) {
      if (name === '编辑') {
        this.title = '编辑'
        this.selectedIndex = index
        // this.ruleForm = Object.assign({}, row)
        this.heat_formInline.proName = row.companyName
        this.heatDialogVisible = true
        this.ruleForm.structureId = row.structureId
        this.ruleForm.boilerRoomId = row.boilerRoomId
        this.ruleForm.communityId = row.communityId
        this.heat_communityName = row.communityName
        this.heat_boilerName = row.boilerName
        this.ruleForm.buildingNum = row.buildingNum
        this.ruleForm.heatStationId = row.heatStationId
        this.ruleForm.unitNum = row.unitNum
        this.ruleForm.lon = row.lon
        this.ruleForm.lat = row.lat
        this.ruleForm.position = row.position
        this.ruleForm.remark = row.remark
        this.ruleForm.id = row.id
      } else { // 删除
        this.handleDelete(index, row, data)
      }
    },
    /**
     * 删除
     */
    handleDelete(index, row, data) {
      this.$confirm('确认删除此项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/S-Base/delByHeatingPosition', Qs.stringify({ id: data[index].id })).then(res => {
          if (res.data.success) {
            data.splice(index, 1)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          }
        })
      })
    },
    /**
     * 确定
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.structureId = this.heat_structureId
          if (this.ruleForm.id) { // 编辑
            this.$http.post('/S-Base/updateByHeatingPosition', Qs.stringify(this.ruleForm)).then(res => {
              if (res.data.success) {
                const data = res.data.data
                data.communityName = this.heat_communityName
                data.boilerName = this.heat_boilerName
                data.companyName = this.heat_formInline.proName
                this.$set(this.heat_tableData, this.selectedIndex, data)
                this.heatDialogVisible = false
              }
            })
          } else {
            // 添加
            this.$http.post('/S-Base/addByHeatingPosition', Qs.stringify(this.ruleForm)).then(res => {
              if (res.data.success) {
                const data = res.data.data
                data.communityName = this.heat_communityName
                data.boilerName = this.heat_boilerName
                data.companyName = this.heat_formInline.proName
                this.heat_tableData.push(data)
                this.heatDialogVisible = false
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 取消
     */
    heat_resetForm(formName) {
      this.$refs[formName].resetFields()
      this.heatDialogVisible = false
    }
  }
}
</script>
<style scoped>
.wrap {
  min-height:810px;
  height: 100%;
  display: flex;
  padding: 5px 0;
  background-color: #e9eef3;;
  justify-content: space-around;
}
.el-button-group {
  margin: 20px 8px
}

</style>
