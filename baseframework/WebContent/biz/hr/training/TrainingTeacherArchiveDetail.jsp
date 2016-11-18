<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="80px,120px,80px,120px"/>
		<tr>
		<x:hidden name="trainingTeacherId"/>
		<x:hidden name="teacherType"  value="outer"/>
		<x:inputTD name="staffName" required="true"  label="姓名" maxLength="32"  colspan="3"/>
		</tr>
		<tr>
		<x:selectTD name="TLevel" list="teacherLevels" required="true" label="级别"  colspan="3"/>
		</tr>
		<tr>
	    <x:textareaTD name="ognName" required="true"  label="所属机构" maxLength="64"  colspan="3"  row="3" />
		</tr>
	</table>
</form>
