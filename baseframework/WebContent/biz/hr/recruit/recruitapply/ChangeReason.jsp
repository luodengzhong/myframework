<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<div class="ui-form" style="width:400px;">
	  <table class='tableInput' id='queryTable'>
				<x:layout proportion="110px,200px" />
		
		<x:hidden name="jobApplyId"/>
		<x:hidden name="taskId"/>
		<x:textareaTD name="closedReason" required="true" label="招聘需求关闭原因"   rows="4"/>
	</table>
	</div>
</form>