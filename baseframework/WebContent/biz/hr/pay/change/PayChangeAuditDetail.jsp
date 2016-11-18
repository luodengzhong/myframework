<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/change/PayChangeAuditDetail.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
	<div class="subject">员工薪酬变动审批表</div>
	<div class="bill_info"><x:hidden name="operationKind"  id="mainOperationKind"/>
			<span style="float: right;"> 
				单据号码：<strong><c:out value="${billCode}" /></strong>&nbsp;&nbsp;&nbsp; 
				填表日期：<strong><x:format name="fillinDate" type="date" /></strong>&nbsp;&nbsp; 
				经办人:<strong><c:out value="${personMemberName}" /></strong>
			</span>
	</div>		
	<form method="post" action="" id="submitForm">
		<table class='tableInput' style="width: 99%;">
			<x:layout/>
			<x:hidden name="auditId" />
			<x:hidden name="organId" />
			<x:hidden name="deptId" />
			<x:hidden name="positionId" />
			<x:hidden name="personMemberId" />
			<x:hidden name="fullId" />
			<x:hidden name="deptName" />
			<x:hidden name="organName" />
			<x:hidden name="billCode" />
			<x:hidden name="fillinDate"  type="date"/>
			<x:hidden name="personMemberName" />
			<x:hidden name="isNeedSpecialSalary" />
			<tr>
				<%-- <x:selectTD name="wageKind" id="mainWageKind" label="工资类别" emptyOption="false" value="2"/> --%>
				<x:selectTD list="wageKindList" name="wageKind" id="mainWageKind" label="工资类别" emptyOption="false" value="2" />
				<x:select list="wageKindTypeList" id="mainWageTypeKind" cssStyle="display:none;" />
				<x:hidden name="changeOrgId" />
				<x:inputTD name="changeOrgName" required="true" label="变化人员单位" maxLength="64" wrapper="select"/>
				<x:hidden name="managerId" />
				<x:inputTD name="managerName" required="true" label="沟通领导" maxLength="64" wrapper="select"/>
				<x:select name="wageChangeKind" id="mainWageChangeKind" cssStyle="display:none;" emptyOption="false"/>
				<x:select name="performanceLevel" id="mainEffectiveRank" cssStyle="display:none;" emptyOption="false"/>
				
			</tr>
			<tr>
				<x:selectTD name="exceedBandwidth" required="true" label="超过薪酬带宽" dictionary="yesorno"/>
				<x:inputTD name="remark" required="false" label="备注" maxLength="200"  colspan="3"/>
			</tr>
		</table>
	</form>
	<div class="blank_div"></div>
	<x:fileList bizCode="PayChanage" bizId="auditId" id="payChangeFileList"/>
	<div class="blank_div"></div>
	<div id="maingrid"></div>
</div>
</body>
</html>
