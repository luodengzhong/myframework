<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>		
<title>导航菜单</title>
<link href='<c:url value="/themes/default/ui.css"/>' rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href='<c:url value="/desktop/css/style.css"/>'/>
<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.json-2.4.min.js"/>' type='text/javascript'></script>
<script src='<c:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.lazyload.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.core.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.widget.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.mouse.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.sortable.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.droppable.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/desktop/script.js"/>'  type="text/javascript"></script>
</head>
<body>
<div id="main_div">  
  <div id='doDelete' class='op-state-delete'>&nbsp;</div>
  <div id='screenOverDiv'></div>
  <!-- 图标显示区域 -->
  <div id="gallery">
    <div id="slides">
		<c:forEach items="${screens}" var="obj">
		<div class="slide" id='<c:out value="${obj.id}"/>'>
			<c:forEach items="${obj.functions}" var="fun">
			<div class="portlet" id='<c:out value="${fun.functionId}"/>' link='<c:out value="${fun.location}"/>' title='<c:out value="${fun.title}"/>'>
				<div class="portlet-header">
					<img class="lazy" src='<c:url value="/desktop/images/grey.gif"/>' data-original='<c:url value="${fun.icon}"/>' width='64' height='64'/>
				</div>
				<div class="portlet-content"><c:out value="${fun.title}"/></div>
			</div>
			</c:forEach>
		</div>
		</c:forEach>
    </div>
    <!-- 菜单栏 -->
    <div id="menu">
	    <div class='manager'><a href='#' title='设置' hidefocus id='manager_show'>&nbsp;</a></div>
		<ul class='ulmenu'>
			<li class="fbar">&nbsp;</li>
			<c:forEach items="${screens}" var="obj">
			<li class="menuItem"><a href="#" hidefocus><img src='<c:url value="/desktop/images/desktop.png"/>'/></a></li>
			</c:forEach>
		</ul>
    </div>
  </div>
</div>
<!-- 菜单管理对话框 -->
<div id='manager_dialog' class='manager_dialog'>
	<div class='md-title'>
		<span class='title'>页面设置</span>
		<span class='close'><a href='#' title='关闭' hidefocus id='manager_hide'>&nbsp;</a></span>
	</div>
	<div id='mybuttons' class='md-buttons'>
		<a href="#mg_function" hidefocus class='selected'>应用设置</a>&nbsp;&nbsp;
		<a href="#mg_screen" hidefocus>分屏设置</a>&nbsp;&nbsp;
		<span id='op_message'></span>
	</div>
	<div id='mdcontent' class='md-content'>
		<div id='mg_function' class='mg_function'>
			<div class='leftDiv'>
				<a href="#" hidefocus class="scroll-up">&nbsp;</a>
				<div id='leftSystems' class='leftSystems'></div>
				<a href="#" hidefocus class="scroll-down">&nbsp;</a>
			</div>
			<div id='rightFunctions' class='rightFunctions'></div>
		</div>
		<div id='mg_screen' class='mg_screen'>
			<div class='add_screen' title='添加分屏'>&nbsp;</div>
		</div>
	</div>
</div>
</body>
</html>
