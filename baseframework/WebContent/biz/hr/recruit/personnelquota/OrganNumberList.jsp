<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,layout,tree"/>
  	<script src='<c:url value="/biz/hr/recruit/personnelquota/OrganNumber.js"/>' type="text/javascript"></script>  
  		<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  		<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  		
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="编制人数列表">
						<x:hidden name="fullId"/>
	  		     <x:title title="编制人数列表" hideTable="queryDiv"/>
			   <form method="post" action="" id="queryMainForm">
			   <div class="ui-form" id="queryDiv" style="width:900px;">
			  <x:hidden name="affirmPersonApplyId"/> 
		      <x:hidden name="dptId"/>
	    	<x:inputL name="name" required="false" label="单位名称"/>
		    <x:selectL name="staffingLevel" required="false" label="编制类别"   maxLength="22"/>
		    
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div  style="color: red;font-size:16px" align="left"> 
		   (各分公司编制负责人请注意,不要随意修改分公司各类编制的总人数和上浮幅度)
		  </div>
			<div id="maingrid" style="margin: 2px;"></div>
		</div> 
		</div>
	 </div>
   </div>
  </body>
</html>
