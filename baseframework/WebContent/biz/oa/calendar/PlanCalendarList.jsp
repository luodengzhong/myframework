<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/oa/calendar/PlanCalendar.js"/>' type='text/javascript'></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:title title="计划日历" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="calendarCode" required="false" label="日历编码" maxLength="16" />
					<x:inputL name="calendarName" required="false" label="日历名称" maxLength="32" />
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
