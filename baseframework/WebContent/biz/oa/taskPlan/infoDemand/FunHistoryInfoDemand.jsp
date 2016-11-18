
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,dateTime,tree,combox" /> 
<x:base include="layout,dialog,grid,dateTime,tree" />
<link href='<c:url value="/system/opm/permission/showIcon.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquey.scrollLoad.js"/>' type="text/javascript"></script>
<script	src='<c:url value="/biz/oa/taskPlan/infoDemand/FunHistoryInfoDemand.js"/>' type="text/javascript"></script>  
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script> 
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script> 
</head>
<body>
	<div class="mainPanel">
		<x:hidden name="selfDeptId" />
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="功能树" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center" title="列表">
					<form method="post" action="" id="queryMainForm">
						<x:title title="功能的信息化需求" hideTable="queryDiv" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">

							<x:hidden name="infoDemandId" />
 
							<x:inputL name="deptName" required="false" label="发起部门名称"
								maxLength="64" wrapper="tree" />  
							<x:selectL name="isPlan" required="false" label="是否计划内"
								dictionary="yesorno" />
							<x:selectL name="urgentDegree" required="false" label="优先级"
								list="infoDemandUrgentList" />
							<x:inputL name="fillinDate" required="false" label="填表日期"
								maxLength="7" wrapper="dateTime" />  
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
