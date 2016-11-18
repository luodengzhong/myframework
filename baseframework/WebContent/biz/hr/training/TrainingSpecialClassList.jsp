<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,layout"/>
      <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
      <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
      <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
      <script src='<c:url value="/biz/hr/training/TrainingSpecialClass.js"/>' type="text/javascript"></script>
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
		<div position="center" title="专项班">
		<x:hidden name="parentId"   id="treeParentId"/>
	  	<x:title title="搜索" hideTable="queryDiv"/>
	  	<div class="ui-form" id="queryDiv" style="width:900px;">
		<form method="post" action="" id="queryMainForm">
		<x:hidden name="trainingSpecialClassId"/>
		<x:inputL name="className" required="false" label="班级名称" maxLength="128"/>
		<x:selectL name="classStatus" required="false" label="班级状态" />	
		<x:inputL name="personMemberName" required="false" label="班级负责人" maxLength="1024"/>	
		<div  class="clear"></div>				
		<x:inputL name="openTime" required="false" label="开班时间" wrapper="date" maxLength="7"/>
		<x:inputL name="graduatedTime" required="false" label="结业时间" wrapper="date" maxLength="7"/>
		            <dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
	    </form>
	    </div>
		<div class="blank_div"></div>
		<div id="maingrid"  style="margin: 2px"></div>
		</div>
		</div>
		</div>
	</div>
  </body>
</html>
