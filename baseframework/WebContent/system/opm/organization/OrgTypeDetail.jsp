<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="id" id="editId"/>
	<x:hidden name="orgKindId" id="editOrgKindId" />
	<x:hidden name="folderId" id="editFolderId" />
	<div class="ui-form">
		<x:inputL name="code"  id="editCode"  required="true" label="编码" readonly="false" width="250"/>
		<x:inputL name="name" id="editName" onblur = "onEditNameBlur()" required="true" label="名称" readonly="false" width="250"/>
		<x:radioL list="#{'1':'启用','0':'禁用'}" name="status" value="1"
			label="状态"/>
		<x:inputL name="sequence" id="editSequence" required="false" label="排序号"
			readonly="false" spinner="true" mask="nnn" dataoptions="min:1" />
	</div>
</form>