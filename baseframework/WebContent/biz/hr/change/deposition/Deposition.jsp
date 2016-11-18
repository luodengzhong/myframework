<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
     <x:base include="dialog,grid,dateTime,tree,combox,attachment" />
     <script src='<c:url value="/biz/hr/change/deposition/Deposition.js"/>' type="text/javascript"></script>
</head>

<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">免职审批表</div>
		<form method="post" action="" id="submitForm">
		<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong>&nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong>&nbsp;&nbsp; 经办人:<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>
		<div class="blank_div"></div>
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,100px,160px,100px,160px" />
				<x:hidden name="auditId" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />

				<x:hidden name="orgnizationId" />
				<x:hidden name="centerId" />
				<x:hidden name="departmentId" />
				<x:hidden name="posId" />
				<x:hidden name="archivesId" />
				<x:hidden name="status" value="0" />
				<x:hidden name="posLevel" />
				<x:hidden name="organName"/>
				<x:hidden name="fillinDate"  type="date"/>
				<x:hidden name="billCode"/>
				<x:hidden name="deptName"/>
				<x:hidden name="positionName"/>
				<x:hidden name="personMemberName"/>
                <x:hidden name="fromStaffingPostsRank"/>
			<%-- 	<tr>
					<x:inputTD name="organName" required="false" label="单位名称"  disabled="true" />
					<x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true" />
					<x:inputTD name="billCode" required="false" label="单据号码" disabled="true" />
				</tr>
				<tr>
					<x:inputTD name="deptName" required="false" label="部门名称" disabled="true" />
					<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true" />
					<x:inputTD name="personMemberName" required="false" label="制表人" disabled="true" />
				</tr> --%>
				<tr>
					<x:inputTD name="staffName" required="true" label="免职员工" wrapper="select" />
					<x:inputTD name="employedDate" required="false" label="入职日期" mask="date" readonly="true" />
					<x:inputTD name="orgnizationName" required="false" label="目前单位" readonly="true" />
				</tr>
				<tr>
					<x:inputTD name="centerName" required="false" label="目前中心" readonly="true" />
					<x:inputTD name="departmentName" required="false" label="目前部门" maxLength="32" readonly="true" />
					<x:inputTD name="posName" required="false" label="目前岗位" readonly="true" />
				</tr>
				<tr>
					<x:inputTD name="depositionPosName" required="false" label="免去职务" />
					<x:inputTD name="posDesc" required="false" colspan="3" maxLength="64"  label="职务描述" />
				</tr>
				<tr>
					<x:textareaTD name="deposeReason" rows="3" colspan="5" maxLength="512"  required="true" label="免职原因" />
				</tr>
			</table>
		</form>
		<div class="blank_div"></div>
		<div  style="color: red;font-size:16px" align="left"> 
		   (注:请上传免职文件)
		  </div>
		<x:fileList bizCode="HRDeposition" bizId="auditId" id="depositionFileList" />
	</div>
</body>


