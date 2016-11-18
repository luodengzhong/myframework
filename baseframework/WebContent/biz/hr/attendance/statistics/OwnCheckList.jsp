
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,tree,dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/statistics/OwnCheckList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:title title="搜索" hideTable="queryDiv" />
			<form method="post" action="" id="submitForm">
				<x:hidden name="auditId" />
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="startDate" required="true" label="开始日期" wrapper="date" />
					<x:inputL name="endDate" required="true" label="结束日期" wrapper="date" />
					<div class='clear'></div>
					<x:inputL name="macName" required="false" label="打卡机器" />
					<x:inputL name="macAddress" required="false" label="打卡地点"/>
					<x:hidden name="organId" />
					<x:hidden name="archivesId" />
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />
						&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)" />
						&nbsp;&nbsp;
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
