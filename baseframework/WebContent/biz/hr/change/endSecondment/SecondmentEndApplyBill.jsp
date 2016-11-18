
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/hr/change/endSecondment/SecondmentEndApplyBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">结束借调期申请单</div>
		<form method="post" action="" id="submitForm">
			<x:layout proportion="12%,21%,12%,21%,10%" />
		
		<x:hidden name="endApplyId"/>
		<x:hidden name="auditId" />
		<x:hidden name="organId" />
		<x:hidden name="deptId" />
		<x:hidden name="positionId" />
		<x:hidden name="personMemberId" />
		<x:hidden name="fullId" />
		
		
			<x:hidden name="fromOrganId" />
				<x:hidden name="fromCenterId" />
				<x:hidden name="fromDeptId" />
				<x:hidden name="fromPosId" />
				
				<x:hidden name="toOrganId" />
				<x:hidden name="toCenterId" />
				<x:hidden name="toDeptId" />
				<x:hidden name="toPosId" />
		<x:hidden name="status" value="0" />
		  <x:title name="group" title="经办人信息" needLine="false"/>
		<table class='tableInput' style="width: 99%;">
	      	<tr>
					<x:inputTD name="organName" required="false" label="单位名称" disabled="true" />
					<x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true" />
					<x:inputTD name="billCode" required="false" label="单据号码" disabled="true" />
				</tr>
				<tr>
					<x:inputTD name="deptName" required="false" label="部门名称" disabled="true" />
					<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true" />
					<x:inputTD name="personMemberName" required="false" label="制表人" disabled="true" />
				</tr>
				
				</table>
				
	       <x:title name="group" title="员工借调单位信息（借入单位）" needLine="false"/>
		        <table  class='tableInput' style="width: 99%;"  id="table_01">
		        <x:layout proportion="12%,21%,12%,21%,10%" />
				<tr>
					<x:hidden name="archivesId" />
					<x:inputTD name="staffName" required="true" label="借调员工" wrapper="select" />
					<x:inputTD name="toOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>
					<x:inputTD name="toCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>
				</tr>
				<tr>
					<x:inputTD name="toDeptName" required="false" label="部门" readonly="true" cssClass="textReadonly"/>
					<x:inputTD name="toPosName" required="false" label="岗位"  readonly="true" cssClass="textReadonly"/>
					<x:selectTD name="toPosLevel" required="false"  dictionary="posLevel"  label="行政级别"  readonly="true" cssClass="textReadonly"/>
				</tr>
				</table>
				<x:title name="group" title="员工编制所在单位信息（借出单位）"  needLine="false"/>
		        <table  class='tableInput' style="width: 99%;"  id="table_01">
		        <x:layout proportion="12%,21%,12%,21%,10%" />
				<tr>
		            <x:inputTD name="fromOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>	
		            <x:inputTD name="fromCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>			
		            <x:inputTD name="fromDeptName" required="false" label="部门" readonly="true" cssClass="textReadonly"/>
				</tr>
				<tr>
				 <x:inputTD name="fromPosName" required="false" label="岗位" readonly="true" cssClass="textReadonly"/>
				 <x:selectTD name="fromPosLevel" required="false"  dictionary="posLevel"  label="行政级别"  readonly="true" cssClass="textReadonly"/>
				  <x:inputTD name="beginDate" required="false" label="开始时间" wrapper="date" readonly="true" cssClass="textReadonly"/>
				    				    
				    
				</tr>				
				
			</table>
			<x:title name="group" title="操作"  needLine="false"/>
			 <table  class='tableInput' style="width: 99%;"  id="table_01">
			   <x:layout proportion="12%,21%,12%,21%,10%" />
			   <tr>
			   <x:selectTD name="isContinueSecond" required="true" label="是否继续借调"  dictionary="yesorno"/>
			    <x:inputTD name="endTimeAdd" required="true" label="结束时间" wrapper="date" />
			   	<td colspan="2" class="title">&nbsp;</td>
               </tr>
               <tr  id="hideTr">
                <x:selectTD name="isHandoverNeeded" required="true" label="是否办理交接手续"  dictionary="yesorno"/>
               	<td colspan="4" class="title">&nbsp;</td>
               </tr>
                <tr>
					<x:textareaTD name="reason" rows="5" colspan="5" maxLength="256" required="true" label="原因" />
				</tr>
			   </table>
			
</form>
	</div>
</body>
</html>
