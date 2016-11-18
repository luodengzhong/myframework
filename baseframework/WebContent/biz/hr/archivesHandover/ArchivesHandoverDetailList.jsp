
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,layout"/>
  	 <script src='<c:url value="/biz/hr/archivesHandover/ArchivesHandover.js"/>' type="text/javascript"></script>
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
				<div position="center" title="员工档案交接明细查询">
				<x:title title="搜索" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
		<x:hidden name="handoverDetailId"/>
		<x:inputL name="handStaffName" required="false" label="交接员工" />					
		<x:inputL name="personMemberName" required="false" label="移交人" />	
		<x:inputL name="receivingStaffName" required="false" label="接收人" />	
		<x:inputL name="beginDate" required="false" label="交接时间(起)" wrapper="date"/>					
		<x:inputL name="endDate" required="false" label="交接时间(止)" wrapper="date"/>					
						
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
