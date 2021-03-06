<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,tree,dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/statistics/ArchivesLeaveRateReport.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="统计报表">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
					
						<x:hidden name="fullId" />
						<x:hidden name="ognKindId" />
						<x:hidden name="ognId" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="startDate" label="开始时间" required="true"
								wrapper="date" width="120" labelWidth="70" />
							<x:inputL name="endDate" label="结束时间" required="true"
								wrapper="date" width="120" labelWidth="70" />
							<x:inputL name="posName" label="岗位名称" />
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="divLayOut" style="height: 100%;">
						<div id="maingridTotal" position="top"></div>
						<div id="maingrid" position="center"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
