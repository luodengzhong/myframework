<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="contractId" id="contractId" />
	<x:hidden name="projectId" id="projectId" />
	<x:hidden name="projectNodeId" id="projectNodeId" />
	<x:hidden name="contractCategoryId" id="contractCategoryId" />
	<x:hidden name="creatorId" id="creatorId" />
	<div class='ui-form' id='queryTable'>
		<table class='tableInput' style="width: 500px;">
			<x:layout proportion="17%,33%,17%,33%" />
			<tr>
				<x:inputTD name="projectName" id="projectName" label="项目"
					readonly="true" />
				<x:inputTD name="projectNodeName" id="projectNodeName" label="项目节点"
					readonly="true" />
			</tr>
			<tr>
				<x:inputTD name="contractCategoryName" id="contractCategoryName"
					label="合同类别" readonly="true" wrapper="tree"
					dataOptions="name:'contractCategory', back:{text:'#contractCategoryName', value: '#contractCategoryId'}" />
				<x:inputTD name="creatorName" id="creatorName" required="false"
					label="经办人" readonly="true" wrapper="tree"
					dataOptions="name: 'org',checkbox:true ,back:{text:'#creatorName', value: '#creatorId'}" />
			</tr>
			<tr>
				<x:inputTD name="code" id="code" required="false" label="编码"
					readonly="true" />
				<x:inputTD name="name" id="name" required="false" label="名称"
					readonly="true" />
			</tr>
			<tr>
				<x:inputTD name="aunit" id="aunit" required="false" label="甲方单位"
					readonly="true" />
				<x:inputTD name="acreator" id="acreator" required="false"
					label="甲方经办人" readonly="true" />
			</tr>
			<tr>
				<x:inputTD name="bunit" id="bunit" required="false" label="乙方单位"
					readonly="true" />
				<x:inputTD name="bcreator" id="bcreator" required="false"
					label="乙方经办人" readonly="true" />
			</tr>
			<tr>
				<x:inputTD name="contractAmount" id="contractAmount"
					required="false" label="合同价(元)" readonly="true" spinner="true"
					dataoptions="min:0" />
				<x:inputTD name="signDate" id="signDate" required="false"
					label="签订日期" readonly="true" maxLength="7" wrapper="date" />
			</tr>
			<tr>
				<x:inputTD name="signAddress" id="signAddress" required="false"
					label="签订地点" readonly="true" colspan="3" />
			</tr>
			<tr>
				<x:inputTD name="description" id="description" required="false"
					label="描述" readonly="true" colspan="3" />
			</tr>
			<tr>
				<td class="title"><span class="labelSpan">附件：</span></td>
				<td class="edit" colspan="3"><x:fileList bizCode="ContractFile" readOnly="true"
						bizId="contractId" id="ContractFileList" /></td>
			</tr>
		</table>
	</div>
</form>
