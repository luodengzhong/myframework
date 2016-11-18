<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,layout"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/entry/beformal/BeFormalPersonList.js"/>' type="text/javascript"></script>
  	
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
				<div position="center" title="转正员工列表">
	  		     <x:title title="转正员工列表" hideTable="queryDiv"/>
			     <form method="post" action="" id="queryMainForm">
			     <div class="ui-form" id="queryDiv" style="width:900px;">

			     <x:inputL name="employDateBegin" required="false" label="入职时间(起)" maxLength="7" labelWidth="120" wrapper="date"/>	
			     <x:inputL name="employDateEnd" required="false" label="入职时间(止)" maxLength="7" labelWidth="120"  wrapper="date"/>	
			     <div class="clear"></div>
			      <x:inputL name="staffName" required="false" label="员工姓名" maxLength="7" labelWidth="120" />	
			     
					<dl>
						<dd>
						<x:checkbox  name="checkvalue"  label="查询即将转正员工"   checked="true" />
						</dd>
						</dl>
						<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrlistid"  style="margin: 2px;"></div>
		   </div> 
		</div> 
	</div>
 </div>
  </body>
</html>
