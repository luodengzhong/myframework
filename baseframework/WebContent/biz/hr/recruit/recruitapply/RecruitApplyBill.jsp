<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree" />
<script
	src='<c:url value="/biz/hr/recruit/recruitapply/RecruitApplyBill.js"/>'
	type="text/javascript"></script>
<script
	src='<c:url value="/biz/hr/recruit/recruitapply/RecruitApply.js"/>'
	type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">招聘申报审批表</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
				<x:hidden name="jobApplyId" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="posDeclareId" />
				<tr>
					<x:inputTD name="organName" required="false" label="单位名称"
						disabled="true" />
					<x:inputTD name="fillinDate" required="false" label="填表日期"
						disabled="true" wrapper="date" />
					<x:inputTD name="billCode" required="false" label="单据编号"
						disabled="true" />
				</tr>
				<tr>
					<x:inputTD name="deptName" required="false" label="部门名称"
						disabled="true" />
					<x:inputTD name="positionName" required="false" label="岗位名称"
						disabled="true" />
					<x:inputTD name="personMemberName" required="false" label="申请人"
						disabled="true" />
				</tr>

				<tr>
					<x:hidden name="recDptId" />
					<x:inputTD name="recDptName" required="true" label="招聘部门"
						wrapper="select" />
					<x:hidden name="recPosId" />
					<x:inputTD name="recPosName" required="true" label="招聘岗位"
						wrapper="select" />
					<x:selectTD name="posLevel" required="true" label="行政级别" />

				</tr>
				<tr>
					<x:inputTD name="recNum" required="true" label="招聘人数" mask="nnn" />
					<x:selectTD name="staffingLevel" required="true" label="编制状态" />
					<x:inputTD name="workDate" required="true" label="要求上岗时间"
						wrapper="date" />
					<x:hidden name="staffKind" />
				</tr>
				<tr>
					<x:inputTD name="organNumDes" required="false" label="编制说明"
						colspan="3" readonly="true" />
					<x:selectTD name="staffingPostsRank" required="true" label="岗位职级" />
				</tr>
				<tr>
					<x:textareaTD name="reason" required="true" label="招聘原因" rows="3"
						colspan="5" maxLength="100" />
				</tr>
			</table>
			<x:title title="岗位描述" name="group" />
			<table class='tableInput' id='inputQueryTable'>
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
				<tr>
					<x:hidden name="posDeclareId" />
					<x:hidden name="heightReq" />
					<x:inputTD name="eduReq" required="true" label="学历要求"
						maxLength="16" />
					<x:inputTD name="ageReq" required="true" label="年龄要求"
						maxLength="16" />

					<td colspan=2 class='title'></td>
				</tr>
				<tr>
					<x:inputTD name="yearReq" required="true" label="工作经验"
						maxLength="32" />
					<x:inputTD name="address" required="true" label="户籍属地"
						maxLength="64" />
					<td colspan=2 class='title'></td>
				</tr>
				<tr>
					<x:textareaTD name="professionalReq" required="true" label="专业资格"
						colspan="5" maxLength="100" />
				</tr>
				<tr>
					<x:textareaTD name="posDesReq" required="true" label="岗位职责"
						rows="6" colspan="5" maxLength="512" />

				</tr>
				<tr>
					<x:textareaTD name="takeJobReq" required="true" label="任职要求"
						rows="6" colspan="5" maxLength="512" />
				</tr>
				<tr>
					<x:textareaTD name="otherReq" required="true" label="其他要求" rows="3"
						colspan="5" maxLength="512" />
				</tr>
			</table>

			<x:title title="其他" name="group" />
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="100px,160px,80px,160px,80px,160px" />
				<tr>
					<x:selectTD name="isInterRecommend" dictionary="yesorno"
						label="是否支持内部推荐" />

					<x:selectTD name="isHeadhunter" dictionary="yesorno" label="猎头是否可见" />
					<x:selectTD name="isSchoolrecruit" dictionary="yesorno" label="是否校园招聘"  value="0"/>

				</tr>

			</table>
		</form>
	</div>
</body>
</html>
