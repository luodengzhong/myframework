<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	  	<script src='<c:url value="/biz/hr/entry/entryapply/ArrivePrepared.js"/>'   type="text/javascript"></script>
  </head>
  <body>
  	<div class="ui-form" style="width: 99%;">
  			<div class="subject">新员工到岗准备事项清单</div>
	  	<form method="post" action="" id="submitForm">
		<div class="blank_div"></div>
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,100px,160px,100px,160px" />
		<x:hidden name="id"   />
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="archivesId"/>
		<x:hidden name="teacherId"/>
				<x:hidden name="organName"/>
				<x:hidden name="billCode"/>
				<x:hidden name="deptName"/>
				<x:hidden name="positionName"/>
				<x:hidden name="fillinDate" type="date"/>
				<x:hidden name="personMemberName"/>
				<x:hidden name="archiveTeacherId"/>
		<tr>			
		<x:inputTD name="staffName" required="true" label="入职员工"  wrapper="select"/>
		<x:inputTD name="ognName" required="false" label="入职单位"  readonly="true"/>					
		<x:inputTD name="centreName" required="false" label="入职中心" readonly="true"/>		
		</tr>
		<tr>
		<x:hidden name="ognId"/>
		<x:hidden name="centreId"/>
		<x:hidden name="dptId"/>
		<x:hidden name="staffKind"/>
		<x:inputTD name="dptName" required="false" label="入职部门" readonly="true"/>	
		<x:inputTD name="posName" required="false" label="入职岗位" readonly="true"/>	
		 <x:inputTD name="entryTime" required="true" label="入职时间" wrapper="date"/>
		</tr>
		</table>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"  style="margin: 2px"></div>
		</div> 
  </body>
</html>
