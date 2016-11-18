<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/biz/hr/recruit/headhunter/Headhunter.js"/>' type="text/javascript"></script>
  	
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="猎头信息管理" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="hunterId"/>
		<x:inputL name="name" required="false" label="公司名称" />	
		<x:selectL name="cooperateStatus" required="false" label="合作状态"    />					
		<div class="clear"></div>
		<x:selectL name="suggestCoopWay" required="false" label="建议合作状态"  />					
		
	     <x:inputL name="endTime" required="false" label="终止时间"  wrapper="date"/>					
		
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px;"></div>
		</div> 
	</div>
  </body>
</html>
