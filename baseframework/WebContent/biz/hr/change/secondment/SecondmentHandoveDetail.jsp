
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,tree,combox"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/change/resignation/ResignationHandoveDetail.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	<div class="subject">员工工作交接审批表</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;">
			        <x:layout />
			        <x:hidden name="auditId" />
			        <x:hidden name="organId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" />
			        
			        <x:hidden name="archivesId" />
			        <tr>
				        <x:inputTD name="organName" required="false" disabled="true" label="公司名称" maxLength="64" />
				        <x:inputTD name="billCode" required="false" disabled="true" label="单据号码" maxLength="32" />
				        <x:inputTD name="fillinDate" required="false" disabled="true" label="填表日期" mask="date" />
			        </tr>
			        <tr>
		                <x:inputTD name="deptName" required="false" label="部门名称"  disabled="true"/>					
		                <x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		                <x:inputTD name="personMemberName" required="false" label="制单人"  disabled="true"/>	
		            </tr>	
			        <tr>
			            <x:inputTD name="staffName" required="true" label="离职员工" />	
			            <x:inputTD name="handoverDate" label="交接时间" wrapper="date"/>	
			            <!--  	
			            <x:inputTD name="handoverStaffName2" required="true" label="交接人" wrapper="select"/>	
			            -->
		            </tr>		            
		        </table>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
	</div>
  </body>
</html>
