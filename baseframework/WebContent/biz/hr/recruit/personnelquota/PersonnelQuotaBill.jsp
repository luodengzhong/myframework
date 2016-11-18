<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,attachment,tree" />
<script src='<c:url value="/biz/hr/recruit/personnelquota/PersonnelQuotaBill.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">编制定员变更申请表</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
				<tr>
					<x:hidden name="affirmPersonApplyId" />
					<x:hidden name="deptId" />
					<x:hidden name="fullId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="organId" />
					<x:hidden name="deptRenewId" />
					<x:hidden name="archivesId" />
					
					<x:inputTD name="organName" required="false" label="机构名称"
						maxLength="32" disabled="true" />
					<x:inputTD name="billCode" required="false" label="单据号码"
						maxLength="32" disabled="true" />
					<x:inputTD name="fillinDate" required="false" label="填表日期"
						maxLength="7" wrapper="date" disabled="true" />
				</tr>
				<tr>
					<x:inputTD name="deptName" required="false" label="部门名称"
						maxLength="32" disabled="true" />
					<x:inputTD name="positionName" required="false" label="岗位名称"
						maxLength="32" disabled="true" />
					<x:inputTD name="personMemberName" required="false" label="人员名称"
						maxLength="32" disabled="true" />
				</tr>
				
				
				<tr>
				    <x:hidden name="organCenterId"/>
				   	<x:inputTD name="organCenterName" required="true" label="变更组织"   wrapper="select" />
				    <td colspan="4" class="title"></td>
				</tr>
			</table>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
				<tr>
					<x:textareaTD name="applyReason" required="false" label="申请原因"
						rows="10" colspan="5" maxLength="512" />
				</tr>
				<tr>
				<td colspan="6">
			     <x:fileList bizCode="HRAffirmPersonChange" bizId="affirmPersonApplyId" id="quatoFileList"/>
			     </td>
		        </tr>
			</table>
		</form>
	</div>
 </body>
</html>