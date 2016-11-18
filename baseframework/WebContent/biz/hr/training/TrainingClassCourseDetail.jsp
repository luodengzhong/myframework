<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	  <x:layout  proportion="90px,120px,80px,130px"/>
		<x:hidden name="trainingClassCourseId"/>
		<x:hidden name="trainingSpecialClassId"/>
		<x:hidden name="trainingCourseId"/>
		<x:hidden name="changeApplyId"/>
		<tr>
		 <x:inputTD name="className" required="true" label="班级名称" maxLength="22"  disabled="true"/>
		 <x:inputTD name="trainingCourseName" required="true" label="课程名称" maxLength="22"  disabled="true"/>
		</tr>
		<tr>
		<x:hidden name="trainingTeacherId"/>
		<x:inputTD name="teacherName" required="true" label="讲师"  maxLength="128"  colspan="3"    wrapper="select"
		 dataOptions="type:'hr',name:'trainTeacherSelect',callBackControls:{staffName:'#teacherName',trainingTeacherId:'#trainingTeacherId'}"
		/>		
		</tr>
		<tr>
		<x:inputTD name="courseStartTime" required="true" label="开始时间" maxLength="7" wrapper="dateTime"/>		
		<x:inputTD name="courseEndTime" required="true" label="结束时间" maxLength="7"  wrapper="dateTime"/>	
		</tr>	
		<x:inputTD name="coursePlace" required="true" label="开课地点" maxLength="128"  colspan="3"/>		
		</tr>
		<tr>
		<x:radioTD name="isHolidays" required="true" label="是否节假日"  dictionary="yesorno"  vlaue="0" colspan="3"/>		
		</tr>
		<tr>
		<x:inputTD name="remark" required="false" label="备注" maxLength="512"   colspan="3"/>		
		</tr>
	  </table>
</form>
