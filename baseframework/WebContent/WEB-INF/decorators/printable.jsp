<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/page" prefix="page"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><decorator:title /></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link href='<c:url value="/themes/default/printable.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/UICtrl.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/printable.js"/>' type="text/javascript"></script>
</head>
<body>
	<div id='screenOverLoading' class='ui-tab-loading' style='display:block;top:0;'></div>
	<decorator:body />
	<c:if test="${param.useDefaultHandler!=0}">
		<div style="margin-top: 5px;" id="jobTaskExecutionList">
			<x:taskExecutionList procUnitId="procUnitId" defaultUnitId="Approve" bizId="bizId" />
		</div>
	</c:if>
</body>
</html>