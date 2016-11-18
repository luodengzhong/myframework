<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="90px,110px,90px,110px"/>
	    <tr>
		<x:selectTD name="isSign" required="true" label="是否签到"  dictionary="yesorno" />		
		<x:inputTD name="signTime" required="true" label="签到时间"   wrapper="dateTime"/>		
		</tr>
		<tr>
		<x:textareaTD name="remark" required="false" label="备注" maxLength="256"  colspan="3" rows="3"/>
	    </tr>
	</table>
</form>
