<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,attachment"/>
  	<script
  	src='<c:url value="/biz/hr/recruit/personregister/PersonRegisterOther.js"/>'  
	type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
	
  </head>
 <body>
  <div class="mainPanel">
    <x:hidden name="writeId"/>
    <x:hidden name="sourceType"/>
    <x:fileList bizCode="personRegister" bizId="writeId" id="writeFileList" />
	<x:title title="高中及以后学习经历"  name="group"  hideTable="learnDetailId"/>
	  <div class="ui-form" id="learnDetailId" style="margin: 2px;"></div>
	  	<x:title title="工作以后的培训经历"  name="group"  hideTable="trainDetailId"/>
	  	  <div id="trainDetailId" style="margin: 2px;"></div>
	
	
	    <x:title title="家庭及社会主要成员"  name="group"  hideTable="familyDetailId"/>
	  	  <div id="familyDetailId" style="margin: 2px;"></div>
	
	    <x:title title="主要工作经历"  name="group"  hideTable="mainWorkId"/>
	  	  <div id="mainWorkId" style="margin: 2px;"></div>
	
	    <x:title title="最后二家单位的详细情况"  name="group"  hideTable="workDetailId"/>
	  	  <div id="workDetailId" style="margin: 2px;"></div>
	 	<div id="bottomOtherToolbar" style="margin:2px;"></div>
</div>
  </body>
  </html>
