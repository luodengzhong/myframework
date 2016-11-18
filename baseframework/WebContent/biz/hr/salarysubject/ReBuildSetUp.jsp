
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form">
		<x:hidden name="budgetOrganId" />
		<x:hidden name="personMemberId" />
		<x:hidden name="accountId" />
		<dl>
			<dt>预算主体:</dt>
			<dd>${budgetsubjectName}</dd>
		</dl>
		<br/>
		<%-- <x:inputL name="budgetsubjectName" required="true" label="预算主体" width="260" wrapper="select"/> --%>
		<x:inputL name="fillinDate" required="true" label="费用期间"  wrapper="select"/>
		<br/>
		<x:radioL name="reBuild" required="true"  label="覆盖已有"  list="#{'0':'否','1':'是'}" />  
	</div>
</form>
