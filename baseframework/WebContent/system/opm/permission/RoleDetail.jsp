<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="folderId" />
	<x:hidden name="id" />
	<div class='ui-form'>
		<x:inputL name="code" required="true" label="编码" readonly="false"  labelWidth="60" width="305"/>
		<x:inputL name="name" required="true" label="名称" readonly="false" labelWidth="60" width="305"/>
		<x:radioL list="#{'1':'启用','0':'禁用'}" name="status" value="1"
			label="状态" labelWidth="60" width="120" />
		<x:selectL name="roleKindId" required="true" label="类别" labelWidth="60" width="100"/>
		<x:inputL name="sequence" required="false" label="排序号"
			readonly="false" spinner="true" mask="nnn" dataoptions="min:1" labelWidth="60" width="80"/>
		<x:textareaL name="description" required="false" label="描述"
			readonly="false" labelWidth="60" rows="3" width="305">
		</x:textareaL>
	</div>
</form>