<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
    <script src='<c:url value="/biz/demo/FusionCharts.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/demo/FusionCharts.jqueryplugin.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/demo/demoChart.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
                <div id="chartContainer">FusionCharts 将加载显示到这里!</div>
            </div>
        </div>
    </div>
</body>