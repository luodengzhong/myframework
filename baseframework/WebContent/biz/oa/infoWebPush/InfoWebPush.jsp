<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout" />
<link href='<c:url value="/biz/oa/infoWebPush/css/style.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/biz/oa/infoWebPush/InfoWebPush.js"/>' type="text/javascript"></script>
</head>
<body>
	<a href="javascript:updatehandledFlag();" hidefocus class="orangeBtn" style="position: absolute;top:20px;right:20px;z-index:200;"><span>已阅不再显示</span></a>
	<div class="mainPanel">
		<div id="mainWrapperDiv" >
			<div id="layout">
				<div position="center" id="layoutViewCenter">
					<div id="screenOverViewCenter" class="ui-tab-loading" ></div>
					<x:hidden name="firstId"/>
					<x:hidden name="firstInfoHandlerId"/>
				</div>
				<c:if test="${webPushInfoSize>1}">
				<div position="bottom" style="padding-top: 5px;" id="layoutBottom">
					<div class="bars" id="layoutBottomBars">
						<span class="nav prev" title="左移"></span>
				    	<span class="nav next" title="右移"></span>
				    </div>
				    <em id="currEm" class="currEm"></em>
				    <div id="layoutBottomThumbsDiv"  class="scrollDiv">
						<ul class="thumbs" id="layoutBottomThumbs">
						<c:forEach items="${webPushInfos}" var="info" varStatus="status">
							<li id="${info.infoPromulgateId}"  infoHandlerId="${info.infoHandlerId}" <c:if test="${status.index==0}">class="curr"</c:if>>
								<div><span>${info.subject}</span></div>
							</li>
						</c:forEach>
						</ul>
					</div>
				</div>
				</c:if>
			</div>
		</div>
	</div>
</body>
</html>
