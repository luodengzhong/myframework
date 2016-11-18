<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,attachment" />
<script src='<c:url value="/biz/hr/talentschosen/talentschosenapply/CompeteCandidateAduitBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">${title}演讲候选人请示申请单</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
				<tr>
					<x:hidden name="aduitId" />
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="status" />
					<x:hidden name="personMemberId" />
					<x:hidden name="fullId" />
					<x:hidden name="competePositionId" />
					<x:hidden name="chosenPosId" />
					<x:hidden name="posLevel" />
					<x:hidden name="staffingPostsRank" />
					<x:hidden name="speechType" />
					<x:hidden name="chosenOrganId" />
					<x:hidden name="chosenCenterId" />
					<x:hidden name="chosenOrganName" />
					<x:hidden name="chosenCenterName" />
					<x:hidden name="chosenPosName" />
					<x:select name="juryTypeMap" list="juryType"
						cssStyle="display:none;" />

					<x:inputTD name="organName" required="false" label="机构名称"
						maxLength="64" disabled="true" />

					<x:inputTD name="fillinDate" required="false" label="填表日期"
						wrapper="date" disabled="true" />
					<x:inputTD name="billCode" required="false" label="单据号码"
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
					<td colspan="6" class="edit"><x:textarea name="desption" required="true"
							label="描述" rows="4" maxlength="500" /></td>
				</tr>
			</table>
			
			<div class="blank_div"></div>
			<x:title title="候选人列表" name="group" />
			<div id="maingrid" style="margin: 2px;"></div>
			<div class="blank_div"></div>
           <x:fileList bizCode="competeCandidateAduit" bizId="aduitId" id="competeCandidateAduitFileList" />
			<x:title title="演讲安排" name="group" />
			<table class='tableInput' id='inpTable'>
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
				<tr>
					<x:inputTD name="speechTime" required="true" label="演讲时间"
						wrapper="date" />
					<td class="title" colspan="4"></td>
				</tr>
				<tr>
					<x:inputTD name="speechPlace" required="true" label="演讲地点"
						maxLength="32" colspan="5" />
				</tr>
				<tr>
					<x:inputTD name="way" required="true" label="演讲方式" maxLength="128"
						colspan="5" />
				</tr>
				<tr>
					<x:textareaTD name="speechRule" required="true" label="演讲规则"
						maxLength="512" colspan="5" rows="5" />
				</tr>
				<tr>
					<x:textareaTD name="speechRemind" required="true" label="演讲提醒"
						maxLength="512" colspan="5" rows="4" />
				</tr>
				<tr>
					<x:textareaTD name="remark" required="true" label="评委组成"
						maxLength="512" colspan="5" rows="4" />

				</tr>
			</table>

			<%-- 	<x:title title="评委列表"  name="group"/>
			<div id="personid"  style="margin: 2px;"></div> --%>
		</form>
</body>
</html>
