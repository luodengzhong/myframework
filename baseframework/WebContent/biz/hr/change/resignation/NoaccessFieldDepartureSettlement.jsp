<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html>
<head>
<x:base include="dateTime,dialog" />
<script src='<c:url value="/biz/hr/change/resignation/PayDepartureSettlement.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">员工离职工资结算清单</div>
		<div class="bill_info">
			<span style="float: left;"> 单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp; 制表日期：<strong><x:format
						type="date" name="fillinDate" /> </strong>
			</span> <span style="float: right;"> 制表人：<strong><c:out value="${personMemberName}" /></strong>
			</span>
		</div>
	</div>
		<div class="ui-form">
			<input type="hidden"  value="true" id="NoaccessFieldDepartureSettlement"/>
			<form method="post" action="" id="submitForm">
				<x:hidden name="departureSettlementMainId" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="organName" />
				<x:hidden name="fillinDate" type="date" />
				<x:hidden name="billCode" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="personMemberName" />
				<table class='tableInput' style="width: 99%; margin-left: 4px;">
					<x:layout proportion="12%,21%,12%,21%,10%" />
					<tr>
						<x:inputTD name="settlementArchivesName" required="false" label="姓名" maxLength="32" disabled="true" />
						<x:inputTD name="settlementOrganName" required="false" label="单位" maxLength="64" disabled="true" />
						<x:inputTD name="settlementCentreName" required="false" label="所属一级中心" maxLength="64" disabled="true" />
					</tr>
					<tr>
						<x:inputTD name="settlementDeptName" required="false" label="部门" maxLength="64" disabled="true" />
						<x:inputTD name="settlementPosName" required="false" label="岗位" maxLength="64" disabled="true" />
						<x:inputTD name="phoneNumber" required="false" label="通讯号码" maxLength="64" disabled="true" />
					</tr>
					<tr><x:textareaTD name="remark" label="备注" maxlength="200" colspan="5" rows="3"/></tr>
				</table>
			</form>
		</div>
		<div class="blank_div"></div>
		<div id='detailTabs'>
			<div class="ui-tab-links">
				<h2>结算单详细</h2>
				<ul>
					<c:forEach items="${requestScope.settlements}" var="settlement">
						<li>考勤截止&nbsp;<fmt:formatDate value="${settlement.attendanceDate}" type="date" /></li>
					</c:forEach>
				</ul>
			</div>
			<div class="ui-tab-content">
				<c:forEach items="${requestScope.settlements}" var="settlement">
					<div class="layout">
						<form method="post" action="" class="settlementForm" id="settlementForm_<c:out value="${settlement.settlementId}" />">
							<input type="hidden" name="settlementId" value="<c:out value="${settlement.settlementId}" />" />
							<x:title name="group" title="工资增加项" />
							<div class="blank_div"></div>
							<table class='tableInput' style="width: 99%;">
								<x:layout proportion="12%,21%,12%,21%,10%" />
								<tr>
									<td class="title"><span class="labelSpan">独子补贴&nbsp;:</span></td>
									<td class="edit"><input type="text" name="oneChildPay" value="<c:out value="${settlement.oneChildPay}"/>" class="text"
										mask="money" /></td>
									<td class="title"><span class="labelSpan">误餐补贴&nbsp;:</span></td>
									<td class="edit"><input type="text" name="mealAllowance" value="<c:out value="${settlement.mealAllowance}"/>" class="text"
										mask="money" /></td>
									<td class="title"><span class="labelSpan">结婚礼金&nbsp;:</span></td>
									<td class="edit"><input type="text" name="pay03" value="<c:out value="${settlement.pay03}"/>" class="text" mask="money" /></td>
								</tr>
								<tr>
									<td class="title"><span class="labelSpan">生日礼金&nbsp;:</span></td>
									<td class="edit"><input type="text" name="pay04" value="<c:out value="${settlement.pay04}"/>" class="text" mask="money" /></td>
									<td class="title"><span class="labelSpan">销售提成&nbsp;:</span></td>
									<td class="edit"><input type="text" name="salesCommissions" value="<c:out value="${settlement.salesCommissions}"/>"
										class="text" mask="money" /></td>
									<td class="title"><span class="labelSpan">离职补偿&nbsp;:</span></td>
									<td class="edit"><input type="text" name="pay05" value="<c:out value="${settlement.pay05}"/>" class="text" mask="money" /></td>
								</tr>
								<tr>
									<td class="title"><span class="labelSpan">奖励合计&nbsp;:</span></td>
									<td class="edit"><input type="text" name="award" value="<c:out value="${settlement.award}"/>" class="text" mask="money" /></td>
									<td class="title"><span class="labelSpan">补发工资&nbsp;:</span></td>
									<td class="edit"><input type="text" name="backPay" value="<c:out value="${settlement.backPay}"/>" class="text" mask="money" /></td>
									<td class="title"><span class="labelSpan">税后补发&nbsp;:</span></td>
									<td class="edit"><input type="text" name="pay01" value="<c:out value="${settlement.pay01}"/>" class="text" mask="money" /></td>
								</tr>
							</table>
							<x:title name="group" title="工资减少项" />
							<div class="blank_div"></div>
							<table class='tableInput' style="width: 99%;">
								<x:layout proportion="12%,21%,12%,21%,10%" />
								<tr>
									<td class="title"><span class="labelSpan">养老保险扣款&nbsp;:</span></td>
									<td class="edit"><input type="text" name="oldAgeBenefit" value="<c:out value="${settlement.oldAgeBenefit}"/>" class="text"
										mask="money" /></td>
									<td class="title"><span class="labelSpan">医疗保险扣款&nbsp;:</span></td>
									<td class="edit"><input type="text" name="medicare" value="<c:out value="${settlement.medicare}"/>" class="text" mask="money" />
									</td>
									<td class="title"><span class="labelSpan">失业保险扣款&nbsp;:</span></td>
									<td class="edit"><input type="text" name="unemploymentInsurance" value="<c:out value="${settlement.unemploymentInsurance}"/>"
										class="text" mask="money" /></td>
								</tr>
								<tr>
									<td class="title"><span class="labelSpan">扣住房公积金&nbsp;:</span></td>
									<td class="edit"><input type="text" name="housingFund" value="<c:out value="${settlement.housingFund}"/>" class="text"
										mask="money" /></td>
									<td colspan="4" class="title">&nbsp;</td>
								</tr>
								<tr>
									<td class="title"><span class="labelSpan">罚款合计&nbsp;:</span></td>
									<td class="edit"><input type="text" name="penalty" value="<c:out value="${settlement.penalty}"/>" class="text" mask="money" /></td>
									<td class="title"><span class="labelSpan">其他扣款&nbsp;:</span></td>
									<td class="edit"><input type="text" name="deductPay" value="<c:out value="${settlement.deductPay}"/>" class="text"
										mask="money" /></td>
									<td class="title"><span class="labelSpan">税后补扣&nbsp;:</span></td>
									<td class="edit"><input type="text" name="pay02" value="<c:out value="${settlement.pay02}"/>" class="text" mask="money" /></td>
								</tr>
							</table>
							<x:title name="group" title="个人税款" />
							<table class='tableInput' style="width: 99%;">
								<div class="blank_div"></div>
								<x:layout proportion="12%,21%,12%,21%,10%" />
								<c:if test="${settlement.accountsType=='performance'}">
								<tr>
									<td class="title"><span class="labelSpan">关联单据计税工资&nbsp;:</span></td>
									<td class="disable" colspan="1">
										<input type="text" name="relevanceTaxablePay" value="<c:out value="${settlement.relevanceTaxablePay}"/>" class="text textReadonly" mask="money"  readonly="true" />
									</td>
									<td class="title"><span class="labelSpan">关联单据所得税&nbsp;:</span></td>
									<td class="disable" colspan="1">
										<input type="text" name="relevanceIncomeTax" value="<c:out value="${settlement.relevanceIncomeTax}"/>" class="text textReadonly" mask="money"  readonly="true" />
									</td>
									<td colspan="2" class="title">&nbsp;</td>
								</tr>
								</c:if>
								<tr>
									<td class="title"><span class="labelSpan">计税工资&nbsp;:</span></td>
									<td class="disable" colspan="1"><input type="text" name="taxablePay" value="<c:out value="${settlement.taxablePay}"/>"
										class="text textReadonly" mask="money" readonly="true" /></td>
									<td class="title"><span class="labelSpan">个人所得税&nbsp;:</span></td>
									<td class="disable" colspan="1"><input type="text" name="incomeTax" value="<c:out value="${settlement.incomeTax}"/>"
										class="text textReadonly" mask="money" readonly="true" /></td>
									<td colspan="2" class="title">&nbsp;</td>
								</tr>
							</table>
							<x:title name="group" title="合计" />
							<div class="blank_div"></div>
							<table class='tableInput' style="width: 99%;">
								<x:layout proportion="12%,21%,12%,21%,10%" />
								<tr>
									<td class="title"><span class="labelSpan">应发工资&nbsp;:</span></td>
									<td class="disable" colspan="1"><input type="text" name="totalPay" value="<c:out value="${settlement.totalPay}"/>"
										class="text textReadonly" mask="money" readonly="true" /></td>
									<td class="title"><span class="labelSpan">扣款合计&nbsp;:</span></td>
									<td class="disable" colspan="1"><input type="text" name="deductAll" value="<c:out value="${settlement.deductAll}"/>"
										class="text textReadonly" mask="money" readonly="true" /></td>
									<td class="title"><span class="labelSpan">实发工资&nbsp;:</span></td>
									<td class="disable" colspan="1"><input type="text" name="netPay" value="<c:out value="${settlement.netPay}"/>"
										class="text textReadonly" mask="money" readonly="true" /></td>
								</tr>
							</table>
						</form>
					</div>
				</c:forEach>
			</div>
		</div>
</body>
</html>
