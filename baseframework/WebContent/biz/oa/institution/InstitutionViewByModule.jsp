<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<link href='<c:url value="/biz/oa/institution/InstitutionView.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery.tooltip.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/institution/InstitutionViewByModule.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div id="mainWrapperDiv" style="overflow: auto;">
		<x:hidden name="rootId" />
		<div id="maindiv"></div>
	</div>
</body>
</html>