<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,grid,dialog,tree,combox" />
<link href='<c:url value="/themes/default/showIcon.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquey.scrollLoad.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/setup/infoKind.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="信息类型" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="详细信息">
					<form method="post" action="" id="submitForm">
						<table class='tableInput' style="width: 99%; margin: 2px;">
							<x:layout />
							<tr>
								<x:hidden name="infoKindId" />
								<x:hidden name="parentId" />
								<x:inputTD name="code" required="true" label="编码" maxLength="30" />
								<x:inputTD name="name" required="true" label="名称" maxLength="12" />
								<x:inputTD name="sequence" required="true" label="序号" maxLength="6" spinner="true" mask="nnn" />
							</tr>
							<tr>
								<x:inputTD name="priorityCoefficient" required="true" label="优先级系数" mask="nnn.n"  />
								<x:inputTD name="funcUrl" required="false" label="处理功能URL" maxLength="100" colspan="3" />
							</tr>
							<tr>
								<td colspan="6" class="title" style="line-height: 22px">
									&nbsp;<x:checkbox name="isNeedDispatchNo" label="是否需要发文号"  value="1"/>&nbsp;
									&nbsp;<x:checkbox name="isCanCreateTask" label="是否允许发送任务"  value="1"/>&nbsp;
									&nbsp;<x:checkbox name="isNeedSendMessage" label="是否需要发送消息"  value="1"/>&nbsp;
									&nbsp;<x:checkbox name="isSendClientMessage" label="默认发送客户端消息"  value="1"/>&nbsp;
								</td>
							</tr>
							<tr>
								<x:inputTD name="imgPath" required="false" label="首页显示图片" maxLength="120" colspan="4"  id="input_icopath"/>
								<td class="title"><input type='button' value='选择图片' class='buttonGray' onclick="chooseImg()"/></td>
							</tr>
							<tr>
								<x:inputTD name="statusTextView" required="false"  readonly="true" label="状态" cssClass="textReadonly"/>
								<x:inputTD name="description" required="false" label="描述" maxLength="100" colspan="3" />
							</tr>
						</table>
					</form>
					<div class="blank_div"></div>
					<div id='infoKindTab' style="width:99%;">
						<div class="ui-tab-links">
							<h2 >类别属性</h2>
							<ul style="left:80px;">
								<li id="senderPriority">发送人优先级</li>
								<li id="permission">信息类型权限</li>
							</ul>
						</div>
						<div class="ui-tab-content"  style="padding: 2px;">
							<div class="layout" id="showSenderPriority" >
								<div id="senderPriorityGrid" ></div>
							</div>
							<div class="layout" id="showPermission">
								<div id="permissionGrid" ></div>
							</div>
						</div>
					</div>
					<div style="text-align:right;">
						<x:button value="新增同级" onclick="add(0)" />&nbsp;&nbsp;
						<x:button value="新增子级" onclick="add(1)" />&nbsp;&nbsp;
						<x:button value="删 除" onclick="deleteKind()" />&nbsp;&nbsp;
						<x:button value="启 用" onclick="enableOrDisable(1)" />&nbsp;&nbsp;
						<x:button value="停 用" onclick="enableOrDisable(-1)" />&nbsp;&nbsp;
						<x:button value="保 存" onclick="saveKind()" />&nbsp;&nbsp;
						<x:button value="关 闭" onclick="closeWindow()" />&nbsp;&nbsp;
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
