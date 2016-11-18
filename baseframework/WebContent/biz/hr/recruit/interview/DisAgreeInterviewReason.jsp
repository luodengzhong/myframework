<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<div class="ui-form" style="width:400px;">
	  <table class='tableInput' id='queryTable'>
				<x:layout proportion="110px,200px" />
		
		<x:hidden name="writeId"/>
		<x:hidden name="taskId"/>
		<x:hidden name="status"  value="2"/>
		<x:hidden name="staffName"/>
		
		<x:textareaTD name="bsicAssessment" required="true" label="原因"   rows="4"/>
	</table>
	</div>
</form>