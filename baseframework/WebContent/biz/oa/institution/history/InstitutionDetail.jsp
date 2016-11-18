<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="id" />
		<x:hidden name="kind" />
		<table class='tableInput'>
			<tr>
				<x:inputTD name="code" readonly="true" width="260" label="编码"/>
				<x:inputTD name="name" readonly="true" width="260" label="名称"/>
			</tr>
			<tr>
				<x:inputTD name="organName" readonly="true" width="260" label="机构"/>
				<x:inputTD name="processDefinitionName" readonly="true" width="260" label="流程名称"/>
			</tr>
			<tr>
				<x:inputTD name="institutionVersion" readonly="true" width="260" label="制度版本"/>
				<x:inputTD name="createDate" readonly="true" width="260" label="创建日期"/>
			</tr>
			<tr>
				<x:inputTD name="effectiveDate" readonly="true" width="260" label="生效日期"/>
				<x:inputTD name="oldInstitutionName" readonly="true" width="260" label="原制度"/>
			</tr>
			<tr>
				<x:inputTD colspan="3" name="fullName" readonly="true" label="制度路径" width="636"/>
			</tr>
			<tr>
				<x:textareaTD colspan="3" name="description" label="描述" readonly="true" width="636" rows="5"/>
			</tr>
		</table>
		<div id="inst" style='display:none'><div class="blank_div"></div>
			<x:fileList readOnly="true" bizCode="OACurrentInstAttachment" isClass="true" bizId="id" id="instFileList" proportion="12%,38%,12%,38%"/>
		</div>
		<div id="proc" style='display:none'><div class="blank_div"></div>
			<x:fileList readOnly="true" bizCode="OACurrentProcAttachment" isClass="true" bizId="id" id="instProcFileList" proportion="12%,38%,12%,38%"/>
		</div>
	</div>
</form>
