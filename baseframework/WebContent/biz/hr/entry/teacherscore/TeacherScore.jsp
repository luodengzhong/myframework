<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	  	<script src='<c:url value="/biz/hr/entry/teacherscore/TeacherScore.js"/>'   type="text/javascript"></script>
<%--   	  	  	    <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
 --%>  	  	
  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
  			<div class="subject">督导考核评分表</div>
	  	<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable' >
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
	    <x:inputTD name="staffName" required="false" label="员工姓名" maxLength="128" readonly="true"/>		
	    <x:inputTD name="teacher" required="false" label="督导师" maxLength="22"  readonly="true"/>		
	   <x:inputTD name="scoreTime" required="true" label="评分时间" wrapper="date"/>					
	   	</tr>
	   	<tr>		
		<x:inputTD name="teacherDptName" required="false" label="督导师所在部门" maxLength="128"  readonly="true"/>					
		<x:inputTD name="teacherPosName" required="false" label="督导师岗位" maxLength="128"  readonly="true"/>	
		<td  colspan="2"  class="title">				
		</tr>			
		</table>
			<table class='tableInput' id='queryTable1'>
				<x:layout proportion="100px,160px,80px,160px,80px,160px" />
				<tr>
			 	<x:title title="员工确认" name="group"/>
		   </tr>	
				<tr>
				<x:selectTD name="isFinish" required="true" label="是否完成督导任务" dictionary="yesorno" />		
			    <td colspan="4" class="title"></td>
				
				</tr>
				</table>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
  </body>
</html>
