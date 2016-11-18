<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width: 300px;">
		<x:hidden name="mainId" />
		<x:inputL name="code" required="true" label="编码" maxLength="32"
			labelWidth="60" width="200" />
		<x:inputL name="name" required="true" label="名称" maxLength="64"
			labelWidth="60" width="200" />
		<x:inputL name="startTax" required="true" label="起征额" mask="999999"
			labelWidth="60" width="200" />
		<x:radioL list="#{'1':'是','0':'否'}" name="isDefault" required="true"
			label="是否默认" value="0" labelWidth="60" width="200" />
	</div>
</form>
