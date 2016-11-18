<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width:340px;">
		<x:layout proportion="30%,70%" />
		<tr>
			<x:selectTD list="welfareType" name="welfareTypeId" emptyOption="false"  label="选择福利类型"/>		
		</tr>
	</table>
</form>
