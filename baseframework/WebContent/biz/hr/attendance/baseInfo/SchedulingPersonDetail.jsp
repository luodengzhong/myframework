<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid" />
<script src='<c:url value="/biz/hr/attendance/baseInfo/SchedulingPersonDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="ownerPersonId" />
			<x:hidden name="startDate" />
			<x:hidden name="endDate" />
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
