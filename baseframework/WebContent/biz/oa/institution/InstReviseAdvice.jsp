<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid" />
<script src='<c:url value="/biz/oa/institution/InstReviseAdvice.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="bizId" />
			<div id="InfoPromulgate"></div>
			<div style="height:1px;"></div>
			<iframe src="#" id="infoDetail" width="100%" frameborder="no" height="365"></iframe>
		</div>
	</div>
</body>
</html>

