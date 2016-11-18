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
function save(recPosName,jobApplyId,jobPosId,sourceType){
	window.open(web_app.name + '/personregisterAction!showInsertPersonRegister.do?applyPosName='+encodeURI(encodeURI(recPosName))+'&jobApplyId='+jobApplyId+'&applyPosId='+jobPosId+
			 '&sourceType='+sourceType);
}

function back(){
	history.back();
}
</script>
</head>
<body>
<div>
<form action=""  id="submitForm">
<table id="proTbale" width="100%" align="center" border="0" cellpadding="6" cellspacing="5" bgcolor="#ffffff">
	 <tr>
                            <td width="15%" height="40"  align="center" valign="middle" bgcolor="#F2F2F2"  >职位名称： </td>

                            <td bgcolor="#D4D4D4"  id="recPosName">${name}</td>
    </tr>
                        <tr>
                            <td width="15%" align="center" height="40" valign="middle" bgcolor="#F2F2F2" >招聘公司：</td>
                            <td bgcolor="#D4D4D4" >蓝光集团--${organName}</td>
    </tr>
                        <tr>
                            <td align="center" valign="middle"  height="40" bgcolor="#F2F2F2" >招聘人数：</td>
                            <td bgcolor="#D4D4D4" >${recNumber}</td>
    </tr>
                        <tr>
                            <td align="center" valign="middle" height="40" bgcolor="#F2F2F2" >学历：</td>
                            <td bgcolor="#D4D4D4" >${eduReq}</td>
    </tr>


                        <tr>
                            <td align="center" valign="middle"  height="40" bgcolor="#F2F2F2" >工作地点：</td>
                            <td bgcolor="#D4D4D4" >${address}</td>
    </tr>
                        <tr>
                            <td align="center" valign="middle" height="40"  bgcolor="#F2F2F2" >年龄要求：</td>
                            <td bgcolor="#D4D4D4" >${ageReq}</td>
    </tr>

                       <tr>
                            <td align="center" valign="middle" height="40"  bgcolor="#F2F2F2" >职称要求：</td>
                            <td bgcolor="#D4D4D4" >
                                 <p>${professionalReq}</p></td>
                        </tr>
                        
                           <tr>
                            <td align="center" valign="middle" height="40"  bgcolor="#F2F2F2" >专业年限： </td>
                             <td bgcolor="#D4D4D4" >${yearReq}</td>
                           </tr> 
                           <tr>
                            <td align="center" valign="middle" height="80" bgcolor="#F2F2F2" >任职要求：</td>
                            <td bgcolor="#D4D4D4" >${takeJobReq} </td>
                        </tr>
                      
                        <tr>
                            <td align="center" valign="middle" height="80" bgcolor="#F2F2F2" >岗位职责：</td>
                             <td bgcolor="#D4D4D4" >${posDesReq} </td>
                        </tr>
                        
                            <tr>
                            <td align="center" valign="middle" height="40" bgcolor="#F2F2F2" >其他要求：</td>
                             <td bgcolor="#D4D4D4" >${otherReq} </td>
                        </tr>
</table>
<br>
                        <div style="text-align: center">
                        <input type="button" value="应 聘" style="font-size: 15px; text-align:center; width:90px;height:40px" onclick="save('${name}','${jobApplyId}','${jobPosId}','${sourceType}')" >&nbsp;&nbsp;&nbsp;&nbsp;
                       &nbsp;&nbsp; <input type="button" value="返 回" style="font-size: 15px; text-align:center; width:90px;height:40px" onclick="back()" >
                        </div>
</form>
</div>
</body>
</html>