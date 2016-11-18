<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,tree,dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/hr/change/resignation/departureSettlementAttStatistics.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv" style="height:330px;">
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
