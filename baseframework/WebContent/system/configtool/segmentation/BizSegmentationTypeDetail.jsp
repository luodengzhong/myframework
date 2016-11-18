<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="bizSegmentationTypeId" />
	<x:hidden name="folderId" />
	<div class='ui-form'>
		<x:inputL name="code" required="true" label="编码" readonly="false" labelWidth="80" width="200" />
		<x:inputL name="name" required="true" label="名称" readonly="false" labelWidth="80" width="200" />
		<x:radioL list="#{'0':'系统','1':'自定义'}" name="kindId" value="1" label="类别" labelWidth="80" width="200" />

		<%-- <x:inputL name="manageOrgKindId" required="true" label="管理组织类别"
				readonly="false" labelWidth="120" width="200"/>
			<x:inputL name="manageOrgKindName" required="true" label="管理组织类别名称"
				readonly="false" labelWidth="120" width="200"/> --%>

		<x:inputL name="sequence" required="false" label="排序号" readonly="false" spinner="true" mask="nnn" dataoptions="min:1" labelWidth="80"
			width="100" />
	</div>
</form>