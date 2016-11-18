<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="80px,120px,50px,40px"/>
	   <tr>
		 <x:selectTD name="trainingStudentGroup" label="分组" list="groups"  colspan="3"/>
	    </tr>
	</table>
</form>
