<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="id" id="serialNumberID"/>
		<x:inputL name="code" required="true" label="编码" maxLength="20"/>		
		<x:inputL name="name" required="true" label="名称" maxLength="50"/>		
		<x:inputL name="codeRule" required="false" label="编码规则" maxLength="128"/>		
		<x:inputL name="value" required="false" label="当前值" maxLength="22" mask="nnnnnn"/>
	</div>
</form>
