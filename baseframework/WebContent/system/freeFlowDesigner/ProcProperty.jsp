<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<script src='<c:url value="/system/freeFlowDesigner/ProcProperty.js"/>'type="text/javascript"></script>
<div style="margin:5px;" class="mainPanel">
	<form method="post" action="" id="submitForm">
		<table class='tableInput' style="width:300px;">
			<x:layout proportion="20%,*" />
			<tr>
				<x:inputTD name="description" label="标题" />
			</tr>
		</table>
	</form>
</div>