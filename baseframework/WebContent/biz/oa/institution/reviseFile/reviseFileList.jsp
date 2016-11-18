<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid,attachment" />
<script src='<c:url value="/biz/oa/institution/reviseFile/reviseFileList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" style="padding-top:10px;">
		<div id="maingrid" style="margin: 2px;"></div>
	</div>
</body>
</html>
