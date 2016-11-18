<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid" />
<script src='<c:url value="/lib/jquery/jquery.attachment.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/pa/projectmanage/showProjectDocument.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div id="divDocument">
		<div class="DetailTitle" id="divDocumentTitle"
			style="text-align: center; font-size: 21px;">文档及资料</div>
		<div id="divDocumentContent" style="margin: 4px;"></div>
	</div>
</body>
</html>