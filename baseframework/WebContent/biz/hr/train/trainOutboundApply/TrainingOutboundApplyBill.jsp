<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/hr/train/trainOutboundApply/TrainingOutboundApplyBill.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">${outboundApplyTypeTextView}申请</div>
		<div class="bill_info">
			<span style="float: right;"> 单据号码：<strong><c:out
						value="${billCode}" /></strong>&nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
						name="fillinDate" type="date" /></strong>&nbsp;&nbsp; 经办人:<strong><c:out
						value="${personMemberName}" /></strong>&nbsp;&nbsp;
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<x:title title="申请人基本信息" name="group" />
			<table class='tableInput' style="width: 99%;">
				<x:layout proportion="75px,150px,100px,150px,100px,150px" />
				<tr>
					<x:hidden name="trainingOutboundApplyId" />
					<x:hidden name="organName" />
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="deptName" />
					<x:hidden name="positionId" />
					<x:hidden name="positionName" />
					<x:hidden name="personMemberId" />
					<x:hidden name="personMemberName" />
					<x:hidden name="fullId" />
					<x:hidden name="status" />
					<x:hidden name="billCode" />
					<x:hidden name="fillinDate" type="date" />
					<x:hidden name="version" />
					<x:hidden name="archivesId" />
					<x:hidden name="outTrainPersonFullId"/>
					<x:hidden name="predictFee"/>
					<x:inputTD name="staffName" required="false" label="申请人"
						wrapper="select" />
					<x:hidden name="ognId" />
					<x:inputTD name="ognName" required="false" label="单位"
						maxLength="32" readonly="true" cssClass="textReadonly" />
					<x:hidden name="centreId" />
					<x:inputTD name="centreName" required="false" label="所属一级中心"
						maxLength="32" readonly="true" cssClass="textReadonly" />
				</tr>
				<tr>
					<x:hidden name="dptId" />
					<x:inputTD name="dptName" required="false" label="部门"
						maxLength="64" readonly="true" cssClass="textReadonly" />
					<x:inputTD name="posName" required="false" label="岗位"
						maxLength="64" readonly="true" cssClass="textReadonly" />
					<x:inputTD name="employedDate" required="false" label="入职时间"
						wrapper="date" readonly="true" cssClass="textReadonly" />
				</tr>
			</table>
			<x:title title="培训类别选择(全部必填)" name="group" id="trainTypeSelect" />
			<table class='tableInput' style="width: 99%;">
				<x:layout proportion="120px,130px,100px,100px,100px,100px" />
				<tr>
					<x:selectTD name="outboundApplyType" required="true"
						label="外送培训类别选择" />
					<td colspan="4" class="title">&nbsp;</td>
				</tr>
				<tr id="educationApplyTypeTr">
					<x:selectTD name="educationApplyType" required="false" label="申请类别" />
					<td colspan="4" class="title">&nbsp;</td>
				</tr>
				<tr id="applyPropertyTr">
					<x:selectTD name="applyProperty" required="false" label="申请性质" />
					<td colspan="4" class="title">&nbsp;</td>
				</tr>
			</table>
			<x:title title="外送培训人员列表" name="group" />
			<div id="maingrid" ></div>
			<div class="blank_div"></div>
			
			<div id="zxDiv">
				<x:title title="外送专项培训基本信息(全部必填)" name="group" id="trainInfo" />
				<table class='tableInput' id='trainInfoTable' style="width: 99%;">
					<x:layout proportion="75px,150px,100px,150px,100px,150px" />
					<tr>
						<x:inputTD name="course" required="true" label="培训课程"
							maxLength="256" />
						<x:inputTD name="place" required="true" label="培训地点"
							maxLength="256" colspan="3" />
					</tr>
					<tr>
						<x:inputTD name="teacherName" required="true" label="讲师姓名"
							maxLength="32" />
						<x:inputTD name="teacherDesc" required="true" label="讲师简介"
							maxLength="512" colspan="3" />
					</tr>
					<tr>
						<x:inputTD name="trainingOrgName" required="true" label="培训机构"
							maxLength="256" />
						<x:inputTD name="trainingOrgDesc" required="false" label="培训机构简介"
							maxLength="512" colspan="3" rows="5" />
					</tr>
				</table>
			</div>
			<div id="educationTrainDiv">
				<x:title title="学历提升培训基本信息(全部必填)" name="group" id="educationTrain" />
				<table class='tableInput' id='educationTrainTable'
					style="width: 99%;">
					<x:layout proportion="75px,150px,100px,150px,100px,150px" />
					<tr>
						<x:inputTD name="educationOrgan" required="false" label="招生单位"
							maxLength="64" />
						<x:inputTD name="educationPlace" required="false" label="上课地点"
							maxLength="256" colspan="3" />
					</tr>
				</table>
			</div>
			<div id="getCertificationTrainDiv">
				<x:title title="专业技术资格认证培训基本信息(全部必填)" name="group"
					id="getCertificationTrain" />
				<table class='tableInput' id='getCertificationTrainTable'
					style="width: 99%;">
					<x:layout proportion="75px,150px,100px,150px,100px,150px" />
					<tr>
						<x:inputTD name="certificationName" required="false" label="认证名称"
							maxLength="64" />
						<x:inputTD name="certificationOrgan" required="false" label="颁发机构"
							maxLength="256" colspan="3" />
					</tr>
					<tr>
						<x:inputTD name="hostTrainOrgan" required="false" label="培训主办机构"
							maxLength="64" />
						<x:inputTD name="certificationPlace" required="false" label="培训地点"
							maxLength="256" colspan="3" />
					</tr>
				</table>
			</div>
			<table class='tableInput' id='trainInfoTable' style="width: 99%;">
				<x:layout proportion="75px,150px,100px,150px,100px,150px" />
				<tr>
					<x:inputTD name="startTime" required="true" label="培训开始时间"
						wrapper="date" />
					<x:inputTD name="endTime" required="true" label="培训结束时间"
						wrapper="date" />
					<td colspan="2" class="title">&nbsp;</td>
				
				</tr>
			<!-- 	<tr>
				<x:inputTD name="predictFee" required="true" label="预计培训费用/元"
						mask="nnnnnnnnnn" />
				<x:inputTD name="travelExpenses" required="true" label="差旅费/元"
						mask="nnnnnnnnnn" />
				<td colspan="2" class="title">&nbsp;</td>
				</tr> -->
				<tr>
					<x:textareaTD name="applicationContent" required="true"
						label="申请内容及理由" maxLength="512" colspan="5" rows="7" />
				</tr>
			</table>
				<x:fileList bizCode="trainingOutboundApply" bizId="trainingOutboundApplyId" id="trainingOutboundApplyFileList" />
		</form>
	</div>
</body>
</html>