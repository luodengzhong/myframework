<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree" />
<script src='<c:url value="/biz/hr/attendance/process/AttProcUtil.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script
	src='<c:url value="/biz/hr/attendance/process/BusinessTripBill.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">出 差 申 请 单</div>
		<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
			<form method="post" action="" id="submitForm">
				<div style="margin: 0 auto;">
					<x:hidden name="businessTripId" />
					<x:hidden name="fullId" />
					<x:hidden name="organId" />
					<x:hidden name="centerId" />
					<x:hidden name="centerName" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="positionName" />
					<x:hidden name="processDefinitionFile" />
					<x:hidden name="processDefinitionKey" />
					<x:hidden name="procUnitId" />
					<x:hidden name="status" value="0" />
					<x:hidden name="feeDeptId" />
					<table class='tableInput' style="width: 99%;">
						<x:layout proportion="10%,21%,12%,21%,10%" />
						<tr>
							<x:inputTD name="organName" disabled="true" required="false"
								label="公司名称" maxLength="64" />
							<x:inputTD name="billCode" disabled="true" required="false"
								label="单据号码" maxLength="32" />
							<x:inputTD name="fillinDate" disabled="true" required="false"
								label="填表日期" maxLength="7" wrapper="dateTime" />
						</tr>
						<tr>
							<x:inputTD name="deptName" disabled="true" required="false"
								label="部门" maxLength="64" />
							<x:inputTD name="personMemberName" disabled="true"
								required="false" label="姓名" maxLength="64" />
							<td class="title" colspan="2"></td>

						</tr>
						<tr>
							<x:selectTD name="reimbursementStandard" required="false"
								dictionary="reimbursementStandard" label="报销标准"
								emptyOption="false" />
							<x:inputTD name="feeDeptName" required="false" label="费用承担部门"
								wrapper="select" />
							<x:inputTD name="address" required="false" label="出差地点"
								maxLength="100"  readonly="true"/>
						</tr>
						<tr>
							<x:inputTD name="startDate" required="true" label="开始时间 "
								mask="dateTime" maxLength="7" />
							<x:inputTD name="endDate" required="true" label="结束时间"
								maxLength="7" mask="dateTime" />
							<x:inputTD name="totalTime" label="合计(天数)" maxLength="11" />
						</tr>
						<tr>
							<x:select name="addressCityList" cssStyle="display:none;" list="addressCityList" emptyOption="false"/>
							<x:textareaTD name="reason" required="true" label="出差事由"
								width="744" rows="3" colspan="5" maxlength="350">
							</x:textareaTD>
						</tr>
						<!-- 
					<tr>
						<x:textareaTD name="remark" required="false" maxLength="128" label="备注" width="744"
							rows="2" colspan="5">
						</x:textareaTD>
					</tr> -->
					</table>
					<table border=0 cellspacing=0 cellpadding=0 style="width: 99%;">
						<tr>
							<td style="width: 50%;"><x:title title="出差人员" name="group" />
								<div id="maingrid"></div>
							</td>
							<td style="width: 50%;">
								<div id='group' class="navTitle">
									<span class='group'>&nbsp;</span>&nbsp;
									<span class="titleSpan">出差地点</span>
									<span style="color:red;font-size: 10px;font-weight: normal;">费用系统需要详细的出差地点及时间，请认真填写以下信息。(输入'cd'会自动匹配出'成都')</span>
								</div>
								<div class="navline"></div>
								<div id="addressgrid"></div>
							</td>
						</tr>
					</table>
					<div class="blank_div"></div>
					<div style="width: 99%;" id="approverList">
						<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve"
							bizId="bizId" />
					</div>
					<div class="blank_div"></div>
					<span style="color:red;font-size: 10px;font-weight: normal;">核销时，请按实际情况调整出差地点及时间;</span>
					<table class='tableInput' style="width: 99%;">
						<tr>
							<x:textareaTD name="verificationReason" required="false"
								label="核销不一致原因" rows="2" width="744" colspan="5" maxlength="200"></x:textareaTD>
						</tr>
						<tr>
							<x:inputTD name="verificationStartDate" required="false"
								label="核销开始时间" maxLength="7" mask="dateTime" />
							<x:inputTD name="verificationEndDate" required="false"
								label="核销结束时间" maxLength="7" mask="dateTime" />
							<x:inputTD name="verificationTotalTime" readonly="true"
								label="合计(天数)" maxLength="11" />
						</tr>

					</table>
					<div class="blank_div"></div>
					<div style="width: 99%;" id="checkerList">
						<x:taskExecutionList procUnitId="Check" defaultUnitId="Check"
							bizId="bizId" />
					</div>
					<div class="blank_div"></div>
				</div>
			</form>
		</div>
	</div>
</body>
</html>
