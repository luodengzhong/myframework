<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,date,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/specialreward/SpecialRewardApplyDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="subject">奖罚分配表</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;">
					<x:layout />
					<x:hidden name="auditId" />
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="fullId" />
					<x:hidden name="firstAuditId" />
					<input type='hidden' id="allotParentId" value="<c:out value="${requestScope.allotMap.speciaId}"/>" />
					<input type='hidden' id="allotOrganId" value="<c:out value="${requestScope.allotMap.organId}"/>" />
					<input type='hidden' id="allotKind" value="<c:out value="${requestScope.allotMap.allotKind}"/>" />
					<input type='hidden' id="allotAmount" value="<c:out value="${requestScope.allotMap.amount}"/>" />
					<tr>
						<x:inputTD name="organName" required="false" disabled="true" label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" required="false" disabled="true" label="单据号码" maxLength="32" />
						<x:inputTD name="fillinDate" required="false" disabled="true" label="填表日期" mask="date" />
					</tr>
					<tr>
						<x:inputTD name="personMemberName" required="false" disabled="true" label="制表人" maxLength="64" />
						<x:selectTD name="rewardApplyKind" required="true" label="类别" id="mainRewardApplyKind" />
						<x:inputTD name="allAmount" required="false" label="总金额" mask="positiveMoney" />
					</tr>
					<tr>
						<x:inputTD name="title" required="true" label="奖罚事由" maxLength="64" colspan="5" />
					</tr>
					<tr>
						<x:textareaTD name="remark" required="false" label="备注" maxLength="200" colspan="5"  rows="3"/>
					</tr>
					<c:if test="${requestScope.isAllot}">
					<tr>
						<td class="title"><span class="labelSpan">团队比例&nbsp;:</span></td>
						<td class="disable">
							<input type='hidden' id="modifGroupRatioValue" value="<c:out value="${requestScope.allotMap.groupRatio}"/>" />
							<div class="textLabel"><span id="showGroupRatio"><c:out value="${requestScope.allotMap.groupRatio}"/></span>(%)</div>
						</td>
						<td class="title">
							<input type='button' value='修改' class='buttonGray ' id='modifGroupRatio' style="display: none;"/>
							<c:if test="${requestScope.rewardApplyKind>0}">
								<input type='button' value='捐赠明细' class='buttonGray '  id='showTeamDonate'  style="display: none;"/>
							</c:if>
						</td>
						<td class="title">
							<c:if test="${requestScope.rewardApplyKind>0}">
								<label>员工互助基金:</label>
								<x:radio list="#{'0':'不捐赠','1':'捐赠'}" name="teamDonateFlag"  title="是否捐赠"  required="true" />
							</c:if>
						</td>
						<td class="disable" colspan="2"><div class="textLabel" id="TeamDonateInfo"><c:out value="${requestScope.teamDonateInfo}"/></div></td>
					</tr>
					</c:if>
				</table>
			</form>
			<div class="blank_div"></div>
			<x:fileList bizCode="SpecialReward" bizId="firstAuditId" id="specialRewardFileList" />
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>