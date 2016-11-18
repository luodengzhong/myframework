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
<script src='<c:url value="/biz/oa/askReport/negotiantTender/NegotiatTenderReport.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" >
		<div class="subject" style="height: 30px;">
			<span id="editSubject"
				style="font-size: 20px; "> <c:choose>
					<c:when
						test="${null==subject||subject==''}">
					定向议标报告表
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
				<x:layout proportion="14%,19%,14%,19%" />
					<x:hidden name="negotiatTenderingId"/>
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
					<x:inputTD name="fillInTime"  required="true" label="时间" maxLength="7" wrapper="dateTime" />	
					<x:inputTD name="fillinPersonName" required="true" label="报告人" maxLength="128"  wrapper="select"/>	
				</tr>
				<tr>
					<x:inputTD name="tenderProjectName" required="true" label="招标项目名称" maxLength="256"/>		
					<x:inputTD name="projectApprovalSum" required="true" label="估算立项金额（元）"  maxLength="22" spinner="true" mask="nnnnnnnnnnnnnn.nn" dataOptions="min:1"/>		
				</tr>
				<tr>
					<x:inputTD name="negotiationTenderingUnit" required="true" label="定向议标单位" maxLength="128" colspan="3"/>			
				</tr>
				<tr>
					<x:inputTD name="alternativeUnit" required="false" label="备选单位" maxLength="512" colspan="3"/>		
				</tr>
				<tr>
						<td rowspan="4" ><span class="labelSpan">定向议标单位原因<font color="#FF0000">*</font>：</span></td>
						<td ><x:checkbox name="resourceMonopoly" required="false" label="1、资源垄断（独家）" value="1" /></td>
						<x:textareaTD name="resourceMonopolyDescr" required="false" label="简要说明" maxLength="1024" />
				</tr>
				<tr>
						<td ><x:checkbox name="vieIncomplete" required="false" label="2、资源竞争不充分" value="1" /></td>
						<x:textareaTD  name="vieIncompleteDescr" required="false" label="简要说明" maxLength="1024"/>
				</tr>
				<tr>
						<td ><x:checkbox  name="tenderShortTime" required="false" label="3、招标时间紧" value="1"/></td>
						<x:textareaTD  name="tenderShortTimeDescr" required="false" label="简要说明" maxLength="1024"/>
				</tr>
				<tr>
						<td ><x:checkbox name="other" required="false" label="4、其他" value="1" /></td>
						<x:textareaTD  name="otherDescr" required="false" label="简要说明" maxLength="1024" />
				</tr>
				<tr>
					<x:textareaTD name="remark" required="false" label="备注" maxLength="1024" colspan="3"/>
				</tr>
				
			</table>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="negotiatTenderingReprot"
				bizId="negotiatTenderingId" id="negotiatTenderingIdAttachment" />
			<div class="blank_div"></div>
		</form>
	</div>
</body>
</html>
