
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:860px;">
		
		<x:hidden name="progressDetailId"/>
		
		<x:inputL name="progressId" required="false" label="" maxLength="22"/>		
		<x:inputL name="assessPersonId" required="false" label="" maxLength="32"/>		
		<x:inputL name="assessPersonName" required="false" label="" maxLength="32"/>		
		<x:inputL name="auditId" required="false" label="" maxLength="22"/>		
		<x:inputL name="formId" required="false" label="" maxLength="22"/>		
		<x:inputL name="updateDate" required="false" label="" maxLength="7"/>		
		<x:inputL name="resultId" required="false" label="" maxLength="22"/>		
		<x:inputL name="performanceGroupDetailId" required="false" label="" maxLength="22"/>
	</div>
</form>
