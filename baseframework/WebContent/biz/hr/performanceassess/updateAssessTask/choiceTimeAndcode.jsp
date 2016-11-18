<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<div class="ui-form" style="width:400px;">
	  <table class='tableInput' id='queryTable'>
				<x:layout proportion="80px,220px" />
		<tr>
		<x:inputTD name="year" required="true" label="考核年"   />
		</tr>
		<tr>
		<x:selectTD  name="periodCode"   list="period"  required="true" label="考核周期" maxLength="64"/>	
		</tr>
		<tr>
		<x:inputTD name="periodCodeName" required="true" label="考核时间" />
		</tr>
	</table>
	</div>
</form>