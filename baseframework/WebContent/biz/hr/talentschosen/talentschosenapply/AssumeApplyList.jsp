
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,layout"/>
  		<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script  src='<c:url value="/biz/hr/talentschosen/talentschosenapply/AssumeApplyList.js"/>' type="text/javascript"></script>
  	
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
			<div position="center" title="员工列表">
			<x:hidden name="parentId"   id="treeParentId"/>
	  		<x:title title="员工列表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="chosenApplyId"/>
		<x:hidden name="speechType"/>
					
		<x:inputL name="staffName" required="false" label="员工姓名" maxLength="32"/>					
		<x:selectL name="sex" required="false" label="性别" maxLength="1"/>					
		<x:selectL name="education" required="false" label="学历" maxLength="2"/>					
		<x:inputL name="chosenPosName" required="false" label="选拨岗位" maxLength="64"/>					
		<x:inputL name="reason" required="false" label="陈述理由" maxLength="1024"/>					
		<x:selectL name="competeStatus" required="false" label="状态" list="competeResultStatus"/>					
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
	</div>
	</div>
	</div>
  </body>
</html>
