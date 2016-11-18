<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,layout,tree"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/recruit/interview/InterviewAutoFormList.js"/>' type="text/javascript"></script>  
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
			 <div position="center" title="面试申请列表"> 
	  		<x:title title="面试动态表" hideTable="queryDiv"/>
	  		<x:select name="recruitWay" id="recruitWay" cssStyle="display:none;" emptyOption="false"/>
	  		<x:select name="interviewStatus" id="interviewStatus" cssStyle="display:none;" emptyOption="false"/>
	  		
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:1000px;">
					<x:inputL name="staffName" required="false" label="应聘者" maxLength="32" labelWidth="70"/>	
				    <x:inputL name="applyOrganName" required="false" label="应聘单位" maxLength="32" labelWidth="70"/>			
					<x:inputL name="applyDeptName" required="false" label="应聘部门" maxLength="32" labelWidth="70"/>			
				<!--<x:selectL name="recruitResult" required="false" label="应聘结果" maxLength="32"/>	 -->
					<div class="clear"></div>
				    <x:inputL name="firstInterviewResult" required="false" label="初试结果" maxLength="32" labelWidth="70"/>			
					<x:inputL name="secondInterviewResult" required="false" label="复试结果" maxLength="32" labelWidth="70"/>			
					<x:inputL name="finalInterviewResult" required="false" label="终试结果" maxLength="32" labelWidth="70"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"  style="margin: 2px;"></div>
		</div> 
	</div>
	</div>
	</div>
  </body>
</html>
