<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
 <x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
 <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
 <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
 <script src='<c:url value="/biz/hr/evaluate/start/EvaluateReport.js"/>'   type="text/javascript"></script>
 </head>
<body>
	<div class="mainPanel">
		<div id="chartsToolBar"></div>
		<div id="inputFormDiv">
			<div class="subject"><c:out value="${subject}" /></div>
			<div class="bill_info">
				<span style="float: left; margin-left: 10px;"> 
					单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
					制单日期：<strong><x:format name="fillinDate" type="date"/></strong>
				</span> 
				<span style="float: right; margin-right: 10px;"> 
					发起人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
				</span>
			</div>
			<form method="post" action="" id="submitForm">
					<x:hidden name="evaluateReportId" />
					<x:hidden name="evaluateStartId" />
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
			</form>
		</div>
		<div class="blank_div"></div>
		<x:fileList bizCode="evaluateReport" bizId="evaluateReportId" id="evaluateReportFileList" title="报告文件"/>
		<div class="blank_div"></div>
		<div id="evaluateChartsDiv"></div>
	</div>
</body>
</html>
	
	
