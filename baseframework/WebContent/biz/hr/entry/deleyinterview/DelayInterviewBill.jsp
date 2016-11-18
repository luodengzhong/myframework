<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree" />
<script src='<c:url value="/biz/hr/entry/deleyinterview/DelayInterviewBill.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">员工延期转正面谈表</div>
		<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong>&nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong>&nbsp;&nbsp; 
				</span>
			</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	     <tr>
		
		<x:hidden name="delayInterviewId"/>
		<x:hidden name="speakPersonMemberId"/>
		<x:hidden name="archivesId"/>
		<x:hidden name="status"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="personMemberName"/>
		<x:hidden name="fullId"/>
		<x:hidden name="fillinDate"/>
		<x:hidden name="billCode"/>
		<x:inputTD name="staffName" required="false" label="员工姓名" maxLength="32"  readonly="true" cssClass="textReadonly"/>	
		<x:inputTD name="organName" required="false" label="所属机构" readonly="true" cssClass="textReadonly" />	
		<x:inputTD name="deptName" required="false" label="部门名称" readonly="true" cssClass="textReadonly"/>		
		</tr>
		<tr>	
		<x:inputTD name="positionName" required="false" label="现任岗位" readonly="true" cssClass="textReadonly"/>	
		<x:selectTD name="sex" required="false" label="性别" readonly="true"   cssClass="textReadonly"/>	
		<x:inputTD name="age" required="false" label="年龄" readonly="true"  cssClass="textReadonly"/>			
		</tr>
		<tr>		
		<x:selectTD  name="education" required="false" label="最高学历" readonly="true"  cssClass="textReadonly"/>	
		<x:inputTD name="jobTitleName" required="false" label="职称" readonly="true"  cssClass="textReadonly"/>	
		<x:inputTD name="speakPersonMemberName" required="false" label="面谈人" readonly="true"  cssClass="textReadonly"/>		
		</tr>
		<tr>		
		<x:inputTD name="employedDate" required="false" label="到公司时间"  wrapper="date"  readonly="true"/>		
		<x:inputTD name="beformalDate" required="false" label="原定转正时间" wrapper="date"  readonly="true"/>		
		<x:inputTD name="delayBeformalDate" required="false" label="延期后转正时间" wrapper="date"  readonly="true"/>	
		</tr>
		<tr>		
		<x:textareaTD name="mainWork" required="true" label="主管工作" maxLength="512"  colspan="5" rows="5"/>
	     </tr>
	     <tr>
	  <x:textareaTD name="invContent" required="true" label="面谈内容" maxLength="512"  colspan="5" rows="8"/>
	     
	     </tr>
	     
	</table>
</form>

</body>
</html>