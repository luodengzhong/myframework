<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/hr/paformMake/PerformAssessFormBillShow.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">绩效考核表</div>
		<form method="post" action="" id="submitForm">
			<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong>
				</span>
			</div>
			<div class="blank_div"></div>
			<table class='tableInput' style="width: 99.1%; margin-left: 2px;">
				<x:layout />
				<x:hidden name="formId" />
				<x:select name="scorePersonLevel" cssStyle="display:none;" id="scorePersonLevel" emptyOption="false" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="organName" />
				<x:hidden name="billCode" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="personMemberName" />
				<x:hidden name="fillinDate" type="date" />
				<tr>
					<x:hidden name="assessId" />
					<x:inputTD name="assessName" required="false" label="被考核人" disabled="true" />
					<x:inputTD name="assessDeptName" required="false" label="被考核人所在部门" disabled="true" />
					<x:inputTD name="assessPostionName" required="false" label="被考核人岗位" disabled="true" />
				</tr>
				<tr>
					<x:hidden name="templetId" />
					<x:inputTD name="templetName" required="false" label="选择考核模板" disabled="true" />
					<x:inputTD name="examBeginTime" required="false" label="考核开始时间" disabled="true" />
					<x:inputTD name="examEndTime" required="false" label="考核结束时间" disabled="true" />
				</tr>
				<tr>
					<x:selectTD name="assessCycle" required="false" label="考核周期" disabled="true" />
					<x:inputTD name="formName" required="false" label="考核表名称" colspan="3" disabled="true" />
				</tr>
			</table>
			<div id='tabPage' style="width: 99%;">
				<div class="ui-tab-links">
					<ul style="left: 10px;">
						<li id="indexDetail">指标明细</li>
						<li id="paList">评分名单</li>
					</ul>
				</div>
				<div class="ui-tab-content">
					<div class="layout" id="index_detail_div_content">
						<div id='index_detail_div'>
							<div id="index_detail">
								<c:import url="/biz/hr/performAssessScore/PerformAssessScoreEdit.jsp" />
							</div>
						</div>
					</div>
					<div class="layout" id="pa_list_div_content" style="position: relative;">
						<div class="blank_div"></div>
						<div id="personid" style="margin: 2px;"></div>
					</div>
				</div>
			</div>
		</form>
	</div>
</body>
</html>