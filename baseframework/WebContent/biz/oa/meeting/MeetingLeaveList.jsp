
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="layout,tree,dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/oa/meeting/MeetingLeaveList.js"/>' type="text/javascript"></script>
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
	  	    <div position="center" title="会议请假单">
	  		<x:title title="搜索" hideTable="queryDiv"/>
	  		<x:hidden name="isAuthorization" />
			<form method="post" action="" id="submitForm">
			<x:hidden name="auditId"/>
			<div class="ui-form" id="queryDiv" style="width:900px;">
				<x:inputL name="mbillCode" required="false" label="会议单据号码" maxLength="32"/>
				<x:inputL name="billCode" required="false" label="业务单据号码" maxLength="32"/>
				<div class="clear"></div>	
				<x:inputL name="subject" required="false" label="会议名称" maxLength="64"/>
				<x:selectL name="status" required="false" label="申请状态" list="attendanceStatus" id="attendanceStatus"/>
				<div class="clear"></div>	
				<c:if test="${isAuthorization==0}">
				<x:inputL name="personMemberName" required="false" label="申请人" maxLength="64" />
				</c:if>
				<c:if test="${isAuthorization==1}">
				<x:inputL name="personMemberName" required="false" label="委托人" maxLength="64" />
				<x:inputL name="agentPersonMemberName" required="false" label="受托人" maxLength="64" />	
				</c:if>
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
