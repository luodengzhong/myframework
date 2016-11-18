<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
    <head>
  	<x:base include="dialog,layout,grid,tree,combox" />
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/setup/EstateQualification.js"/>' type="text/javascript"></script>
  </head>
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
				<div position="center" title="房地产资质台账">
						<x:hidden name="organId" id="mainOrganId"/>
						<x:hidden name="organName" id="mainOrganName"/>
				  		<x:title title="搜索" hideTable="queryDiv"/>
						<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width:900px;">
								<x:inputL name="companyName" label="公司全称" maxLength="64"/>					
								<x:inputL name="companyCode" label="公司简码" maxLength="32"/>		
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
