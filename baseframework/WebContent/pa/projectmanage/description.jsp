<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script type="text/javascript"
	src="<c:url value='/pa/projectmanage/description.js'/>"></script>
<title>项目管理</title>
</head>

<form method="post" action="" id="submitForm" style="margin-top: 10px;">
	<div class='ui-form' id='queryTable'>
		<div>
			<x:textareaL name="description" id="description" label="备注" required="true"
				readonly="false" labelWidth="60" width="260" rows="6"></x:textareaL>
		</div>
	</div>
</form>

</html>

