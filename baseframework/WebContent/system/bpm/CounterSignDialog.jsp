<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/system/bpm/CounterSignDialog.js?a=5"/>' 	type="text/javascript"></script>
<script src='<c:url value="/system/opm/organization/SelectOrgCommonPage.js?a=1"/>' 	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'  type="text/javascript"></script>
<script src='<c:url value="/system/bpm/BpmUtil.js"/>'  type="text/javascript"></script>
</head>
<body>
	<c:import url="/system/opm/organization/SelectOrgCommonPage.jsp" />
	<x:hidden name="procUnitId" />
	<x:hidden name="groupId" />
	<x:hidden name="hiProcUnitHandlerInstVersion"/>
</body>
</html>