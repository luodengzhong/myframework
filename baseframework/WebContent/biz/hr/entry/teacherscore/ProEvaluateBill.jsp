<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	  	<script src='<c:url value="/biz/hr/entry/teacherscore/ProEvaluateBill.js"/>'   type="text/javascript"></script>
  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
  			<div class="subject">新员工试用期评价表</div>
	  	<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="80px,160px,100px,160px,80px,160px" />
					
		<x:hidden name="teacherScoreId"/>
		<x:hidden name="archivesId"/>
		<x:hidden name="teacherId"/>
				<x:hidden name="centreId"/>
				<x:hidden name="posId"/>
				<x:hidden name="dptId"/>
					<x:hidden name="centerName"/>
					<x:hidden name="taskId"/>
		<tr>
	    <x:inputTD name="staffName" required="false" label="员工姓名" maxLength="128"  readonly="true"/>		
	    <x:inputTD name="teacher" required="false" label="督导师" maxLength="22"  readonly="true"/>		
	   <x:inputTD name="scoreTime" required="true" label="评分时间" wrapper="date"/>					
	   	</tr>
	   	<tr>		
		<x:inputTD name="deptName" required="false" label="员工所在部门" maxLength="128"  readonly="true"/>					
		<x:inputTD name="posName" required="false" label="员工岗位" maxLength="128"  readonly="true"/>	
		<x:inputTD name="score" required="false" label="基础考试成绩" maxLength="128"  readonly="true"/>	
		</tr>			
		</table>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
  </body>
</html>
