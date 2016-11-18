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
<script src='<c:url value="/biz/oa/askReport/designsAccept/DesignsAcceptanceReport.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" >
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; "> <c:choose>
					<c:when
						test="${null==subject||subject==''}">
					设计成果验收确认单
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
				<x:layout proportion="13%,20%,13%,20%,13%,20%" />
					<x:hidden name="designsAcceptanceId"/>
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
					<x:hidden name="designsUnitId" />
					<x:hidden name="fillinUnitId" />
					<x:selectTD name="designsAcceptanceKind" required="true" label="设计成果类型"
						maxLength="50" dictionary="designsAcceptanceKind" />	
					<x:inputTD name="fillinPersonName" required="true" label="填报人" maxLength="32"  wrapper="select"/>	
					<x:inputTD name="fillinUnitName" required="true" label="填报单位" maxLength="256" />		
				</tr>
				<tr>
					<x:inputTD name="designsAcceptanceName" required="true" label="设计成果名称" maxLength="50" />
					<x:inputTD name="designsUnitName" required="true" label="设计单位" maxLength="256" />		
					<x:inputTD name="approvalLimitTime" required="false" label="审批时限" maxLength="40"/>		
				</tr>
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="designsAcceptanceReport"
				bizId="designsAcceptanceId" id="designsAcceptanceIdAttachment" />
			<div class="blank_div"></div>
		</form>
	</div>
</body>
</html>
