<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/askReport/tenderTechChange/TenderTechChangeReport.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" >
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; "> <c:choose>
					<c:when
						test="${null==subject||subject==''}">
					招标过程技术变更申请表
				</c:when>
					<c:otherwise>
						<c:out value="${subject}" />
					</c:otherwise>
				</c:choose>
			</span>
		</div>
		<div class="bill_info" style="width:100%;margin:0px auto;">
			<span style="float: left; margin-left: 10px;"> 单据号码：<strong><c:out
						value="${billCode}" /></strong> &nbsp;&nbsp; 制单日期：<strong><x:format
						name="fillinDate" type="date" /></strong>
			</span> <span style="float: right; margin-right: 10px;"> 发送人：<strong><c:out
						value="${organName}" />.<c:out value="${deptName}" />.<c:out
						value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table  style="width: 99.5%;margin: 0 auto 0;"center="true" class="tableInput">
				<x:layout proportion="15%,30%,10%,30%" />
				<tr border="0" class="applyInput">
					<x:hidden name="tenderTechChangeReportId"/>
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
					<x:hidden name="personMemberName" />
					<x:hidden name="subject" />
					<x:hidden name="procUnitId" />
					<x:hidden name="processDefinitionKey" />
					<x:hidden name="fillinPersonId" />
					<x:hidden name="fillinPersonLongName" />
					<x:hidden name="operatorId" />		
					<x:hidden name="operatorLongName"/>		
					<x:hidden name="applyDeptId"/>		
					<x:selectTD name="techChangeKindCode" required="true" label="技术变更类别"
						maxLength="50" dictionary="tenderTechChangeKind" />	
					<x:inputTD name="operatorName" required="false" label="经办人" maxLength="32"  wrapper="select"/>		
				</tr>
				<tr  class="applyInput">
					<x:inputTD name="applyDeptName" required="false" label="申请部门" maxLength="64"  colspan="3"/>		
				</tr>
				<tr  class="applyInput">
					<x:inputTD name="tenderProjectName" required="false" label="招标项目名称" maxLength="256"  colspan="3"/>		
				</tr>
				<tr  class="applyInput">
					<x:textareaTD name="changeContent" required="false" label="变更内容" maxLength="1024" colspan="3"/>		
				</tr>
				<tr class="approvalInput">
					<x:inputTD name="changeIsStandard" required="false" label="技术变更后经测算是否超指标" maxLength="128" colspan="3"/>		
				</tr>
				<tr class="approvalInput">
					<x:inputTD name="changeTimes" required="false" label="招标过程中的第几次变更" maxLength="5" colspan="3"/>
				</tr>
			</table>
			
			
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="tenderTechChangeReport"
				bizId="tenderTechChangeReportId" id="tenderTechChangeReportIdAttachment" />
			<div class="blank_div"></div>
		</form>
	</div>
</body>
</html>
