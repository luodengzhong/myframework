
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	     <tr>
		
		<x:hidden name="progressDetailId"/>
		
		<x:inputTD name="progressId" required="false" label="" maxLength="22"/>		
		<x:inputTD name="assessPersonId" required="false" label="" maxLength="32"/>		
		<x:inputTD name="assessPersonName" required="false" label="" maxLength="32"/>		
		<x:inputTD name="auditId" required="false" label="" maxLength="22"/>		
		<x:inputTD name="formId" required="false" label="" maxLength="22"/>		
		<x:inputTD name="updateDate" required="false" label="" maxLength="7"/>		
		<x:inputTD name="resultId" required="false" label="" maxLength="22"/>		
		<x:inputTD name="performanceGroupDetailId" required="false" label="" maxLength="22"/>
	     </tr>
	</table>
</form>
