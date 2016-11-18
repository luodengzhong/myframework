<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/icons.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/default/miniui.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/gray/skin.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/css/core.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/Gantt/scripts/miniui/miniui.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/miniui/locale/zh_CN.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ganttJS/ProjectMenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ganttJS/TableColumns.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ganttJS/TaskWindow.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/ganttJS/services.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/ThirdLibs/swfobject/swfobject.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/EarlyWarningTaskDetail.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/taskDetailUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
		<div id="layout">
				
				<form method="post" action="" id="queryMainForm">                	
							<x:hidden name="queryType"  value = "1" />
				</form>	
					<x:select name="taskReportingWork" cssStyle="display:none;" id="mainTaskReportingWork" emptyOption="false"/>
					<div class="mini-toolbar" style="border-bottom: 0;" id="opToolbar">
					    <a class="mini-button" plain="true" iconcls="icon-reload" onclick="load()">刷新</a>
					    <a class="mini-button" plain="true" iconcls="icon-goto" onclick="showViewTask()">查看</a>
					    <span class="separator"></span>
					    <a class="mini-button" plain="true" iconcls="icon-edit" onclick="applyEdit()">调整计划</a>
					    <a class="mini-button" plain="true" iconcls="icon-expand" onclick="progressReporting()">汇报进度</a>
					    <a class="mini-button" plain="true" iconcls="icon-node" onclick="showProgressReport()">汇报历史</a>
					    <span class="separator"></span>
					    <a class="mini-button" plain="true" iconcls="icon-lock" onclick="showGanttView()" id="showGanttView">显示条形图</a>
					    <a class="mini-button" plain="true" iconcls="icon-unlock" onclick="hideGanttView()" id="hideGanttView">隐藏条形图</a>
					    <a class="mini-button" plain="true" iconcls="icon-zoomin" onclick="zoomIn()" id="zoomIn">放大</a>
					    <a class="mini-button" plain="true" iconcls="icon-zoomout" onclick="zoomOut()" id="zoomOut">缩小</a>
					    <span class="separator"></span>
					</div>
					<div id="ganttView"></div>
				</div>
		</div>
	</div>
</body>
</html>