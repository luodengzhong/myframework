<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="casePostilForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout proportion="15%,35%,15%,35%"/>
	     <tr>
			<x:hidden name="documentPostilId"/>
			<x:inputTD name="createDate" disabled="true" label="创建时间" mask="dateTime"/>		
			<x:inputTD name="createByName" required="false" label="创建人" disabled="true"/>		
		</tr>
		<tr>
			<x:textareaTD name="content" required="true" label="内容" colspan="3" maxlength="500" rows="6"/>
	     </tr>
	</table>
</form>
