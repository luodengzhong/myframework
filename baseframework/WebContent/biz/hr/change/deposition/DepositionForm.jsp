
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
		      <x:inputTD name="staffName" required="false" label="免职员工"  readonly="true"/>	
		      <x:inputTD name="orgnizationName" required="false" label="目前单位" readonly="true"/>					
		      <x:inputTD name="centerName" required="false" label="目前中心" readonly="true"/>			
		      
		</tr>
		<tr>	
		      <x:inputTD name="departmentName" required="false" label="目前部门" maxLength="32"  readonly="true"/>
		      <x:inputTD name="posName" required="false" label="目前岗位" readonly="true"/>	
		</tr>
		
		<tr>
		      <x:inputTD name="depositionPosName" required="false" label="免去职务"  colspan="5"/>	
		      				
		</tr>
		<tr>
		     <x:textareaTD name="deposeReason" required="false" rows="2" label="免职原因" colspan="5"/>
		</tr>
		</table>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
  </body>
</html>
