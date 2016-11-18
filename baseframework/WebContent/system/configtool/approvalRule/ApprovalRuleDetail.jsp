
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="id" />
	<x:hidden name="orgId" />
	<x:hidden name="parentId" />
	<x:hidden name="fullId" />
	<x:hidden name="fullName" />
	<table class='tableInput' style="width: 580px;">
		<x:layout proportion="20%,30%,20%,*" />
		<tr>
			<x:inputTD name="procKey" readonly="true" label="流程编号"
				maxLength="128" labelWidth="70" width="200" />
			<x:inputTD name="procName" readonly="true" label="流程名称"
				maxLength="128" labelWidth="70" width="200" />
		</tr>
		<tr>
			<x:inputTD name="procUnitId" readonly="true" label="环节ID"
				maxLength="64" labelWidth="70" width="200" />
			<x:inputTD name="procUnitName" readonly="true" label="环节名称"
				maxLength="128" labelWidth="70" width="200" />
		</tr>
		<tr>
			<x:radioTD name="nodeKindId" list="nodeKindList" required="false"
				label="类别" maxLength="22" labelWidth="70" />
			<x:inputTD name="name" required="true" label="名称" maxLength="128"
				labelWidth="70" width="200" />
		</tr>
		<tr>
			<x:inputTD name="priority" required="true" label="优先级" maxLength="22"
				labelWidth="70" width="200" />
			<x:radioTD name="status" list="statusList" label="状态" labelWidth="70" />
		</tr>
		<tr>
			<x:radioTD list="#{'1':'本组织','2':'自定义组织'}" name="scopeKindId"
				labelWidth="70" value="1" label="适用范围" colspan="3"/>
		</tr>
		<tr>
			<x:textareaTD name="remark" required="false" label="备注" rows="2"
				labelWidth="70" width="200" colspan="3"/>
		</tr>
	</table>
</form>
<div id="scopeGrid" style="margin: 2px;"></div>
