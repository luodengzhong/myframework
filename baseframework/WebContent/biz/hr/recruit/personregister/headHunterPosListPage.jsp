<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<x:base include="dialog,grid,dateTime,combox"/>
     	<script src='<c:url value="/biz/hr/recruit/personregister/headHunterPosListPage.js"/>' type="text/javascript"></script>  
  		
</head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
				 <x:hidden name="hunterId"/>
				 <x:hidden name="sourceType"/>
	  		    <x:title title="推荐岗位列表" hideTable="queryDiv"/>
			   <form method="post" action="" id="queryMainForm">
			   <div class="ui-form" id="queryDiv" style="width:900px;">
	    	<x:inputL name="organName" required="false" label="单位名称"/>
		    <x:inputL name="name" required="false" label="岗位名称"   maxLength="22"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
		
			<div id="maingrid" style="margin: 2px;"></div>
		</div> 
	 </div>
   </div>
  </body>
</html>