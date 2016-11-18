<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,combox,grid,dateTime,tree" />
<script src='<c:url value="/system/opm/ad/Org.js"/>' 	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构树" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center" title="组织机构列表">
					<div position="center" title="列表">
						<x:title title="搜索" hideTable="queryTable" />
						<form method="post" action="" id="queryMainForm">
							<div class="ui-form" id="queryTable">
								<div class="row">
									<x:inputL name="code" required="false" label="编码"
										readonly="false" labelWidth="50" />
									<x:inputL name="name" required="false" label="名称" labelWidth="50"/>
									&nbsp;&nbsp;
									<x:button value="查 询" id="btnQuery" />
									&nbsp;&nbsp;
									<x:button value="重置" id="btnReset" />
								</div>
								<div class="row">
									<x:checkbox name="showDisabledOrg" id="showDisabledOrg"
										cssStyle="margin-left:15px;" label="显示已禁用的组织"></x:checkbox>
									<x:checkbox name="showAllChildrenOrg" label="显示所有下级组织"
										cssStyle="margin-left:30px;" checked="true"></x:checkbox>
									<x:checkbox name="showOrg" label="组织" kindId="ogn"
										cssStyle="margin-left:50px;"></x:checkbox>
									<x:checkbox name="showDept" label="部门"  kindId="dpt"
										cssStyle="margin-left:10px;" ></x:checkbox>
									<x:checkbox name="showPos" label="岗位" kindId="pos"
										cssStyle="margin-left:10px;"></x:checkbox>
									<x:checkbox name="showPsm" label="人员" kindId="psm"
										cssStyle="margin-left:10px;" checked="true"></x:checkbox>
								</div>
							</div>
						</form>
						<div class="blank_div"></div>
						<div id="maingrid" style="margin: 2px;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>