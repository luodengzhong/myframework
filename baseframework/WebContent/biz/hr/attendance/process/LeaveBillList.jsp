
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="layout,tree,dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/attendance/process/LeaveBillList.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	    <div id="layout">
	  	    <div position="center" title="请假单据明细">
	  	       <div class="ui-form" style="width: 900px;">
						<x:inputL name="staffName" required="true" label="员工" wrapper="select" />
						<dl>
							<x:button value="统计年假" onclick="statistics(this.form)" />
							&nbsp;&nbsp;
						</dl>
						<dl>
						<x:inputL name="totalYearLeave"  required="false" label="所有年假(天)"  width="30" readonly="true"/>
						<x:inputL name="balance" required="false" label="剩余年假(天)"  width="30" readonly="true"/>
						</dl>
		       </div>
	  		<x:title title="请假单据搜索" hideTable="queryDiv"/>
	  		<x:hidden name="organId" />
			<form method="post" action="" id="submitForm">
			<x:hidden name="personMemberId" />
			<div class="ui-form" id="queryDiv" style="width:900px;">
				<x:selectL list="leaveKindList" emptyOption="true" name="leaveKindId" required="false" label="请假类别" />
				<x:inputL name="startDate" required="false" label="开始日期" wrapper="date"/>	
				<x:inputL name="endDate" required="false" label="结束日期" wrapper="date"/>
				<x:inputL name="personName" required="false" label="员工" />
				<x:selectL list="attendanceStatusList" id="attendanceStatusId" name="status" required="false" label="申请状态" maxLength="22"/>
			<dl>
				<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
				<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
			</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px"></div>
			</div>
			</div>
		</div> 
	</div>
  </body>
</html>
