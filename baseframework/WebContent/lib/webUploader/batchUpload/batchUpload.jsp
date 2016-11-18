<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<x:base include="dialog"/>
		<link href='<c:url value="/lib/webUploader/batchUpload/batchUpload.css"/>' rel="stylesheet" type="text/css" />
		<script src='<c:url value="/lib/webUploader/webuploader.js"/>' type="text/javascript"></script>
		<script src='<c:url value="/lib/webUploader/batchUpload/batchUpload.js"/>' type="text/javascript"></script>
	</head>
	<body>
		<x:hidden name="uploadFileType"/>
		<div id="showUploadFileType" style="margin-top: 10px;margin-left: 10px;"></div>
		<div id="showUploadInfo" style="margin-top: 3px;margin-left: 10px;"></div>
		<div class="uploaderWrapper">
			<ul id="uploaderFileList"></ul>
			<span id="picker" style="width: 100px">选择文件</span>
			<button id="startUpload" class="btn btn-default">开始上传</button>
			<button id="stopUpload" class="btn btn-default" style="display: none;">暂&nbsp;停</button>
			<button id="keepUpload" class="btn btn-default" style="display: none;">继续上传</button>
		</div>
	</body>
</html>