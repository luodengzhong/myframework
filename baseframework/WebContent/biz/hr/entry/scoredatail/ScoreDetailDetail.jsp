
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout proportion="50px,250px" />
	     <tr>
		<x:hidden name="id"/>
		<x:selectTD name="type" required="true" label="类别" />
		</tr>
		<tr>
		<x:textareaTD name="content" required="true" label="内容" rows="5" colspan="1" maxLength="128"/>	
		</tr>	
			<tr>
		<x:inputTD name="totalScore" required="true" label="分值" mask="nn"/>		
		</tr>
		
	</table>
</form>
