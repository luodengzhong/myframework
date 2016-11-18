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
  	<div class="subject">异动手续办理审批表</div>
	  	<form method="post" action="" id="submitForm">

			        <x:hidden name="resignationProcedureId" />
			        <x:hidden name="resignationId" />
			        
			        <x:hidden name="organId" />
			        <x:hidden name="centerId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" /> 
                    <x:hidden name="toOrganId" />
			        <x:hidden name="toCenterId" />
			        <x:hidden name="toDeptId" />
			        <x:hidden name="toPositionId" />
			        <x:hidden name="fromOrganId" />
			        <x:hidden name="fromCenterId" />
			        <x:hidden name="fromDeptId" />
			        <x:hidden name="fromPositionId" />
			        <x:hidden name="fromPayOrganId" />
			        <x:hidden name="toPayOrganId" />
			        <x:hidden name="archivesId" />
			        <x:hidden name="status" value="0" />
			        <x:hidden name="flowFlag" value="2"/> 
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
		<x:title name="group" title="异动前信息"  needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_01">
		<x:layout proportion="12%,21%,12%,21%,10%" />
		<tr>
		      <x:inputTD name="staffName" required="true" label="异动员工"  wrapper="select" />	
		      <x:selectTD name="type" dictionary="reshuffleType" required="true" label="异动类型"  />
		      <x:inputTD name="effectiveDate" required="true" label="生效日期"  wrapper="date"  readonly="true"  cssClass="textReadonly"/>				
		</tr>
		<tr>	
		      <x:inputTD name="fromOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>					
		      <x:inputTD name="fromCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>			
		      <x:inputTD name="fromDeptName" required="false" label="部门" readonly="true"  cssClass="textReadonly"/>
		</tr>
		<tr>
		      <x:inputTD name="fromPositionName" required="false" label="岗位"  wrapper="select"/>	
		      <x:selectTD name="fromPosLevel" dictionary="posLevel"  required="false" label="行政级别" />	
		      <x:inputTD name="fromPayOrganName" required="false" label="薪资单位" readonly="true" cssClass="textReadonly"/>
		      
		</tr>
		</table>
		<x:title name="group" title="异动后信息"  needLine="false"/>
		<table  class='tableInput' style="width: 99%;"  id="table_02">
		<x:layout proportion="12%,21%,12%,21%,10%" />
		<tr>
		      <x:inputTD name="toOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>	
		      <x:inputTD name="toCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>			
		      <x:inputTD name="toDeptName" required="false" label="部门" readonly="true" cssClass="textReadonly"/>	
		</tr>
		<tr>
		      <x:inputTD name="toPositionName" required="true" label="岗位" wrapper="select" />	
		      <x:selectTD name="toPosLevel"  dictionary="posLevel" required="false" label="行政级别" />
		      <x:inputTD name="toPayOrganName" required="false" label="薪资单位" wrapper="select" disabled="true"/>
		</tr>
		<tr>
		      <x:selectTD name="isHandoverNeeded"  required="true"  dictionary="yesOrNo"  label="办理交接手续 " value="1"/>
		      <x:selectTD name="payAdjustmentNeeded"  required="false"  dictionary="yesOrNo"  label="调整薪酬 " disabled="true"/>
		      <x:selectTD name="offsiteAllowanceNeeded"  required="false"  dictionary="yesOrNo"  label="申请异地津贴" disabled="true"/>
		</tr>
		<tr>		
		      <x:textareaTD name="reason" required="true" label="异动原因" colspan="5" rows="3" maxLength="256" />	
		</tr>
		</table>			
		</form>
 					<x:fileList bizCode="reshuffleProcedure" bizId="resignationProcedureId" id="reshuffleProcedureFileList" />
 			<div class="blank_div"></div>
			<x:title name="group" title="工作交接清单" needLine="false"/>
			<div id="maingrid"></div>
		</div> 
  </body>
</html>
