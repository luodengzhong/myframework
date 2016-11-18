<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid" />
<script src='<c:url value="/biz/hr/attendance/statistics/ChkDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<x:hidden name="workDate" />
		<x:hidden name="personId" />
		<div id="mainWrapperDiv">
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
