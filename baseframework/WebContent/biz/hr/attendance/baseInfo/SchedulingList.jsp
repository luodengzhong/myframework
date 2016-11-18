<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox,date" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="biz/hr/attendance/baseInfo/Scheduling.js"/>' type="text/javascript"></script>
</head>
<body id="body">
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="排班信息" style="overflow:auto">
					<form method="post" action="" id="queryMainForm">
						<x:hidden name="fullId" />
						<x:hidden name="personId" />
						<x:hidden name="personName" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<div class="row">
							<x:inputL name="startDate" required="true" label="开始日期"
								wrapper="date" />
							<x:inputL name="endDate" required="true" label="结束日期"
								wrapper="date" />
							</div>
							<div class="row">
								<x:inputL name="schOrgId" required="true" label="排班机构" />
								<x:selectL name="workKind" required="true" label="工种类型" />
								<dl>
									<x:button value="查 询" onclick="query()" />
									<x:button value="查看排班表" onclick="showScheduling()" />
								</dl>
							</div>
						</div>
					</form>
					<div class="blank_div" id="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>