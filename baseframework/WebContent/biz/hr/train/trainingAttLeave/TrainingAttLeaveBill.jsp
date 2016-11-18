<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,attachment" />
<script src='<c:url value="/biz/hr/train/trainingAttLeave/TrainingAttLeaveBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
	<div class="subject">培训请假申请单</div>
	<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
    <form method="post" action="" id="submitForm">
	 <table class='tableInput' style="width: 99%;">
	  <x:layout proportion="10%,21%,12%,21%,10%" />
		        <x:hidden name="leaveId"/>
				<x:hidden name="organId" />
				<x:hidden name="centerId" />
				<x:hidden name="centerName" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="status" value="0" />
				<x:hidden name="totalTime" />
				<x:hidden name="personId" />
				<x:hidden name="posLevel" />
				<x:hidden name="operationLevel" />
	             <tr>
				<x:inputTD name="organName" disabled="true" required="false" label="公司名称" maxLength="64" />
				<x:inputTD name="billCode" disabled="true" required="false" label="单据号码" maxLength="32" />
				<x:inputTD name="fillinDate" disabled="true" required="false" label="填表日期" maxLength="7" wrapper="dateTime" />
				</tr>
				<tr>
				<x:inputTD name="personMemberName" required="false" label="姓名" maxLength="32" disabled="true"/>
				<x:inputTD name="deptName" required="false" label="部门" maxLength="32" disabled="true"/>
				<x:inputTD name="positionName" required="false" label="岗位" maxLength="32" disabled="true"/>
				</tr>
				<tr>
				<x:hidden name="trainingClassCourseId" />
				<x:inputTD name="trainingCourseName" required="true" label="课程" maxLength="32" wrapper="select"/>
				<x:inputTD name="startDate" required="true" label="开始时间"   wrapper="dateTime" readonly="true" cssClass="textReadonly"  />		
				<x:inputTD name="endDate" required="false" label="结束时间"   wrapper="dateTime"   readonly="true" cssClass="textReadonly" />		
				</tr>
				<tr>
		         <x:textareaTD name="reason" required="true" label="请假原因" maxLength="512"  rows="5"  colspan="5"/>		
	            </tr>
	</table>
</form>
</div>
</div>
</body>
</html>

