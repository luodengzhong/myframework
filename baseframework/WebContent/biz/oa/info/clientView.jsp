<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
    <script type="text/javascript">
    <!--
    $(document).ready(function() {
    	$('#submitButton').click();
    });
    //-->
    </script>
</head>
<body>
<form method="post" action="<c:url value="/oaInfoAction!toHandleInfoPromulgate.job?useDefaultHandler=0"/>" id="submitForm">
	<input type="hidden" name="clientViewSecurity" value="<c:out value="${clientViewSecurity}" />"/>
	<input type="hidden" name="isRtxAuth" value="<c:out value="${isRtxAuth}" />"/>
	<input type="hidden" name="infoPromulgateId" value="<c:out value="${info}" />" />
	<input type="hidden" name="loginName" value="<c:out value="${loginName}" />"/>
	<input type="hidden" name="username" value="<c:out value="${param.username}" />"/>
	<input type="hidden" name="sign" value="<c:out value="${param.sign}" />"/>
	<input type="submit" style="display:none;" value="a" id="submitButton"/>
</form>
</body>
</html>