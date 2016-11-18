<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,combox,grid,dateTime,tree,attachment" />
<link href='<c:url value="/themes/default/button.css"/>' rel="stylesheet" type="text/css"/>
<link href='<c:url value="/biz/oa/document/css/document.css"/>' rel="stylesheet" type="text/css"/>
<script src='<c:url value="/lib/jquery/jquey.scrollLoad.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/document/setDocumentAuthPage.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/document/DocumentPage.js?a=2"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="文档中心" id="mainmenu"  style="background-color: #f6f7f9">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;background-color: #f6f7f9;margin-top: 5px;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="top" title="文件列表" > 
					<div style="background-color: #f6f7f9;height:50px;">
						<span class="left-top-background"></span>
						<span style="float: left; margin-left: 10px;height:50px;">
							<a href="javascript:void(0);" class="ui-button ui-button-add" id="addNewFile" style="width: 60px;position: relative;*top: 10px;">新建文件</a>
							<a href="javascript:void(0);" class="ui-button ui-button-spark" id="addNewFileByFtp">文件批量上传</a>
							<a href="javascript:void(0);" class="ui-button ui-button-tb" id="queryByDetail">搜&nbsp;&nbsp;索</a>
							<a href="javascript:void(0);" class="ui-button ui-button-save" id="documentPostil">评注信息</a>
							<a href="javascript:void(0);" class="ui-button ui-button-like" id="folderOperator">文档操作</a>
						</span> 
						<span style="float: right; margin-right: 10px;height:50px;"> 
							<select  id="view_handle" class="view-handle-select noWrapper">
						        <option value="block" selected="true">缩略图视图</option>
						        <option value="list">列表视图</option>
						    </select>
						</span>
					</div>
				</div>
				<div position="center" title="文件列表" style="background-color: #f6f7f9" id="layoutCenter">
					<x:hidden name="documentLibraryId"  id="chooseDocumentLibraryId"/>
					<div id="showDocumentLibraryFile" ></div>
					<div id="showDocumentFileDiv"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
