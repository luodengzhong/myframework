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
<%
    String key=request.getParameter("key");
	if(null==key||key.equals("")){
	    response.sendRedirect("logout.do");
	}
%>
<body>
<form method="post" action="<c:url value="/ssoLogin.ajax"/>" id="submitForm">
	<input type="hidden" name="name" value="<%=key %>"/>
	<input type="submit" style="display:none;" value="a" id="submitButton"/>
</form>
</body>
</html>