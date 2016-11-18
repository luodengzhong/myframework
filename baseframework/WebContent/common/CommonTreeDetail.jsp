<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="">
	<div class="ui-form">
		<x:hidden name="parentId" />
		<x:inputL name="code" required="true" label="编码" readonly="false"
			labelWidth="70" />
		<x:inputL name="name" required="true" label="名称" readonly="false"
			labelWidth="70" />
		<x:textareaL name="remark" required="false" label="描述"
			readonly="false" labelWidth="70" rows="3">
		</x:textareaL>
	</div>
</form>