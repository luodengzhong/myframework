
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/hr/change/secondment/Secondment.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">借调审批表</div>
		<form method="post" action="" id="submitForm">
			<x:layout proportion="12%,21%,12%,21%,10%" />
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
				<x:hidden name="fromPosLevel" />
				<x:hidden name="toOrganId" />
				<x:hidden name="toCenterId" />
				<x:hidden name="toDeptId" />
				<x:hidden name="toPosId" />
				<x:hidden name="archivesId" />
				<x:hidden name="personId" />
				<x:hidden name="fromPersonMemberId" />
				<x:hidden name="fromPayOrganId" />
				<x:hidden name="toPayOrganId" />
				<x:hidden name="status" value="0" />
				<x:hidden name="flowFlag" value="3"/>
				<x:hidden name="toPosLevel" />
				<x:hidden name="toStaffingPostsRank" />
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
				</div>
				<x:title name="group" title="借调前信息" needLine="false"/>
		        <table  class='tableInput' style="width: 99%;"  id="table_01">
		        <x:layout proportion="12%,21%,12%,21%,10%" />
				<tr>
					<x:inputTD name="staffName" required="true" label="借调员工" wrapper="select" />
					<x:inputTD name="fromOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>
					<x:inputTD name="fromCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>
				</tr>
				<tr>
					<x:inputTD name="fromDeptName" required="false" label="部门" readonly="true" cssClass="textReadonly"/>
					<x:inputTD name="fromPosName" required="true" label="岗位"  wrapper="select"/>
					 <x:selectTD name="fromStaffingPostsRank" required="false"  dictionary="staffingPostsRank" label="职级" />
				</tr>
				<tr>
					<x:hidden name="fromWageOrgId" />
					<x:inputTD name="fromWageOrgName" required="false" label="工资主体单位" readonly="true" cssClass="textReadonly"/>
					<x:inputTD name="fromPayOrganName" required="false" label="工资归属单位" readonly="true" cssClass="textReadonly"/>
					<td colspan="2" class="title">&nbsp;</td>
				</tr>
				</table>
				<x:title name="group" title="借调后信息"  needLine="false"/>
		        <table  class='tableInput' style="width: 99%;"  id="table_01">
		        <x:layout proportion="12%,21%,12%,21%,10%" />
				<tr>
		            <x:inputTD name="toOrganName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>	
		            <x:inputTD name="toCenterName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>			
		            <x:inputTD name="toDeptName" required="false" label="部门" readonly="true" cssClass="textReadonly"/>
				</tr>
				<tr>
				    <x:inputTD name="toPosName" required="true" label="岗位" wrapper="select" />
				    <x:hidden name="toWageOrgId" />
					<x:inputTD name="toWageOrgName" required="true" label="工资主体单位" wrapper="select"/>
					<x:inputTD name="toPayOrganName" required="true" label="工资归属单位" wrapper="select" />
				</tr>				
				<tr>
				    <x:inputTD name="beginDate" required="true" label="开始时间" wrapper="date" />
					<x:inputTD name="endDate" required="true" label="结束时间" wrapper="date" />
				    <x:selectTD name="offsiteAllowanceNeeded"  required="false"  dictionary="yesOrNo"  label="申请异地津贴"/>
				</tr>
				<tr>
					<x:textareaTD name="reason" rows="3" colspan="5" maxLength="256" required="true" label="借调原因" />
				</tr>
			</table>
		</form>
		<div class="blank_div"></div>
		<x:fileList bizCode="HRSecondment" bizId="auditId" id="secondmentFileList" />
	</div>
</body>


</form>
