<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
     <x:base include="dialog,grid,dateTime,tree,combox" />
     <script src='<c:url value="/biz/hr/archivesHandover/ArchivesHandoverDetail.js"/>' type="text/javascript"></script>
</head>

<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">档案交接登记表</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	    <tr>
		<x:hidden name="handoverId"/>
		<x:hidden name="taskId"/>
		<x:hidden name="procUnitId"/>
		<x:hidden name="status"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="receivingArchivesId"/>
		<x:inputTD name="organName" required="false" label="单位名称" maxLength="64"  disabled="true"/>	
		<x:inputTD name="deptName" required="false" label="部门名称" maxLength="64"  disabled="true"/>		
		<x:inputTD name="positionName" required="false" label="岗位名称" maxLength="32"  disabled="true"/>
		</tr>
		<tr>
		<x:inputTD name="fillinDate" required="false" label="填表日期" maxLength="7"  wrapper="date" disabled="true"/>		
		<x:inputTD name="billCode" required="false" label="单据号码" maxLength="32" disabled="true"/>				
		<x:inputTD name="personMemberName" required="false" label="申请人" maxLength="32" disabled="true"/>		
	    </tr>
	    <tr>
	    <x:textareaTD name="reason" required="false" label="备注" maxLength="128"  colspan="5" rows="3"/>		
	    </tr>
	  </table>
	  <div id="maingrid" style="margin: 2px"></div>
   </form>
	</div>
</body>
