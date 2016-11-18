<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	  <x:layout  proportion="90px,120px,80px,130px"/>
		<x:hidden name="trainingClassCourseId"/>
		<x:hidden name="trainingSpecialClassId"/>
		<x:hidden name="trainingCourseId"/>
		<tr>
		 <x:inputTD name="className" required="true" label="班级名称" maxLength="22"  disabled="true"/>
		 <x:inputTD name="trainingCourseName" required="true" label="课程名称" maxLength="22"  disabled="true"/>
		</tr>
		<tr>
		<x:inputTD name="courseAvgScore" required="false" label="课程平均分"  mask="nnn.nn"   colspan="3"/>		
		</tr>
		<tr>
		<x:inputTD name="teacherAvgScore" required="false" label="教师平均分" mask="nnn.nn"  colspan="3"/>		
		</tr>	
		<tr>
		<x:inputTD name="totalAvgScore" required="false" label="合计平均分" mask="nnn.nn"   colspan="3"/>		
		</tr>
	  </table>
</form>
