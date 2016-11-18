
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<title>绘制流程图</title>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="swfobject.js"/>' type="text/javascript"></script>
<script src='<c:url value="nodeGraphic.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<style type="text/css">
.fullflash {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	z-index: 0;
}
</style>
</head>
<body>
	<div class="fullflash">
		<div id="mainflash"></div>
	</div>
</body>
</html>