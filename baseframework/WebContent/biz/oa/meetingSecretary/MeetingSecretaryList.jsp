
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="biz/oa/meetingSecretary/MeetingSecretaryList.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="会议秘书设置">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<x:hidden name="manageOrganId" />
						<x:hidden name="fullId" />
						<x:hidden name="orgName" />
						<x:hidden name="mfullName" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<div class="row">
								<x:inputL name="personName" required="false" label="秘书名称" maxLength="64"/>
								<x:selectL name="isTogether" emptyOption="false" required="true" label="是否级联查看"  labelWidth="120"  dictionary="yesorno" width="60" />
								<x:selectL name="status" label="秘书状态"  labelWidth="60"  dictionary="yesorno" width="60" />
							</div>
							<div class="row">
								<x:inputL name="fullName" required="false" label="组织机构路径" width="455"/>
								<dl>
									<x:button value="查 询" onclick="query(this.form)" />
								</dl>
							</div>
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
