<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,layout,tree"/>
  		 <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  	  		<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	  		<script src='<c:url value="/biz/hr/recruit/interview/InterviewApplyList.js"/>' type="text/javascript"></script>  
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	<!-- 	<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="面试申请列表"> -->
	  		<x:title title="面试申请列表" hideTable="queryDiv"/>
	  		<x:select name="recruitWay" id="recruitWay" cssStyle="display:none;" emptyOption="false"/>
	  		<x:select name="interviewStatus" id="interviewStatus" cssStyle="display:none;" emptyOption="false"/>
	  		
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="interviewApplyId"/>
		
		<x:inputL name="staffName" required="false" label="应聘者" maxLength="32"/>			
		<x:inputL name="viewMemberName" required="false" label="面试官" maxLength="32"/>					
		<x:selectL name="status" required="false" label="申请状态"  dictionary="interviewStatus"/>					
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
  </body>
</html>
