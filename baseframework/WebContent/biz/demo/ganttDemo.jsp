<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/icons.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/default/miniui.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/scripts/miniui/themes/gray/skin.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/lib/Gantt/css/core.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/Gantt/scripts/miniui/miniui.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/miniui/locale/zh_CN.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/plusproject/CalendarWindow.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/plusproject/ProjectMenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/plusproject/StatusColumn.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/plusproject/TaskWindow.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/plusproject/ProjectServices.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/Gantt/scripts/ThirdLibs/swfobject/swfobject.js"/>' type="text/javascript"></script>

<script src='<c:url value="/biz/demo/ganttDemo.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="mini-toolbar" style="border-bottom: 0;">
			    <a class="mini-button" plain="true" iconcls="icon-reload" onclick="load()">加载</a>
			    <a class="mini-button" plain="true" iconcls="icon-save" onclick="save()">保存</a>
			    <span class="separator"></span>
			    <a class="mini-button" plain="true" iconcls="icon-add" onclick="addTask()">增加</a>
			    <a class="mini-button" plain="true" iconcls="icon-edit" onclick="updateTask()">修改</a>
			    <a class="mini-button" plain="true" iconcls="icon-remove" onclick="removeTask()">删除</a>
			    <span class="separator"></span>
			    <a class="mini-button" plain="true" iconcls="icon-upgrade" onclick="upgradeTask()">升级</a>
			    <a class="mini-button" plain="true" iconcls="icon-downgrade" onclick="downgradeTask()">降级</a>
			    <span class="separator"></span>
			    <a class="mini-button" plain="true" iconcls="icon-lock" onclick="onLockClick" checkonclick="true">锁定列</a>
			    <span class="separator"></span>
			    <a class="mini-button" plain="true" iconcls="icon-zoomin" onclick="zoomIn()">放大</a>
			    <a class="mini-button" plain="true" iconcls="icon-zoomout" onclick="zoomOut()">缩小</a>
			    <span class="separator"></span>
			    <a class="mini-button" iconcls="icon-node" onclick="editTaskByTaskWindow()">任务面板</a>
			    <a class="mini-button" iconcls="icon-date" onclick="showCalendars()">日历面板</a>
			</div>
			<div id="ganttView"></div>
		</div>
	</div>
</body>
</html>