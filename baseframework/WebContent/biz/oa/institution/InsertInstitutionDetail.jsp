<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<script src='<c:url value="/biz/oa/institution/InstitutionDetail.js"/>'
	type="text/javascript"></script>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="reviseFlg" />
		<x:hidden name="kind" />
		<x:hidden name="status" value="1"/>
		<x:hidden name="parentId" />
		<table class='tableInput'>
			<tr>
				<x:inputTD name="code" readonly="false" required="true" width="260" label="编码"/>
				<x:inputTD name="name" readonly="false" required="true" width="260" label="名称"/>
			</tr>
			<tr>
				<x:inputTD name="institutionVersion" readonly="false" required="true" width="260" label="制度版本"/>
				<x:inputTD name="sequence" readonly="false" required="true" width="260" label="序列号"/>
			</tr>
			<tr>
				<x:textareaTD colspan="3" name="description" label="描述" readonly="false" width="636" rows="5"/>
			</tr>
		</table>
	</div>
</form>
