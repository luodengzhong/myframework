<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="effectDateChangeForm">
	<div class="ui-form" style="width:380px;">
		<x:inputL name="newEffectiveDate" label="生效时间" labelWidth="60" required="true" emptyOption="false"  wrapper="date"/>
		<x:textareaL name="explain" label="原因" labelWidth="60" rows="5" required="true" height="80" width="280"/>
	</div>
</form>