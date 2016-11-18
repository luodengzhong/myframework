
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		
		<x:hidden name="budgetsubjectOrgId"/>
		<x:hidden name="budgetsubjectId" />
		<x:hidden name="budgetsubjectPersonId" />
		<c:if test="${empty budgetsubjectOrgId}">
		<x:inputL name="budgetsubjectName" required="true" label="预算主体" width="260" wrapper="select"/>
		</c:if>
		<c:if test="${not empty budgetsubjectOrgId}">
		<%-- <x:inputL name="budgetsubjectName" required="true" label="预算主体" width="260" /> --%>
		<div>&nbsp;&nbsp;&nbsp;预算主体:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${budgetsubjectName}</div>
		</c:if>
		<%-- <x:inputL name="budgetsubjectName" required="true" label="预算主体" width="260" wrapper="select"/> --%>
		<x:inputL name="budgetsubjectPersonName" required="true" label="负责人" width="260" wrapper="select"/>
	</div>
</form>
