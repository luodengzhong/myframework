<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="id"/>
	<x:hidden name="folderId"/>
	<div class='ui-form'>
		<div class="row">
			<x:inputL name="code" required="true" label="编码" readonly="false" labelWidth="100" width="240" />
		</div>
		<div class="row">
			<x:inputL name="name" required="true" label="名称" readonly="false" labelWidth="100" width="240" />
		</div>
		<div class="row">
			<x:hidden name="bizManagementTypeId" id="bizManagementTypeId" />
			<x:inputL name="bizManagementTypeName" id="bizManagementTypeName" label="业务管理权限" readonly="true" labelWidth="100"
				width="180" />
			<x:button value="..." id="btnSelectBizManagementType" cssStyle="min-width:30px;" />
		</div>
		<div class="row">
			<x:inputL name="sequence" required="false" label="排序号" readonly="false" spinner="true" mask="nnn" dataoptions="min:1" labelWidth="100"
				width="180" />
		</div>
		<div class="row">
			<x:textareaL name="remark" required="false" label="备注"
				readonly="false" rows="3" labelWidth="100" width="240"></x:textareaL>
		</div>
	</div>
</form>