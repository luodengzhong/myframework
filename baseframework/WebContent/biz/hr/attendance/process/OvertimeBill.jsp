<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree" />
<script src='<c:url value="/biz/hr/attendance/process/AttProcOverUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/process/OvertimeBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">加 班 申 请 单</div>
		<div style="text-align:left;color:red;padding-left:10px">法定节假日加班与其他加班请分开填报</div>
		<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
			<form method="post" action="" id="submitForm">
				<div style="margin: 0 auto;">
					<x:hidden name="overtimeId" />
					<x:hidden name="fullId" />
					<x:hidden name="organId" />
					<x:hidden name="centerId" />
					<x:hidden name="centerName" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="processDefinitionFile" />
					<x:hidden name="processDefinitionKey" />
					<x:hidden name="procUnitId" />
					<x:hidden name="status" value="0" />
					<table class='tableInput' style="width: 99%;">
						<x:layout proportion="10%,21%,12%,21%,10%" />
						<tr>
							<x:inputTD name="organName" disabled="true" required="false" label="公司名称" maxLength="64" />
							<x:inputTD name="billCode" disabled="true" required="false" label="单据号码" maxLength="32" />
							<x:inputTD name="fillinDate" disabled="true" required="false" label="填表日期" maxLength="7" wrapper="dateTime" />
						</tr>
						<tr>
						<x:inputTD name="personMemberName" disabled="true" required="false" label="姓名" maxLength="64" />
					    <x:inputTD name="deptName" disabled="true" required="false" label="所在部门" maxLength="64" />
						<x:inputTD name="positionName" disabled="true" required="false" label="所在部门" maxLength="64" />
							
						</tr>
						<tr>
					    <x:selectTD list="overtimeKindList" emptyOption="false" name="overtimeKindId" required="true" label="加班类别" />
						<x:inputTD name="startDate" required="true" label="开始日期 " mask="dateTime" maxLength="7"/>
						<x:inputTD name="endDate" required="true" label="结束日期" maxLength="7" mask="dateTime" />
						</tr>
						<tr>
							<x:hidden name="totalTimeHour" />
							<x:inputTD name="totalTimeContent" readonly="true" label="合计(天数)" maxLength="11" />
							<x:selectTD list="purposeList" emptyOption="false" required="true" name="purposeId" label="结算类别" />
							<td colspan="2" class="title">
								<a id="showCheckList" href="javascript:void(null);">查看打卡记录</a>
								<a id="hideCheckList" href="javascript:void(null);" style="display: none;">隐藏打卡记录</a>
							</td>
						</tr>
						<tr>
							<x:textareaTD name="workContent" required="true" label="工作内容" width="744" maxLength="128" rows="5" colspan="5">
							</x:textareaTD>
						</tr>
						<tr>
							<x:textareaTD name="remark" required="false" label="备注" width="744" maxLength="128" rows="3" colspan="5">
							</x:textareaTD>
						</tr>
					</table>
					<div class="blank_div"></div>
					<div style="width: 99%;" id="approverList">
						<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve" bizId="bizId" />
					</div>
					<div class="blank_div"></div>
					<table class='tableInput' style="width: 99%;">
						<tr>
							<x:textareaTD name="verificationReason" required="false" label="核销不一致原因" rows="2" width="744" colspan="5"></x:textareaTD>
						</tr>
						<tr>
							<x:hidden name="verificationTotalTimeHour" />
							<x:inputTD name="verificationStartDate" required="false" label="核销开始时间" maxLength="7" mask="dateTime" />
							<x:inputTD name="verificationEndDate" required="false" label="核销结束时间" maxLength="7" mask="dateTime" />
							<td class="title"><span id="verificationTotalTimeSpan" class="labelSpan"> 合计(天数) : </span></td>
							<td class="edit" colspan="1"><x:input id="verificationTotalTimeContent" readonly="true" name="verificationTotalTimeContent" label="核销合计时间"/></td>
					</table>
					<div style="width: 99%;display: none;" id="checkList">
						<x:title title="实际打卡时间" name="group" />
						<div id="checklistmaingrid"></div>
					</div>
					<div class="blank_div"></div>
					<div style="width: 99%;" id="checkerList">
						<x:taskExecutionList procUnitId="Check" defaultUnitId="Check" bizId="bizId" />
					</div>
				</div>
			</form>
		</div>
	</div>
</body>
</html>
