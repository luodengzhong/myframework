
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid,combox,dialog" />
<script src='<c:url value="/biz/hr/attendance/statistics/AttCheckExceptionList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<form method="post" action="" id="submitForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="year" label="业务年" required="true" cssStyle="width:60px;" width="60"/>
					<x:hidden name="periodId" />
					<x:inputL name="periodName" label="业务期间" required="true" wrapper="combo" width="220"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />
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
