<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<script src='<c:url value="/system/freeFlowDesigner/ProcActivityProperty.js"/>'type="text/javascript"></script>
<x:base include="layout,dialog,dateTime,combox,tree" />
<div style="margin:5px;" class="mainPanel">
	<form method="post" action="" id="submitForm">
		<table class='tableInput' style="width:300px;">
			<x:layout proportion="25%,*" />
			<!--  
			<tr>
				<x:inputTD name="description" label="标题" />
			</tr>
			-->
			<tr>
		        <x:hidden name="personMemberId" />
		        <x:hidden name="fullId" />
		         <x:hidden name="fullName" />
				<x:inputTD name="personMemberName" label="处理人"  wrapper="tree"/>
			</tr>
			<tr>
				<x:inputTD name="activityKind" label="节点类型" />
			</tr>
		</table>
	</form>
</div>