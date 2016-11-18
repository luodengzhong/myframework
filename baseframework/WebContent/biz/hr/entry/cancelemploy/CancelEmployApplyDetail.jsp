<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/biz/hr/entry/cancelemploy/CancelEmployApplyDetail.js"/>' type="text/javascript"></script>
  	
  </head>
  <body>
  <div class="mainPanel">
		<div id="mainWrapperDiv"><div class="subject">取消录用申请单</div>
  	<form method="post" action="" id="submitForm">
  	  		 <div class="bill_info">
				<span style="float:left;">
					单据号码：<strong><c:out value="${billCode}"/></strong>
					&nbsp;&nbsp;
					申请日期：<strong>　　　<x:format name="fillinDate" type="date"/></strong>
				</span>
				<span style="float:right;">
					申请人：<strong><c:out value="${personMemberName}"/></strong>
				</span>
		</div>
		<div class="blank_div"></div>	
	<table class='tableInput' style="width: 99%;">
				<x:layout proportion="73px,160px,100px,160px,100px,160px" />
		
		<x:hidden name="cancelEmployApplyId"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="organName"/>
		<x:hidden name="fillinDate" type="date"/>
		<x:hidden name="billCode"/>
		<x:hidden name="deptName"/>
		<x:hidden name="positionName"/>
		<x:hidden name="personMemberName"/>
		 
		<tr>    
		     <x:hidden name="archivesId"/>
				<x:inputTD name="staffName" required="false" label="员工姓名" readonly="true"/>	
				<x:hidden name="centreId"/>
				<x:hidden name="centreName"/>
				<x:hidden name="dptId"/>	
				<x:inputTD name="dptName" required="false" label="员工所属部门" readonly="true"/>		
				<x:inputTD name="posName" required="false" label="员工所属中心" readonly="true"/>	
				
		
		</tr>
		
		<tr>
			<x:textareaTD name="cancelReason" required="true" label="原因"   colspan="5"/>	
		
		</tr>
	</table>
</form>
</div>
</div>
  </body>
</html>
