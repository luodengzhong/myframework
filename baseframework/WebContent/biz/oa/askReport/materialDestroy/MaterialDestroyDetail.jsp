
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<link   href='<c:url value="/biz/oa/askReport/tenderTechRequire/TenderTechRequireReport.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/askReport/materialDestroy/MaterialDestroy.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; "> <c:choose>
					<c:when
						test="${null==requestScope.defaultTitle||requestScope.defaultTitle==''}">
					资料销毁申请单
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
				<x:layout proportion="14%,19%,14%,19%,14%,19%" />
				<tr>
					<x:hidden name="materialDestroyId" />
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="deptName" />
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
					
					<td class="title">
						<span class="labelSpan" style="line-height:25px;">
							文件编号<font color="#FF0000">*</font>&nbsp;:&nbsp;&nbsp;
							<a href='##' class="GridStyle"  style="display:none" id="getDispatchNoBtn"  onclick='getDispatchNo()'>获取</a>
						</span>
						<x:hidden name="dispatchKindId" />
					    <x:hidden name="dispatchKindName" />
					    <x:hidden name="titleDispatchNo" />
					</td>
					<td class="disable">
						<x:input name="dispatchNo" required="false" label="文件编号" readonly="true" cssClass="textReadonly"/>
					</td>	
					<x:radioTD dictionary="materialKind" name="materialKind" required="true" label="文件类型" />
					<td colspan="2"></td>
				</tr>
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
 			<div class="blank_div"></div>
			<x:fileList bizCode="materialDestroy"
				bizId="materialDestroyId" id="materialDestroyIdAttachment" /> 
			<div class="blank_div"></div>
			<div class="layout" id="grid_tab" >
				<div id="grid_manager"></div>
			</div>
		</form>
		
	</div>
</body>
</html>
