<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,tree,dateTime,combox,attachment" />
<script src='<c:url value="/javaScript/swfobject.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/operationMap/pilotageChart.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" style="padding: 2px;">
		<div id="mainWrapperDiv">
			<x:hidden name="operationMapId" id="operationMapId"/>
			<div id="charToolBar"></div>
			<div style="position: absolute; top: 30px; left: 0px; right: 0px; bottom: 0px;margin:2px;">
				<div id="mainflash"></div>
			</div>
		</div>
	</div>
</body>
</html>
