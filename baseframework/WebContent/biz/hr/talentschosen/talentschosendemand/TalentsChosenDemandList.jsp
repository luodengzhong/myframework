<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
    <x:base include="dialog,grid,dateTime,combox,tree,layout" />
  	<script src='<c:url value="/biz/hr/talentschosen/talentschosendemand/TalentsChosenDemandList.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
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
				<div position="center" title="人才选拨需求列表">
				<x:title title="搜索" hideTable="queryDiv" />
				<div class="ui-form" id="queryDiv" style="width:900px;">
				<form method="post" action="" id="queryMainForm">
				    <x:hidden name="talentsChosenDemandId"/>
					<x:inputL name="billCode" required="false" label="单据号码" maxLength="32" />
					<x:inputL name="fillinBeginDate" required="false" label="填表日期起" wrapper="date" />
					<x:inputL name="fillinEndDate" required="false" label="填表日期止" wrapper="date" />
					<x:inputL name="personMemberName" required="false" label="制单人" maxLength="64" />
				   <x:inputL name="chosenPosName" required="false" label="选拨岗位名称" maxLength="64"/>					
					<x:selectL name="status" required="false" label="申请状态" maxLength="22" />
		
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"  style="margin: 2px"></div>
		</div> 
	</div>
	</div>
	</div>
  </body>
</html>