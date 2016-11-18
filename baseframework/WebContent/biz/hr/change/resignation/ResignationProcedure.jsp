<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
     	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
  	  	<script src='<c:url value="/biz/hr/change/resignation/ResignationProcedure.js"/>'   type="text/javascript"></script>
  </head>
  <body>
  	<div class="ui-form" style="width: 99%;">
  	<div class="subject">离职手续办理审批表</div>
	  	<form method="post" action="" id="submitForm">

			        <x:hidden name="resignationProcedureId" />
			        <x:hidden name="resignationId" />
			        
			        <x:hidden name="organId" />
			        <x:hidden name="centerId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" /> 

                    <x:hidden name="orgnizationId" /> 
                    <x:hidden name="centerId" /> 
                    <x:hidden name="departmentId" /> 
                    <x:hidden name="posId" /> 

			        <x:hidden name="archivesId" />
			        <x:hidden name="status" value="0" />
			        <x:hidden name="flowFlag" value="1"/> 
			<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong>&nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong>&nbsp;&nbsp; 经办人:<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>	
			<div  style="display: none;">
		<table>		        
		<tr>
		     <x:inputTD name="organName" required="false" label="单位名称"  disabled="true"  />					
		     <x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true"/>					
		     <x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>		
		</tr>
		<tr>			
		      <x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>					
		      <x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		      <x:inputTD name="personMemberName" required="false" label="制表人" disabled="true"/>	
		</tr>
		</table>
		</div>
		<x:title name="group" title="基本信息" needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_01">
		<x:layout proportion="73px,160px,100px,160px,100px,160px" />		
		<tr>
		      <x:inputTD name="staffName" required="true" label="员工" wrapper="select"/>	
		      <x:inputTD name="employedDate" required="false" label="入职日期" wrapper="date" readonly="true"/>				
		      <x:inputTD name="orgnizationName" required="false" label="单位" readonly="true"/>					
		      
		</tr>
		
		<tr>	
		      <x:inputTD name="centerName" required="false" label="中心" readonly="true"/>			
		      <x:inputTD name="departmentName" required="false" label="部门" maxLength="32" readonly="true"/>
		      <x:inputTD name="posName" required="false" label="岗位" readonly="true"/>	
		</tr>
		<tr>
		        <x:hidden name="handoverPsmId"/>
		        <x:inputTD name="handoverPsmName" required="false" label="待办任务交接人"  maxLength="32"  wrapper="select"/>
		    	<x:inputTD name="accountDeadlineDate" required="false" label="账号注销时间" wrapper="date"  readonly="true"/>
				<x:inputTD name="attendanceDeadlineDate" required="false" label="考勤预计截止日期" wrapper="date" readonly="true"/>	
		      
		</tr>
		</table>
			</form>
		   <x:fileList bizCode="resignationProcedure" bizId="resignationProcedureId" id="resignationProcedureFileList" />
			
			<div class="blank_div"></div>
			<x:title name="group" title="工作交接清单" needLine="false"/>
			<div id="maingrid"></div>
		</div> 
  </body>
</html>
