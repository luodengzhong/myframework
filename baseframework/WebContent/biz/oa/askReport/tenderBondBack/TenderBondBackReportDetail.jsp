
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
<script src='<c:url value="/biz/oa/askReport/tenderBondBack/TenderBondBackReport.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px;"> <c:choose>
					<c:when
						test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					投标保证金退款申请单
				</c:when>
					<c:otherwise>
						<c:out value="${defaultTitle}" />
					</c:otherwise>
				</c:choose>
			</span>
		</div>
		<div class="bill_info" >
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
					<x:hidden name="tenderBondBackId" />
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
					<x:inputTD name="fillinPersonName" required="true" label="填表人" wrapper="select"/>
					<td class="title"><span class="labelSpan">填表日期:</span> </td>
					<td class="edit disable">
						<div class="textLabel" id="billCode_view">
							<x:format name="fillinDate" type="date" />
						</div>
					</td>
				</tr>
				<tr>
					<x:inputTD name="projectName" required="true" label="项目名称" maxLength="64"/>		
					<x:inputTD name="backAmount" required="true" label="申请退还金额"  maxLength="22" spinner="true" mask="nnnnnnnnnnnnnn.nn" />		
				</tr>
				<tr>
					<x:inputTD name="winUnitName" required="true" label="中标单位名称" maxLength="64" colspan="3"/>		
				</tr>
				<tr>
					<x:inputTD name="applyReturnUnitName" required="true" label="申请退款单位名称" maxLength="64" colspan="3"/>
				</tr>
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="tenderBondBackReport"
				bizId="tenderBondBackId" id="tenderBondBackIdAttachment" />
			<div class="blank_div"></div>
		</form>
		<div style="margin-bottom:10px">
		备注：<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		&nbsp;1、请务必附上中标通知书或定标决议；<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		&nbsp;2、项目名称、中标单位名称、申请退款单位名称请填全称。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		</div>
	</div>
</body>
</html>
