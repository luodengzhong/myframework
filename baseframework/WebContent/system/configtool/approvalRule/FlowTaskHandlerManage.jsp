<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/bpm/BpmUtil.js"/>' type="text/javascript"></script>
<script
	src='<c:url value="/system/configtool/approvalRule/FlowTaskHandlerManage.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="ui-form" >
				<x:inputL name="bizCode" required="false" label="业务单据编号"
					labelWidth="85" />
				&nbsp;&nbsp;
				<x:button value="查询" id="btnQueryTask" />
			</div>
			<div class="blank_div"></div>
			<div id='pageTab' style="margin: 0px;">
				<div class="ui-tab-links">
					<ul id="menu_ul" style="left: 5px;">
						<li id="flowTaskList" divid="flowTaskListDiv">流程任务列表</li>
						<li id="procUnitHandlerList" divid="procUnitHandlerListDiv">处理人列表</li>
						<li id="hiProcUnitHandlerList" divid="hiProcUnitHandlerListDiv">历史处理人列表</li>
					</ul>
				</div>
				<div class="ui-tab-content" style="padding: 2px; padding-right: 0;">
					<div class="layout" id='flowTaskListDiv' >
						<div id="taskGrid"></div>
					</div>
					<div class="layout" id='procUnitHandlerListDiv'>
						<div id="procUnitHandlerGrid"></div>
					</div>
					<div class="layout" id='hiProcUnitHandlerListDiv'>
						<div id="hiProcUnitHandlerGrid"></div>
					</div>
				</div>				
			</div>
		</div>
		</div>
</body>
</html>
