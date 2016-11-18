<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="100px,120px,100px,180px"/>
	    <tr>
		<x:hidden name="trainingStudentGroupId"/>
		<x:hidden name="trainingSpecialClassId"/>
		<x:inputTD name="squence" required="true" label="序号" mask="nnn"/>
		<x:inputTD name="name" required="true" label="组名" maxLength="32"/>
		</tr>
		<tr>
		<x:inputTD name="slogan" required="false" label="口号" maxLength="64"  colspan="3"/>
		</tr>
	</table>
</form>
