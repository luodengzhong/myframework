
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="layout,tree,dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/attendance/statistics/OvertimeList.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	    <div id="layout">
	  	     <div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
			</div>
	  	
	  	    <div position="center" title="加班申请">
	  		<x:title title="搜索" hideTable="queryDiv"/>
			<form method="post" action="" id="submitForm">
			<x:hidden name="auditId"/>
			<div class="ui-form" id="queryDiv" style="width:900px;">
				<x:inputL name="billCode" required="false" label="单据号码" maxLength="32"/>
				<x:inputL name="fillinBeginDate" required="false" label="填表日期起" wrapper="date"/>	
				<x:inputL name="fillinEndDate" required="false" label="填表日期止" wrapper="date"/>
				<x:inputL name="personMemberName" required="false" label="加班员工" maxLength="32"/>
				<x:selectL list="overtimeKindList"  name="overtimeKindId" label="加班类别" />
				<x:selectL name="status" required="false" label="申请状态"    list="attendanceStatus" id="attendanceStatus"/>
				<x:inputL name="beginDate" required="false" label="开始日期起" wrapper="date" />
				<x:inputL name="endDate" required="false" label="结束日期止" wrapper="date" />
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
