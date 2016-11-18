<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,layout,tree"/>  
  	<script  src='<c:url value="/biz/hr/recruit/recruitposition/RecruitPosition.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
	
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
			<div position="center" title="招聘岗位列表">
			<x:hidden name="parentId"   id="treeParentId"/>
	  		<x:title title="招聘岗位列表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
		<x:hidden name="jobPosId"/>
		<x:inputL name="name" required="false" label="招聘岗位"   maxLength="64"/>	
		<x:inputL name="deptName" required="false" label="招聘部门"   maxLength="64"/>					
		<x:inputL name="organName" required="false" label="招聘单位"   maxLength="64"/>					
						
		<x:selectL name="status" required="false" label="状态"  list="#{'1':'启用','-1':'禁用','0':'草稿'}"/>
		<x:selectL name="isHeadhunter" required="false" label="猎头是否可见"   dictionary="yesorno"/>					
		<x:selectL name="isInterRecommend" required="false" label="是否内推"  dictionary="yesorno"/>					
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px;" style="margin: 2px;"></div>
		   </div> 
		  </div>
		</div>
	</div>
  </body>
</html>
