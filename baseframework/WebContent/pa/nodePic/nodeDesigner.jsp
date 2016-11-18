
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<title>绘制流程图</title>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<link href='<c:url value="/system/opm/permission/showIcon.css"/>'
	rel="stylesheet" type="text/css" />
<script src='<c:url value="swfobject.js"/>' type="text/javascript"></script>
<script src='<c:url value="nodeDesigner.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquey.scrollLoad.js"/>'
	type="text/javascript"></script>
<style type="text/css">
.fullflash {
	position: absolute;
	top: 28px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	z-index: 0;
}

body,ul,li {
	margin: 0;
	padding: 0;
}

body {
	font: 12px/24px arial;
}

#menu {
	position: absolute;
	top: -9999px;
	left: -9999px;
	width: 100px;
	border-radius: 3px;
	list-style-type: none;
	border: 1px solid #8f8f8f;
	padding: 2px;
	background: #fff;
	z-index: 9999;
}

#menu li {
	position: relative;
	height: 24px;
	padding-left: 24px;
	background: #eaead7;
	vertical-align: top;
}

#menu li a {
	display: block;
	color: #333;
	background: #fff;
	padding-left: 5px;
	text-decoration: none;
}

#menu li.active {
	background: #9DC4FB;
}

#menu li.active a {
	color: #fff;
	background: #B3D0FA;
}

#menu li em {
	position: absolute;
	top: 0;
	left: 0;
	width: 24px;
	height: 24px;
}

#menu li em.update {
	
}

#menu li em.config {
	
}
</style>
</head>
<body>
	<div id="toolBar"></div>
	<div class="fullflash">
		<div id="mainflash"></div>
	</div>
	<ul id="menu" onmouseout="hideMenu()" onmouseover="showMenu()">
		<li><em class="update"></em><a
			href="javascript:showUpdateDialogForContextMenu();">修改</a></li>
		<li><em class="config"></em><a
			href="javascript:showNodeManageDialogForContextMenu();">节点配置</a></li>
	</ul>
</body>
</html>