<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/JSTLFunction.tld" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<style>
body{background-color:#e6efff;}
td{padding-left: 10px}
</style>
<script type="text/javascript">
function update(){
	//window.open(web_app.name + '/paformMakeAction!forwardPerformAssessBill.job?isScreenStartAssessButton='+1);
	parent.parent.addTabItem({
		tabid: 'HRPaformMakeActionBill',
		text: '绩效考核表更新',
		url: web_app.name + '/paformMakeAction!forwardPerformAssessBill.job?isScreenStartAssessButton='+1
	}
	);
}
</script>
</head>
<body>
<div>
<form action=""  id="submitForm">
<br>
<br>
       <div class="subject">请点击下方<font  style="color:red; font-size:28px; font-weight:bold;">更新</font>按钮及时更新本季度个人量化绩效考核表 </div>
       <br>
       <div style="text-align:center;font-size: 16px">总裁助理级及以上人员、单位第一负责人、已有固定考核模板人员、招标人员无需更新 </div>
        <br>
       <div style="text-align:center;font-size: 16px">如有疑问，请咨询所在单位人力资源人员</div>
         <br>
         <br>
          <div style="text-align: center">
                <input type="button" value="更  新" style="font-size: 17px; text-align:center; width:90px;height:40px" onclick="update()">&nbsp;&nbsp;&nbsp;&nbsp;
                       &nbsp;&nbsp;
         </div>
</form>
</div>
</body>
</html>