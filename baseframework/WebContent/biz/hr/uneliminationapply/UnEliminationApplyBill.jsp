
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/hr/uneliminationapply/UnEliminationApplyBill.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">半年/年终考核强制排名末位员工暂不淘汰申请表</div>
		<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong>&nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong>&nbsp;&nbsp; 经办人:<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' >
	<x:layout/>
		<x:hidden name="unEliminationApplyId"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="deptName"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="status"  value="0"/>
		<x:hidden name="organName"/>
		<x:hidden name="billCode"/>
		<x:hidden name="fillinDate"  type="date"/>
		<x:hidden name="personMemberName"/>
		<x:hidden name="positionName"/>
		<tr>
		<x:hidden name="archivesId"/>
		<x:inputTD name="staffName" required="true" label="员工"  wrapper="select" />	
		<x:selectTD name="rank"  dictionary="performanceLevel"  required="false" label="绩效排名等级"  readonly="true" cssClass="textReadonly"/>	
		<x:inputTD name="age" required="false" label="年龄" readonly="true" cssClass="textReadonly"/>	
		</tr>
		<tr>
		<x:hidden name="orgnizationId"/>
		<x:hidden name="centerId"/>
		<x:hidden name="departmentId"/>
		<x:hidden name="posId"/>
		<x:inputTD name="orgnizationName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>
		<x:inputTD name="centerName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>
		<x:inputTD name="departmentName" required="false" label="部门" maxLength="32" readonly="true" cssClass="textReadonly"/>
		</tr>
		<tr>	
		<x:inputTD name="posName" required="false" label="现岗位" readonly="true" cssClass="textReadonly"/>
		<x:selectTD name="posLevel" required="false" label="行政级别" readonly="true" cssClass="textReadonly"/>
		<x:inputTD name="employedDate" required="false" label="入职时间" readonly="true" cssClass="textReadonly" wrapper="date"/>	

		</tr>
		<tr>
		<x:textareaTD name="resaon" required="true" label="不淘汰原因" rows="12" maxlength="1000" colspan="5"/>
	     </tr>
		</table>
	
</form>

</div>
</body>
</html>