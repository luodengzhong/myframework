
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
     	<x:base include="dialog,grid,dateTime,tree,combox"/>
  </head>
  <body>
  	<div class="ui-form" style="width: 99%;">
	  	<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable'>
			        <x:layout />  　
			        <x:hidden name="auditId" />
			        
			        <x:hidden name="organId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" />

			        <x:hidden name="archivesId" />
			        
		<tr>
		     <x:inputTD name="organName" required="false" label="单位名称"  disabled="true"  />					
		     <x:inputTD name="fillinDate" required="false" label="填表日期" disabled="true"/>					
		     <x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>		
		</tr>
		<tr>			
		      <x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>					
		      <x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		      <x:inputTD name="personMemberName" required="false" label="制表人" disabled="true"/>	
		</tr>
		<tr>
		      <x:inputTD name="staffName" required="true" label="借调员工"  wrapper="select"/>	
		      <x:inputTD name="fromOrganName" required="false" label="借出单位" readonly="true"/>				
		      <x:inputTD name="fromCenterName" required="false" label="借出中心" readonly="true"/>					
		</tr>
		<tr>	
		      <x:inputTD name="fromDeptName" required="false" label="借出部门" readonly="true"/>			
		      <x:inputTD name="toOrganName" required="false" label="借入单位"  wrapper="select" maxLength="32"/>
		      <x:inputTD name="toCenterName" required="false" label="借入中心" wrapper="select" />	
		</tr>
		<tr>		
		     <x:inputTD name="toDeptName" required="false" label="借入部门" wrapper="select"/>	
		     <x:inputTD name="beginDate" required="false" label="开始时间" wrapper="date" />
		     <x:inputTD name="endDate" required="false" label="结束时间"   wrapper="date"/>			
		</tr>
		<tr>
              <x:textareaTD name="reason" rows="3" colspan="5"  required="false" label="借调原因"/>			
		</tr>		
		</table>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
  </body>
</html>
