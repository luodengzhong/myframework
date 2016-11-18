<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/hr/training/TrainingOutboundFeedbackBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
	<div class="subject">外送培训情况反馈表</div>
 <form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="80px,100px,80px,100px,80px,100px"/>
	     <tr>
		<x:hidden name="trainingOutboundFeedbackId"/>
		<x:hidden name="archivesId"/>
		<x:hidden name="ognId"/>
		<x:hidden name="taskId"/>
		<x:hidden name="centreId"/>
		<x:hidden name="dptId"/>
		<x:hidden name="ognName"/>
		<x:hidden name="centreName"/>
		<x:hidden name="dptName"/>
		<x:hidden name="trainingOutboundApplyId"/>
		<x:inputTD name="course" required="true" label="培训课程" maxLength="128"/>		
		<x:inputTD name="teacherName" required="true" label="培训讲师" maxLength="32"/>		
		<x:inputTD name="orgName" required="true" label="培训机构" maxLength="128"/>		
		</tr>
		<tr>
		<x:inputTD name="orgContact" required="true" label="培训机构联系人" maxLength="16"/>		
		<x:inputTD name="orgTel" required="false" label="联系电话" maxLength="16"/>		
		<x:inputTD name="staffName" required="false" label="培训员工" maxLength="32" readonly="true" />		
		</tr>
		<tr>
		<x:title title="培训情况反馈"  name="group"/>
		</tr>
		<tr>	
		<x:inputTD name="startTime" required="false" label="开始时间" maxLength="7"  wrapper="date"/>		
		<x:inputTD name="endTime" required="false" label="结束时间" maxLength="7"  wrapper="date"/>	
		<x:inputTD name="place" required="false" label="培训地点" maxLength="128"/>	
		</tr>
		<tr>	
		<x:inputTD name="trainingType" required="false" label="培训方式" maxLength="32"/>		
		<x:inputTD name="trainingFee" required="false" label="培训实际费用(/元)" maxLength="22"  mask="nnnnnn"/>	
		<x:inputTD name="travelExpenses" required="false" label="差旅费(/元)" maxLength="22"  mask="nnnnnn"/>		
		</tr>
		<tr>
		<x:textareaTD name="trainingContent" required="false" label="培训内容" maxLength="512"  colspan="5"  rows="7"/>	
		</tr>
	</table>
</form>
	</div>
</body>
</html>