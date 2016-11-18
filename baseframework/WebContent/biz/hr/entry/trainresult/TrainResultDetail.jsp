<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="90px,140px,100px,140px"/>
		<x:hidden name="id"/>
		<x:hidden name="archivesId"/>
		<tr>
		<x:inputTD name="staffName" required="true" label="员工姓名" wrapper="select" />	
		<x:selectTD name="trainType" required="false" label="培训类型" maxLength="22"/>		
		
		</tr>
		<tr>
		<x:inputTD name="score" required="false" label="培训分数" maxLength="22" mask="nnn.nnn"/>		
		<x:selectTD name="trainStatus" required="false" label="培训标识" maxLength="22"/>		
		</tr>
		<tr>
		<x:inputTD name="startTime" required="false" label="培训开始时间" wrapper="date"/>		
		<x:inputTD name="endTime" required="false" label="培训结束时间" wrapper="date"/>		
		</tr>
		<tr>
		<x:textareaTD name="content" required="false" label="培训内容" rows="3" colspan="4" maxLength="256"/>
		</tr>
  </table>
</form>
