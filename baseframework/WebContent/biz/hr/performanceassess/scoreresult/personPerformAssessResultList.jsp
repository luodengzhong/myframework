<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,layout,tree"/>
  <script src='<c:url value="/biz/hr/performanceassess/scoreresult/personPerformAssessResultList.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		
	  		<x:title title="员工个人绩效评分结果查看" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="resultId"/>
		<x:select name="tempArchivesState" list="archivesState" cssStyle="display:none;"/>
	    <x:select name="performanceLevel" id="mainPerformanceLevel" dictionary="performanceLevel"  cssStyle="display:none;" emptyOption="false"/>
		
	<dl>
								<dt style="width: 60px;">考核年&nbsp;:</dt>
								<dd style="width: 80px;">
									<x:input name="year" required="false" label="考核年" maxLength="4"
										cssStyle="width:80px;" />
								</dd>
							</dl>
							<dl>
								<dt style="width: 73px;">考核周期&nbsp;:</dt>
								<dd style="width: 80px;">
									<x:select list="period" name="periodCode" 
										required="false" label="考核周期" />
								</dd>
							</dl>
							<dl>
								<dt style="width: 73px;">考核时间&nbsp;:</dt>
								<dd style="width: 175px;">
									<x:input name="periodIndex" required="false" label="考核时间" />
								</dd>
							</dl>
							<div class='clear'></div>
							<dl>
								<dt style="width: 60px;">人员&nbsp;:</dt>
								<dd style="width: 120px;">
									<x:input name="staffName" required="false" />
								</dd>
							</dl>
							
		
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"  style="margin: 2px;"></div>
		</div> 
	</div>
	</div>
	</div>
  </body>
</html>
