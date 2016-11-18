<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
    <link href='<c:url value="/lib/Gantt/scripts/miniui/themes/icons.css"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/lib/Gantt/scripts/miniui/themes/default/miniui.css"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/lib/Gantt/scripts/miniui/themes/gray/skin.css"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/lib/Gantt/css/core.css"/>' rel="stylesheet" type="text/css"/>
    <script src='<c:url value="/lib/Gantt/scripts/miniui/miniui.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/Gantt/scripts/miniui/locale/zh_CN.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/task/ganttJS/ProjectMenu.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/task/ganttJS/TableColumns.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/task/ganttJS/TaskWindow.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/task/ganttJS/services.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/Gantt/scripts/ThirdLibs/swfobject/swfobject.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/task/taskDetail.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/task/taskDetailUtil.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
    <div id="mainWrapperDiv">
        <div id="layout">
            <div position="left" title="查询">
                <div style="overflow-x: hidden; overflow-y: auto; width: 100%;position: relative;" id="divTreeArea">
                    <%-- <div style="padding: 5px;padding-top:3px;">
                         <div class="row" style="margin-bottom:5px;line-height:25px;">
                               关键字&nbsp;:
                            <div class="ui-grid-query-div" style="width:70px;margin-top:0px;position:relative;left:-20px;">
                                     <input type="text" class="ui-grid-query-input" id="ui-grid-query-input" style="position:relative;"/>
                                     <span class="ui-grid-query-button" id="ui-grid-query-button" title="查询" style="left:88px;position:relative;top:-17px"></span>
                            </div>
                        </div>
                        <div class="row" id="queryTaskStatusDiv">
                             <x:radioL list="#{'0':'执行中','1':'已完成','2':'已中止','-10':'全部'}" name="taskStatus"  value="0" label="计划状态"/>
                        </div>
                        <div class="row" id="queryDateRangeDiv" style="display:none;">
                             <x:radioL list="#{'6':'本月','7':'上月','8':'今年','9':'去年'}" name="queryDateRange"  value="6" label="计划开始时间"/>
                        </div>
                     </div> --%>
                    <x:title title="综合计划" name="group" id="myselfTaskTitle" hideTable="#myselfTaskSearch"/>
                    <div style="width: 97%;margin-left:3px; background-color: #fafafa; border: #d0d0d0 1px solid;"
                         id="myselfTaskSearch">
                        <div class="taskCenterSearch" queryKind="1" style="border: 0px;">
                            <span class="ui-icon-query" style="margin-right: 2px;"></span>我管理的计划
                        </div>
                        <div class="taskCenterSearch taskCenterChoose" queryKind="2" style="border: 0px;">
                            <span class="ui-icon-next" style="margin-right: 2px;"></span>我负责的计划
                        </div>
                        <div class="taskCenterSearch" queryKind="3" style="border: 0px;">
                            <span class="ui-icon-last" style="margin-right: 2px;"></span>需要我执行的计划
                        </div>
                        <div class="taskCenterSearch" queryKind="41" style="border: 0px;">
                            <span class="ui-icon-query" style="margin-right: 2px;"></span>中心责任计划
                        </div>
                        <div class="taskCenterSearch" queryKind="42" style="border: 0px;">
                            <span class="ui-icon-query" style="margin-right: 2px;"></span>中心管理计划
                        </div>
                        <div class="taskCenterSearch" queryKind="4" style="border: 0px;">
                            <span class="ui-icon-query" style="margin-right: 2px;"></span>我中心的计划
                        </div>
                        <div class="taskCenterSearch" queryKind="5" style="border: 0px;">
                            <span class="ui-icon-next" style="margin-right: 2px;"></span>我关注的计划
                        </div>
                        <div style="display: none;border-top: #d0d0d0 1px solid;" id="shortcutSearch"></div>
                    </div>
                    <x:title title="个人计划" name="group" id="IndividualTaskTitle" hideTable="#IndividualTaskSearch"/>
                    <div style="width: 97%;margin-left:3px; background-color: #fafafa; border: #d0d0d0 1px solid;"
                         id="IndividualTaskSearch">
                        <div class="taskCenterSearch" queryKind="1" style="border: 0px;">
                            <span class="ui-icon-query" style="margin-right: 2px;"></span>我管理的个人计划
                        </div>
                        <div class="taskCenterSearch" queryKind="2" style="border: 0px;">
                            <span class="ui-icon-next" style="margin-right: 2px;"></span>我负责的个人计划
                        </div>
                        <div class="taskCenterSearch" queryKind="3" style="border: 0px;">
                            <span class="ui-icon-last" style="margin-right: 2px;"></span>我执行的个人计划
                        </div>
                        <div class="taskCenterSearch" queryKind="41" style="border: 0px;">
                            <span class="ui-icon-query" style="margin-right: 2px;"></span>中心个人责任计划
                        </div>
                        <div class="taskCenterSearch" queryKind="42" style="border: 0px;">
                            <span class="ui-icon-query" style="margin-right: 2px;"></span>中心个人管理计划
                        </div>
                        <div class="taskCenterSearch" queryKind="4" style="border: 0px;">
                            <span class="ui-icon-query" style="margin-right: 2px;"></span>我中心的个人计划
                        </div>
                        <div class="taskCenterSearch" queryKind="5" style="border: 0px;">
                            <span class="ui-icon-next" style="margin-right: 2px;"></span>我关注的个人计划
                        </div>
                        <div style="display: none;border-top: #d0d0d0 1px solid;" id="shortcutSearch"></div>
                    </div>
                    <x:title id="myManagerTaskTitle" title="相关计划" name="group" hideTable="#myManagerTaskSearch"/>
                    <div style="width: 97%;margin-left:3px; background-color: #fafafa;" id="myManagerTaskSearch">
                        <div style="overflow-x: hidden; overflow-y: auto; "
                             id="divTreeArea">
                            <ul id="orgTree">
                            </ul>
                        </div>
                    </div>
                    <x:title id="mySpecialTaskTitle" title="专项计划" name="group" hideTable="#mySpecialTaskSearch"/>
                    <div style="width: 97%;margin-left:3px; background-color: #fafafa;" id="mySpecialTaskSearch">
                        <div style="overflow-x: hidden; overflow-y: auto; "
                             id="specialArea">
                            <ul id="specialList">
                            </ul>
                        </div>
                    </div>
                    <x:title title="高级搜索" hideTable="#divConditionArea" id="titleConditionArea"/>
                    <form method="post" action="" id="queryMainForm">
                        <div style="padding: 3px 0px  0px 10px;" id="divConditionArea">
                            <div class="row" style="padding-bottom:5px;">
                                <x:selectL name="dateRange" id="selectDateRange" list="dateRangeList"
                                           emptyOption="false" label="计划开始日期范围" width="180"/>
                            </div>
                            <div id="customDataRange" class="row" style="display: none;">
                                <x:inputL name="startDate" id="editStartDate" required="false" label="上线开始日期"
                                          wrapper="date" width="180"/>
                                <x:inputL name="endDate" id="editEndDate" required="false" label="上线结束日期" wrapper="date"
                                          width="180"/>
                            </div>
                            <div class="row" style="padding-bottom:5px;">
                                <x:selectL name="endDateRange" id="selectEndDateRange" list="dateRangeList"
                                           emptyOption="false" label="计划完成日期范围" width="180"/>
                            </div>
                            <div id="customEndDataRange" class="row" style="display: none;">
                                <x:inputL name="endStartDate" required="false" label="完成开始日期" wrapper="date"
                                          width="180"/>
                                <x:inputL name="endEndDate" required="false" label="完成结束日期" wrapper="date" width="180"/>
                            </div>
                            <div class="row" id="queryTaskStatusDiv">
                                <x:selectL name="taskStatus" id="taskStatus"
                                           list="#{'0':'执行中','1':'已完成','2':'已中止','3':'未完','-10':'全部'}"
                                           emptyOption="false" label="计划状态" width="180"/>
                            </div>
                            <div class="row" style="padding-bottom:5px; ">
                                <x:selectL name="taskLevelKind" id="mainTaskLevelKind" list="taskLevelKind" label="计划级别"
                                           width="180"/>
                            </div>
                            <div class="row" style="padding-bottom:5px; ">
                                <x:hidden name="taskKindId" id="selectViewTaskKindId"/>
                                <x:inputL name="taskKindNmae" id="selectViewTaskKind" required="false" label="计划分类"
                                          width="180" wrapper="tree"/>
                            </div>
                            <div class="row" style="padding-bottom:5px; ">
                                <x:inputL name="keywords" required="false" label="关键字" readonly="false" width="180"/>
                            </div>
                            <div class="row">
                                <x:button value="查 询" id="btnQuery" onclick="doQueryList(this.form,true)"/>
                                <%-- <x:button value="保存查询方案" id="btnQuery" onclick="saveQueryScheme(this.form)" /> --%>
                            </div>
                            <div class="row">&nbsp;</div>
                        </div>
                    </form>
                </div>
            </div>
            <div position="center" style="border:0px;">
                <x:select name="taskReportingWork" cssStyle="display:none;" id="mainTaskReportingWork"
                          emptyOption="false"/>
                <div class="mini-toolbar" style="border-bottom: 0;" id="opToolbar">
                    <a class="mini-button" plain="true" iconcls="icon-reload" onclick="load()">刷新</a>
                    <a class="mini-button" plain="true" iconcls="icon-goto" onclick="showViewTask()">查看</a>
                    <a class="mini-button" plain="true" iconcls="icon-download" onclick="exportExcel()">导出</a>
                    <span class="separator"></span>
                    <a id="toolbar_menuAdd" class="mini-button" plain="true" iconcls="icon-add"
                       onclick="addPlan()">新增计划</a>
                    <a class="mini-button" plain="true" iconcls="icon-edit" onclick="applyEdit()">调整计划</a>
                    <a class="mini-button" plain="true" iconcls="icon-expand" onclick="progressReporting()">汇报进度</a>
                    <a class="mini-button" plain="true" iconcls="icon-node" onclick="showProgressReport()">汇报历史</a>
                    <span class="separator"></span>
                    <a class="mini-button" plain="true" iconcls="icon-lock" onclick="showGanttView()"
                       id="showGanttView">显示条形图</a>
                    <a class="mini-button" plain="true" iconcls="icon-unlock" onclick="hideGanttView()"
                       id="hideGanttView">隐藏条形图</a>
                    <a class="mini-button" plain="true" iconcls="icon-zoomin" onclick="zoomIn()" id="zoomIn">放大</a>
                    <a class="mini-button" plain="true" iconcls="icon-zoomout" onclick="zoomOut()" id="zoomOut">缩小</a>
                    <span class="separator"></span>
                </div>
                <!-- <div class="mini-toolbar" style="border-bottom: 0;display:none;" id="miniToolbar">
                    <a class="mini-button" plain="true" iconcls="icon-save" onclick="save()">保存</a>
                    <a class="mini-button" plain="true" iconcls="icon-undo" onclick="backView()">返回</a>
                    <span class="separator"></span>
                    <a class="mini-button" plain="true" iconcls="icon-add" onclick="addTask()" id="addTaskButton">增加</a>
                    <a class="mini-button" plain="true" iconcls="icon-node" onclick="updateTask()">任务面板</a>
                    <a class="mini-button" plain="true" iconcls="icon-edit" onclick="updateToPlan()">提升为计划</a>
                    <a class="mini-button" plain="true" iconcls="icon-remove" onclick="removeTask()">删除</a>
                    <span class="separator"></span>
                    <a class="mini-button" plain="true" iconcls="icon-upgrade" onclick="upgradeTask()">升级</a>
                    <a class="mini-button" plain="true" iconcls="icon-downgrade" onclick="downgradeTask()">降级</a>
                    <span class="separator"></span>
                    <a class="mini-button" plain="true" iconcls="icon-lock" onclick="onLockClick()" checkonclick="true">锁定列</a>
                    <span class="separator"></span>
                    <a class="mini-button" plain="true" iconcls="icon-zoomin" onclick="zoomIn()">放大</a>
                    <a class="mini-button" plain="true" iconcls="icon-zoomout" onclick="zoomOut()">缩小</a>
                    <span class="separator"></span>
                </div> -->
                <div id="ganttView"></div>
            </div>
        </div>
    </div>
</div>
</body>
</html>