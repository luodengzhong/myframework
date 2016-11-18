<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid,combox" />
<script src='<c:url value="/biz/hr/performanceassessment/start/noFormPerson.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" style="margin-top: 5px;">
		<x:hidden name="fullId" id="mainFullId" />
		<x:hidden name="periodCode" id="mainPeriodCode" />
		<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width: 400px;">
				<x:inputL name="noFormName" required="false" label="条件" labelWidth="70" />
				<dl>
					<x:button value="查 询" onclick="query(this.form)" />
					&nbsp;&nbsp;
				</dl>
			</div>
		</form>
		<div class="blank_div"></div>
		<div id="maingrid" style="margin: 2px;"></div>
	</div>
</body>
</html>
