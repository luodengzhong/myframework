<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,date,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/master/statisticsQuery.js"/>' type="text/javascript"></script>
<style>
html{overflow: hidden;}
</style>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
						    <x:selectL list="#{0:'薪资单位', 1:'项目', 2:'中心', 3:'部门'}" name="type" width="100" emptyOption="false"  label="汇总口径"/>	
						    <div id="mainRegistrationId">
						       <x:selectL list="payRegistration" name="registrationId" width="230" emptyOption="false"  label="薪资发放单位"/>	
						    </div>
						    
							<dl>
								<x:button value="汇总" onclick="query(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
		</div>
	</div>
</body>
</html>
