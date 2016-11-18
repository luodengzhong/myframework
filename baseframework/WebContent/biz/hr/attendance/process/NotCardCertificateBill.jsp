
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,time" />
<script	src='<c:url value="/biz/hr/attendance/process/AttProcUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/process/NotCardCertificateBill.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
    <div class="subject" >
    <c:choose>
	<c:when test="${isBusLate==1}">
			大巴车迟到说明
	</c:when>
	<c:otherwise>
			未打卡说明 
	</c:otherwise>
	</c:choose>
    </div>
    <c:if test="${isBusLate==0}">
    <div  style="color: red" align="center">此单据适用于因系统故障、指纹未识别、停电、忘记打卡而导致的考勤异常</div>
    </c:if>
	<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
		<form method="post" action="" id="submitForm">
			<div style="margin: 0 auto;">
				<x:hidden name="notCardCertificateId" />
				<x:hidden name="fullId"/>
				<x:hidden name="organId" />
				<x:hidden name="centerId" />
				<x:hidden name="centerName" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="positionName" />
				<x:hidden name="processDefinitionFile" />
				<x:hidden name="processDefinitionKey" />
				<x:hidden name="procUnitId" />
				<x:hidden name="status" value="0"/>
				<x:hidden name="isBusLate"/>
				<table class='tableInput' style="width: 99%;">
					<x:layout proportion="10%,21%,12%,21%,10%" />
					<tr>
						<x:select list="notCardKindList" name="notCardKindId" emptyOption="false"  cssStyle="display:none;"/>
						<x:inputTD name="organName" disabled="true" required="false"
							label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" disabled="true" required="false"
							label="单据号码" maxLength="32" />
						<x:inputTD name="fillinDate" disabled="true" required="false"
							label="填表日期" maxLength="7" wrapper="dateTime" />
					</tr>
					<tr>
						<x:inputTD name="deptName" disabled="true" required="false"
							label="部门" maxLength="64" />
						<x:inputTD name="personMemberName" disabled="true"
							required="false" label="姓名" maxLength="64" />
					    <td class="title" colspan="2"></td>	
					</tr>
					<!--  
					<tr>
					<x:inputTD name="notCardDate" required="true" label="未打卡时间"
							wrapper="dateTime" maxLength="7" />
							<td colspan="4" class="title"></td>
					</tr>
					-->
					<tr>
						<x:textareaTD name="reason" required="false" maxLength="200" label="情况说明"
							width="744" rows="2" colspan="5" />
					</tr>
					<tr>
						<x:textareaTD name="remark" required="false" label="备注" width="744"
							rows="2" colspan="5" maxlength="128"/>
					</tr>
				</table>
				
				<div class="blank_div"></div>
					<div id="maingrid"></div>
					<div class="blank_div"></div>
			</div>
		</form>
	</div>
	</div>
</body>
</html>
