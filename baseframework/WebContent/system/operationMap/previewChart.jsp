<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,tree,dateTime,combox" />
<script src='<c:url value="/javaScript/swfobject.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/operationMap/previewChart.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" style="padding: 0px;">
		<div id="mainWrapperDiv">
			<x:hidden name="operationMapId" id="operationMapId" />
			<div style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: 2px;">
				<div id="mainflash"></div>
			</div>
		</div>
	</div>
</body>
</html>
