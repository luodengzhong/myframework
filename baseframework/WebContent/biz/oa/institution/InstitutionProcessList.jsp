
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="layout,tree,dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/oa/institution/InstitutionProcessList.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	    <div id="layout">
	  	    <div position="center" title="制度修订明细">
	  		<x:title title="制度修订搜索" hideTable="queryDiv"/>
	  		<x:hidden name="organId" />
			<form method="post" action="" id="submitForm">
			<x:hidden name="personMemberId" />
			<div class="ui-form" id="queryDiv" style="width:900px;">
				<x:inputL name="billCode" required="false" labelWidth="60" label="单号" />
				<x:inputL name="personMemberName" required="false" labelWidth="60" label="员工" />
				<x:selectL list="institutionReviseStatus" id="institutionReviseStatusId"  width="80" name="status" required="false" label="申请状态" maxLength="22"/>
			<dl>
				<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
				<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
			</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px"></div>
			</div>
			</div>
		</div> 
	</div>
  </body>
</html>
