
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" >
		<x:hidden name="salarySubjectId"/>
		<x:hidden name="subjectId" />
	    <x:inputL name="subjects" required="true" label="预算科目" width="260" wrapper="select"/>
	</div>
</form>
