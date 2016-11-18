
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="biz/oa/meetingSecretary/MeetingSecretaryChoose.js"/>' type="text/javascript"></script>
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
				<div position="center" title="会议秘书选择">
					<form method="post" action="" id="queryMainForm">
						<x:hidden name="manageOrganId" />
						<x:hidden name="fullId" />
						<x:hidden name="meetingId" />
						<x:hidden name="orgName" />
						<x:hidden name="mfullName" />
						<x:hidden name="isTogether" value="1"/>
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<div class="row">
								<x:inputL name="keyWord" required="false" label="关键字" width="455"/>
								<dl>
									<x:button value="查 询" onclick="query(this.form)" />
								</dl>
							</div>
						</div>
					</form>
					<div class="blank_div"></div>
					<table cellpadding="0" cellspacing="0" style='width:99%;'>
						<x:layout proportion="55%,10%,35%"/>
						<tr>
							<td style="font-size:13px;font-weight:bold;padding-bottom:4px;">秘书列表：</td>
							<td></td>
							<td style="font-size:13px;font-weight:bold;padding-bottom:4px;">已选秘书：</td>
						</tr>
						<tr>
							<td valign="top">
								<div id="maingrid" style="margin: 2px;width: 340px"></div>
							</td>
							<td>
								<div style="padding-left: 10px;">
									<x:button value="=>" cssStyle="min-width:50px;" id="divAdd" onclick="addSecret()" />
									<br /> <br />
									<x:button value="<=" cssStyle="min-width:50px;" id="divDelete" onclick="deleteSecret()"/>
								</div>
							</td>
							<td valign="top">
								<div id="choosedgrid" style="margin: 2px;width: 340px"></div>
							</td>
						</tr>
					</table>
				</div>
			</div> 
		</div>
	</div>
  </body>
</html>
