<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree,combox"/>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/setup/Persontaxrate.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<x:hidden name="mainId" id="mainId" />
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="个税分类" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="个税列表">
					<x:title title="个税列表" hideTable="queryDiv" />
					<div id="maingrid" ></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
