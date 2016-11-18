<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,dateTime,grid,combox" />
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/setup/DetailDefineDetail.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/setup/DetailUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<x:hidden name="parentId" id="detailDefineParentId" />
		<div id="mainWrapperDiv">
			<div style="text-align: center; font-size: 20px; font-weight: bold; margin-top:10px; margin-bottom: 10px;width: 99%;">人事子集信息</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;">
					<x:layout proportion="12%,21%,12%,21%,12%" />
					<tr>
						<x:hidden name="id" id="detailDefineID" />
						<x:inputTD name="name" required="true" label="子集名称" maxLength="32"
							colspan="3" />
						<x:inputTD name="code" required="true" label="子集编码" maxLength="16" />
					</tr>
					<tr>
						<x:inputTD name="modelPath" required="true" label="对应模型文件"
							maxLength="64" colspan="3" />
						<x:inputTD name="entityName" required="true" label="对应实体"
							maxLength="32" />
					</tr>
					<tr>
						<x:radioTD list="#{'1':'是','0':'否'}" name="isInsert"
							required="true" label="是否允许新增" value="1" />
						<x:radioTD list="#{'1':'是','0':'否'}" name="isUpdate"
							required="true" label="是否允许编辑" value="1" />
						<x:radioTD list="#{'1':'是','0':'否'}" name="isDelete"
							required="true" label="是否允许删除" value="1" />
					</tr>
					<tr>
						<x:radioTD list="#{'1':'是','0':'否'}" name="isGrid" required="true"
							label="表格中编辑" value="1" />
						<x:inputTD name="cols" required="false" label="列数" maxLength="22"
							spinner="true" mask="n" dataOptions="min:1,max:9,countWidth:true" cssStyle="width:100px;"/>
						<x:inputTD name="tableLayout" required="false" label="表格显示布局"
							maxLength="64" />
					</tr>
				</table>
			</form>
			<div id="detailFieldDefineGrid" style="margin-top: 2px;"></div>
		</div>
	</div>
</body>
</html>
