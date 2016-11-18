<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script type="text/javascript">
function save(){
	var staffName=$('#staffName').val();
	var teacher=$('#teacherName').val();
	Public.ajax(web_app.name + '/teacherPlanAction!createTeacherTask.ajax',{staffName:staffName,teacher:teacher});
	
}
function tableDataCreate(){
	var staffName=$('#staffName').val();
	var teacher=$('#teacherName').val();
	Public.ajax(web_app.name + '/teacherPlanAction!createThreeTableData.ajax',{staffName:staffName,teacher:teacher});
}

</script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
		
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
					
							<table class='tableInput' id='queryTable'>
					
							<x:hidden name="teacherPlanId" />
							<tr>
							<x:inputL name="staffName" required="false" label="新员工姓名" maxLength="32" />
							</tr>
							<tr>
							<x:inputL name="teacherName" required="false" label="督导师姓名" maxLength="32" />
							</tr>
							<dl>
								<x:button value="生成试用期和督导评分任务" onclick="save(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
								<x:button value="创建三表数据并启动督导计划流程" onclick="tableDataCreate(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</table>
						</div>
						
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin:2px"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
