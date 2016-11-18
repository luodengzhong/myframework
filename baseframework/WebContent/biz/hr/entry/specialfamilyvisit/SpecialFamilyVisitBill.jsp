<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,attachment"/>
   	<script src='<c:url value="/biz/hr/entry/specialfamilyvisit/SpecialFamilyVisitBill.js"/>' type="text/javascript"></script> 
  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
  			<div class="subject">特殊家访申请单</div>
	  	<form method="post" action="" id="submitForm">
	  	 <div class="bill_info">
				<span style="float:right;">
				     单据号码：<strong><c:out value="${billCode}"/></strong>
					&nbsp;&nbsp;
                                申请日期：<strong><x:format name="fillinDate" type="date"/> </strong>			
               	</span>
		</div>
		<div class="blank_div"></div>
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,100px,160px,100px,160px" />
					
		<x:hidden name="specialId"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="deptName"/>
		<x:hidden name="fillinDate"  type="date"/>
		<x:hidden name="billCode"/>
		<x:hidden name="positionName"/>
		<tr>
		<x:inputTD name="personMemberName" required="false" label="申请人" readonly="true"/>	
		<x:inputTD name="organName" required="false" label="单位名称"  readonly="true" />	
		 <x:inputTD name="employedDate" required="true" label="到公司时间"  wrapper="date"  readonly="true"/>			
						
		</tr>
		<tr>			
		<x:textareaTD name="visitAdress" required="true" label="家庭地址"   colspan="5"  maxLength="128"  rows="3"/>	
		</tr>
		<tr>			
		<x:textareaTD name="reason" required="true" label="申请事由"   colspan="5" maxLength="128" rows="3"/>	
		</tr>
		</table>
		<x:fileList bizCode="specialFamilyVisit" bizId="specialId" id="specialFamilyVisitFileList" />
			</form>
		</div> 
  </body>
</html>


