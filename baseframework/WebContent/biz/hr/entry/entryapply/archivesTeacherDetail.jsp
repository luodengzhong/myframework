<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<table class='tableInput' style="width: 99%;">
   <x:layout proportion="90px,340px"/>
	<tr>
	<x:hidden name="id"/>
	<x:hidden name="archivesId"/>
	<x:hidden name="teacherId"/>
	<x:inputTD name="staffName" label="员工姓名"  required="true" wrapper="select"/>
	</tr>
	<tr>
	<x:inputTD name="teacherName" label="督导师"  required="true" wrapper="select"/>
	</tr>
	<tr>
	<x:textareaTD name="desption" label="描述"  required="false"    maxLength="128"/>
	</tr>
	
	</table>
</form>