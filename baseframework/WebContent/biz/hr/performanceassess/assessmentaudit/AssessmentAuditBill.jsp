<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script
	src='<c:url value="/biz/hr/performanceassess/assessmentaudit/AssessmentAuditBill.js"/>'
	type="text/javascript"></script>

</head>
<body>
	<div class="mainPanel">
		<div class="subject">${assessPaName}</div>
		<form method="post" action="" id="submitForm">
			<div class="bill_info">
				<span style="float: left;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong> &nbsp;&nbsp; 申请日期：<strong> <x:format
							name="fillinDate" type="date" /></strong>
				</span> <span style="float: right;"> 申请人：<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>
			<div class="blank_div"></div>
			
	            <div style="overflow: hidden; width: 100%; height: 100%;">
	            	<x:hidden name="auditId" />
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
				<x:hidden name="assessPaId"/>
				<x:hidden name="personMemberName" />
				<x:hidden name="taskId"/>
				<x:hidden name="templetId" id="mainTempletId"/>
				<x:hidden name="kind"/>
						<div id="maingrid" style="margin: 2px; float: left;"></div>
						<div id="indexgrid" style="margin: 2px; float: left;"></div>
					</div>
			

			
			
		</form>
	</div>
</body>
</html>


