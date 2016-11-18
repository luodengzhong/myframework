<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<script src='<c:url value="/biz/oa/institution/InstitutionTreeDetail.js"/>'
	type="text/javascript"></script>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
	<x:hidden name="id" />
	<x:hidden name="reviseFlg" />
		<table class='tableInput'>
			<tr>
				<x:inputTD name="name" readonly="true" width="260" label="名称"/>
				<x:inputTD name="sequence" readonly="true" width="260" label="序列号"/>
			</tr>
			<tr>
				<x:inputTD name="opfunctionCode" readonly="true" width="260" label="菜单编码"/>
				<x:inputTD name="opfunctionName" readonly="true" width="260" label="菜单名称"/>
			</tr>
			<tr>
				<x:inputTD colspan="3" name="fullName" readonly="true" label="全路径"/>
			</tr>
		</table>
	</div>
	<div style="text-align:right" id="btn">
		<x:button id="addInst" value="新增一级制度"/>
		<x:button id="addProc" value="新增二级流程"/>
		<x:button id="addChild" value="新增子节点"/>
		<x:button id="editNode" value="修改节点"/>
		<x:button id="revise" value="修订"/>
		<div style="height:5px;"></div>
	</div>	
	<div id="childGrid"></div>
	
</form>
