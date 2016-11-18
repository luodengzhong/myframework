<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,grid,dialog,tree,date,combox,attachment" />
<link href='<c:url value="/themes/default/showIcon.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquey.scrollLoad.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/document/setDocumentAuthPage.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/document/DocumentLibrary.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="文档目录" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="详细信息">
					<div id="documentLibraryDiv">
						<div id='documentInfoTab' style="width:99%;">
							<div class="ui-tab-links">
								<h2 >信息设置</h2>
								<ul style="left:80px;">
									<li id="baseInfo">基本信息</li>
									<li id="extendInfo">扩展信息</li>
									<li id="fileInfo">附件文件</li>
								</ul>
							</div>
							<div class="ui-tab-content"  style="padding: 2px;height: 170px;">
								<div class="layout" id="baseInfoDiv">
									<form method="post" action="" id="submitForm">
										<table class='tableInput' style="width: 99%; margin: 2px;">
											<x:layout />
											<tr>
												<x:hidden name="documentLibraryId" />
												<x:hidden name="parentId" />
												<x:hidden name="fileId" />
												<x:hidden name="documentType" />
												<x:inputTD name="documentName" required="true" label="名称" maxLength="120" colspan="3"/>
												<x:inputTD name="sequence" required="true" label="序号" maxLength="6" spinner="true" mask="nnn" />
											</tr>
											<tr>
												<x:inputTD name="fullPathName" readonly="true" label="路径" colspan="3" cssClass="textReadonly"/>
												<x:inputTD name="documentTypeTextView" required="false"  readonly="true" label="类型" cssClass="textReadonly"/>
											</tr>
											<tr>
												<x:inputTD name="createByName" readonly="true" label="创建人"  cssClass="textReadonly"/>
												<x:inputTD name="createDate" readonly="true" label="创建时间"  mask="datetime" cssClass="textReadonly"/>
												<x:inputTD name="statusTextView" required="false"  readonly="true" label="状态" cssClass="textReadonly"/>
											</tr>
											<tr>
												<x:inputTD name="lastModifName" readonly="true" label="最后修改人" cssClass="textReadonly"/>
												<x:inputTD name="lastModifDate" readonly="true" label="最后修改时间"  mask="datetime" cssClass="textReadonly"/>
												<td colspan="2" class="title">&nbsp;</td>
											</tr>
											<tr>
												<td  class="title"><span class="labelSpan">权限继承选项&nbsp;:</span></td>
												<td colspan="5" class="title" style="line-height: 25px">&nbsp;&nbsp;
													<x:checkbox name="isManagePermissions"  label="继承管理权限"/>&nbsp;&nbsp;
													<x:checkbox name="isVisitPermissions"  label="继承访问权限"/>&nbsp;&nbsp;
													<x:checkbox name="isAddPermissions"  label="继承新建权限"/>&nbsp;&nbsp;
													<x:checkbox name="isEditPermissions"  label="继承编辑权限"/>&nbsp;&nbsp;
													<x:checkbox name="isDeletePermissions"  label="继承删除权限"/>&nbsp;&nbsp;
													<x:checkbox name="isDownloadPermissions"  label="继承下载权限"/>&nbsp;&nbsp;
												</td>
											</tr>
											<tr>
												<x:inputTD name="remark" required="false" label="描述/关键字" maxLength="100" colspan="5" />
											</tr>
										</table>
									</form>
								 </div>
								 <div class="layout" id="extendInfoDiv">
									<form method="post" action="" id="extendInfoForm">
										<table class='tableInput' style="width: 99%; margin: 2px;">
											<x:layout />
											<tr>
												<x:hidden name="documentLibraryId"  id="extendInfoLibraryId"/>
												<x:inputTD name="code1" required="false" label="档号" maxLength="30" colspan="2"/>
												<x:inputTD name="code2" required="false" label="案卷号" maxLength="30"  colspan="2"/>
											</tr>
											<tr>
												<x:inputTD name="code3" required="false" label="全宗号" maxLength="30" colspan="2"/>
												<x:inputTD name="code4" required="false" label="件号" maxLength="30"  colspan="2"/>
											</tr>
											<tr>
												<x:inputTD name="code5" required="false" label="文号" maxLength="30" colspan="2"/>
												<x:inputTD name="security" required="false" label="密级" maxLength="16"  colspan="2"/>
											</tr>
											<tr>
												<x:inputTD name="storagePlace" required="false" label="存放位置" maxLength="60" colspan="5"/>
											</tr>
											<tr>
												<x:inputTD name="docRemark" required="false" label="备注" maxLength="100" colspan="5"/>
											</tr>
										</table>
									</form>
								 </div>
								 <div class="layout" id="fileInfoDiv">
								 <form method="post" action="" id="fileInfoForm">
									 <table class='tableInput' style="width: 99%; margin: 2px;">
										<x:layout />
										<tr>
											<x:inputTD name="fileName" required="false" label="文件名" colspan="5" readonly="true" cssClass="textReadonly"/>
										</tr>
										<tr>
											<x:inputTD name="creatorName" required="false" label="上传人"  readonly="true"  cssClass="textReadonly"/>
											<x:inputTD name="createDate" required="false" label="上传时间"  readonly="true"  cssClass="textReadonly"/>
											<x:inputTD name="fileSize" required="false" label="文件大小"  readonly="true"  cssClass="textReadonly"/>
										</tr>
										<tr>
											<td class="title" colspan="6" style="text-align: center;line-height: 23px;">
												<x:button value="历史版本"  id="documentFileHistory"/>&nbsp;&nbsp;
												<x:button value="预 览" onclick="doViewFile(0)" />&nbsp;&nbsp;
												<x:button value="下 载" onclick="downloadFile(0)" />&nbsp;&nbsp;
												<x:button value="替 换"  id="replaceFileButton"/>&nbsp;&nbsp;
												<!--<x:button value="大文件替换"  id="replaceBigFileButton" onclick="replaceBigFileClick()" cssStyle="width:80px;"/>&nbsp;&nbsp;-->
											</td>
										</tr>
									</table>
								 </form>
								 </div>
							</div>
						</div>
						<div class="blank_div"></div>
						<div id='documentLibraryTab' style="width:99%;">
							<div class="ui-tab-links">
								<h2 >权限设置</h2>
								<ul style="left:80px;">
									<li id="childrenList">包含文件及目录</li>
									<li id="documentPostil">评注信息</li>
									<c:forEach items="${documentAuthKindList}" var="obj">
									<li id="${obj.key}" class="auth">${obj.value}权限</li>
									</c:forEach>
									<li id="documentLog">操作日志</li>
								</ul>
							</div>
							<div class="ui-tab-content"  style="padding: 2px;">
								<div class="layout" id="showChildrenList" >
									<div id="childrenListGrid" ></div>
								</div>
								<div class="layout" id="documentPostilDiv" >
									<div id="documentPostilGrid" ></div>
								</div>
								<c:forEach items="${documentAuthKindList}" var="obj">
								<div class="layout" id="${obj.key}Div" >
									<div id="${obj.key}AuthGrid" ></div>
								</div>
								</c:forEach>
								<div class="layout" id="documentLogDiv" >
									<div id="documentLogGrid" ></div>
								</div>
							</div>
						</div>
						<div style="text-align:right;">
							<x:button value="新增同级" onclick="add(0)" />&nbsp;&nbsp;
							<x:button value="新增子级" onclick="add(1)" />&nbsp;&nbsp;
							<x:button value="删 除" onclick="deleteDocument()" />&nbsp;&nbsp;
							<x:button value="启 用" onclick="enableOrDisable(1)" />&nbsp;&nbsp;
							<x:button value="停 用" onclick="enableOrDisable(-1)" />&nbsp;&nbsp;
							<x:button value="保 存" onclick="saveDocumentLibrary()" />&nbsp;&nbsp;
							<x:button value="新建文件" id="updateFileButton" />&nbsp;&nbsp;
							<!--<x:button value="上传大文件" onclick="openFTPUpLoadPage()" />&nbsp;&nbsp;-->
							<x:button value="权限查询" onclick="showDocumentPersonPowerByKindAuth()" />&nbsp;&nbsp;
							<x:button value="关 闭" onclick="closeWindow()" />&nbsp;&nbsp;
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
