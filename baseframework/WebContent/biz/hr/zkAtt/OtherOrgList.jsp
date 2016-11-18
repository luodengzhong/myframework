<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,tree,combox" />
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/zkAtt/OtherOrg.js"/>' type="text/javascript"></script>
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
				<div position="center" title="外部单位信息">
						<x:hidden name="organId" id="mainOrganId"/>
						<x:hidden name="organName" id="mainOrganName"/>
						<x:hidden name="fullId" id="mainFullId"/>
				  		<x:title title="搜索" hideTable="queryDiv"/>
						<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width:900px;">
								<x:inputL name="name" label="名称" maxLength="64" labelWidth="50" width="100"/>					
								<x:inputL name="code" label="编码" maxLength="32"  labelWidth="50" width="100"/>
								<x:inputL name="fullName" label="管理组织" maxLength="32"  labelWidth="70" width="140"/>				
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
