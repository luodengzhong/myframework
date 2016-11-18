<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
<x:base include="layout,dialog,grid,dateTime" />
<script src='<c:url value="/javaScript/UICtrl.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/meeting/CheckBackQuery.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="center" title="回退列表" style="padding:3px;">
					<div class="blank_div"></div>
					<div id="maingrid"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>