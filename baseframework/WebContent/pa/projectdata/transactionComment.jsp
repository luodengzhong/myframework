<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/projectdata/transactionComment.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" style="margin: 2px;">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div class="blank_div"></div>
				<div id="maingrid"></div>
			</div>
		</div>
	</div>
	</div>
</body>
</html>
