<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,layout"/>
  	<script src='<c:url value="/biz/hr/entry/specialfamilyvisit/SpecialFamilyVisit.js"/>' type="text/javascript"></script>  
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
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
				<div position="center" title="特殊家访申请单列表">
					<x:title title="搜索" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="specialId"/>
					
		<x:inputL name="personMemberName" required="false" label="姓名" />		
	    <x:inputL name="billCode" required="false" label="单据编号" />					
		<x:selectL name="status" required="false" label="申请状态" maxLength="1"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px;"></div>
		</div> 
		</div>
		</div>
	</div>
  </body>
</html>

