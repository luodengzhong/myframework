<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<div class="ui-form" style="width:400px;">
	  <table class='tableInput' id='queryTable'>
				<x:layout proportion="80px,220px" />
		
		<x:hidden name="bizId"/>
		<x:hidden name="tableName"  />
		<x:textareaTD name="reason" required="true" label="变动原因"   rows="4"/>
	</table>
	</div>
</form>