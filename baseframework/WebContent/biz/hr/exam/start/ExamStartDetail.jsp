<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
 <x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
 <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
 <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
 <script src='<c:url value="/biz/hr/exam/start/ExamStartDetail.js"/>'   type="text/javascript"></script>
 </head>
<body>
	<div class="mainPanel">
		<div class="subject">发起考试</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;"> 
				单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
				制单日期：<strong><x:format name="fillinDate" type="date"/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				发起人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<x:title title="考试主信息" hideTable="#inputFormDiv" name="group"/>
		<div id="inputFormDiv">
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;" id="mainTableInput">
					<x:layout />
					<tr>
						<x:hidden name="examStartId" />
						<x:hidden name="organId" />
						<x:hidden name="deptId" />
						<x:hidden name="positionId" />
						<x:hidden name="personMemberId" />
						<x:hidden name="fullId" />
						<x:hidden name="organName" />
						<x:hidden name="fillinDate" type="date" />
						<x:hidden name="billCode" />
						<x:hidden name="status" />
						<x:hidden name="deptName" />
						<x:hidden name="positionName" />
						<x:hidden name="personMemberName" />
						<x:inputTD name="subject" required="true" label="考试主题"	colspan="5" maxlength="100"/>
					</tr>
					<tr>
						<x:hidden name="examinationTypeId" />
						<x:inputTD name="examinationTypeName" required="true" label="考试类型"	wrapper="select"/>
						<x:inputTD name="timeout" required="true" label="考试时长(分钟)"	mask="nnn"/>
						<td colspan="2" class="title" style="padding-left: 10px">
							<x:checkbox name="isViewAnswer" label="允许查看答案"/>&nbsp;&nbsp;
						</td>
					</tr>
					<tr>
						<x:inputTD name="passingScore" required="true" label="合格分数"	 mask="nnnn"/>
						<x:inputTD name="totalScore" readonly="true" label="总分数"	/>
						<x:inputTD name="retakeNum" required="true" label="允许考试次数"	mask="nn"/>
					</tr>
					<tr>
						<td class="title" ><span class="labelSpan">人工阅卷:</span></td>
						<td class="title" style="padding-left: 10px">
							<x:checkbox name="isManualMarking" label="需要人工阅卷"/>
						</td>
						<x:hidden name="managerId" />
						<x:inputTD name="managerName"  label="阅卷人" maxLength="64" wrapper="select"/>
						<td colspan="2" class="title" style="padding-left: 10px">
							<x:checkbox name="isNotCreateNotify" label="不发送完成阅卷通知"/>
						</td>
					</tr>
					<tr>
						<x:textareaTD name="remark" required="false" label="考试说明"	colspan="5" maxlength="200" rows="3"/>
					</tr>
				</table>
			</form>
			<div class="blank_div"></div>
			<x:fileList bizCode="examStart" bizId="examStartId" id="examStartFileList" title="考试资料"/>
			<div class="blank_div"></div>
			<div id="chooseExamQuestionTypeGrid"></div>
		</div>
		<x:title title="人员信息" hideTable="#personChooseDiv" name="group"/>
		<div id="personChooseDiv">
			<form method="post" action="" id="queryPersonForm">
			<div class="ui-form" id="queryPersonDiv" style="width: 900px;">
				<x:inputL name="personQueryName" required="false" label="姓名" maxLength="64"  labelWidth="60" width="120"/>
				<x:selectL name="personQuerystatus" label="状态" list="examTaskStatusList" labelWidth="60" width="120"/>	
				<x:selectL name="personIsQualified" label="是否通过" dictionary="yesorno" labelWidth="70" width="60"/>	
				<dl>
					<x:button value="查 询" onclick="queryPerson(this.form)" />&nbsp;&nbsp;
					<x:button value="重 置" onclick="reQueryPerson(this.form)" />&nbsp;&nbsp;
				</dl>
			</div>
			</form>
			<div id="personChooseGrid"></div>
		</div>
	</div>
</body>
</html>
	
	
