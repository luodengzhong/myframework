<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<div class="ui-form" style="width:400px;">
	  <table class='tableInput' id='queryTable'>
				<x:layout proportion="80px,220px" />
		
		<x:hidden name="auditId"/>
		<x:selectTD name="type"  dictionary="resignationType" required="true" label="离职类型 "   />
	</table>
	</div>
</form>