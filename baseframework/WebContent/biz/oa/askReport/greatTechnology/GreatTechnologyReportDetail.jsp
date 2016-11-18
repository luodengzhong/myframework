
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
<script src='<c:url value="/biz/oa/askReport/greatTechnology/GreatTechnologyReport.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px;"> <c:choose>
					<c:when
						test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					重大技术方案报审表
				</c:when>
					<c:otherwise>
						<c:out value="${defaultTitle}" />
					</c:otherwise>
				</c:choose>
			</span>
		</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;"> 单据号码：<strong><c:out
						value="${billCode}" /></strong> &nbsp;&nbsp; 制单日期：<strong><x:format
						name="fillinDate" type="date" /></strong>
			</span> <span style="float: right; margin-right: 10px;"> 发送人：<strong><c:out
						value="${organName}" />.<c:out value="${deptName}" />.<c:out
						value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99.9%;">
				<x:layout proportion="10%,21%,10%,21%" />
				<tr>
					<x:hidden name="greatTechnologyReportId" />
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
					<x:hidden name="technologyKindName" />
					<x:hidden name="procUnitId" />
					<x:hidden name="processDefinitionKey" />
					<x:hidden name="fillinPersonId" />
					<x:hidden name="fillinPersonLongName" />
					<x:selectTD name="technologyKindCode" required="true" label="方案类别"
						maxLength="32" dictionary="technologySchemeKind" />
					<x:inputTD name="fillinPersonName" required="true" label="填表人" wrapper="select"/>
				</tr>
				<tr>
					<x:hidden name="greatTechnologyReportId" />
					<x:inputTD name="projectName" required="true" label="项目名称"
						maxLength="256" colspan="3"/>
				</tr>
				<tr>
					<x:inputTD name="professionName" required="true" label="专　　业"
						maxLength="256" colspan="3"/>
				</tr>
				<tr>
					<x:inputTD name="designUnit" required="true" label="设计单位"
						maxLength="128" colspan="3"/>
				</tr>
				<tr>
					<x:textareaTD name="schemesDescription" required="true"
						label="方案描述" maxLength="1024" rows="4" colspan="3"/>
				</tr>
				<tr>

				</tr>
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="greatTechnologyReport"
				bizId="greatTechnologyReportId" id="greatTechnologReportIdAttachment" />
			<div class="blank_div"></div>
		</form>
	</div>
</body>
</html>
