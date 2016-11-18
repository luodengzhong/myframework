<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/projectmanage/showProjectInfo.js"/>'
	type="text/javascript"></script>
</head>
<body>

	<center>
		<div class="indexPanel">
			<div class="indexLogo">
				<img src="<c:url value='/themes/default/images/head_logo.png'/>">
			</div>
			<div class="indexTitlePanel">
				<div id="name" class="indexTitle"></div>
				<br>
				<div id="code" class="indexTitle"></div>
			</div>
			<div class="indexBottom">
				<label>四川蓝光和骏实业股份有限公司</label><br> </b> <label id="address"></label>
			</div>

		</div>
	</center>
</body>
</html>