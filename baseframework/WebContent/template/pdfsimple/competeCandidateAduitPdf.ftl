<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>演讲候选人请示申请单</title>  
   <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    position: absolute;
                top:0px;
                left:0px;
            }
            table{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
               border:solid 2px;
            }
           
            table tr{  
               text-align: left;
            } 
                        
            table td{
               border-right: 1px solid #000000;height:35px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word; 
               padding-left:1px;
            }
            table td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table td.left{
                width:200px;
            	text-align: left;
            	padding-left:20px;
            }
           
            @page {    
                size:  210mm 297mm;
           }  
        </style> 
</head>  
<#-- 定义宏formatdate-->
<#macro formatdate date>
<#if date??&&date?string!=''>
${date?string("yyyy-MM-dd")}
</#if>
</#macro>
<body>
<div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
 <br></br>
  <div align="center" style="font-weight:bold;font-size:20px;height:20px;">  
          <b>演讲候选人请示申请单</b>
   </div>
   <div style="height:15px;font-size:14px;"></div>
   <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
    	<tr>
          <td width="15%" align="left">机构名称:${organName}</td>
          <td width="15%" align="left">填表日期:<@formatdate date=fillinDate/></td>
          <td width="15%" align="left">单据号码:${billCode}</td>
        </tr>
         <tr>
          <td  align="left">部门名称:${deptName}</td>
          <td  align="left" >岗位名称:${positionName}</td>
          <td  align="left" >申请人:${personMemberName}</td>
        </tr>
         <tr>
          <td  align="left" colspan="3" rowspan="4">描述:${desption}</td>
        </tr>
   </table>
    <br/>
   <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>演讲候选人列表</b>
   </div>
   <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="center" style="width:10px;"><b>序号</b></td>  
            <td class="center" style="width:30px;"><b>单位</b></td>  
            <td class="center" style="width:30px;"><b>中心</b></td>
            <td class="center" style="width:30px;"><b>岗位</b></td>
            <td class="center" style="width:30px;"><b>员工姓名</b></td>
            <td class="center" style="width:30px;"><b>行政级别</b></td>
            <td class="center" style="width:30px;" ><b>毕业学校</b></td>
            <td class="center" style="width:30px;" ><b>入职时间</b></td>
            <td class="center" style="width:30px;" ><b>演讲岗位</b></td>
             <td class="center" style="width:20px;"><b>是否同意</b></td>
         </tr>
        <#if talentsChosenPersonDetail?? && talentsChosenPersonDetail?size gt 0> 
		<#list talentsChosenPersonDetail as talentsChosenPerson>
			<tr >
				<td class="center">${talentsChosenPerson.rownum}</td>
				<td class="center">${talentsChosenPerson.ognName}</td>
				<td class="center">${talentsChosenPerson.centreName}</td>
				<td class="center">${talentsChosenPerson.posName}</td>
				<td class="center">${talentsChosenPerson.staffName}</td>
			    <td class="center">${talentsChosenPerson.posLevelTextView}</td>
				
				<td class="center">${talentsChosenPerson.campus}</td>
				<td class="center"><@formatdate date=talentsChosenPerson.employedDate/></td>
				<td class="center">${talentsChosenPerson.chosenPosName}</td>
				<td class="center">${talentsChosenPerson.yesornoTextView}</td>
			</tr> 
		</#list>
		<#else>
			<tr>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <br/>
       <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
    	<tr>
          <td width="100%" align="left" >演讲时间:<@formatdate date=speechTime/></td>
        </tr>
         <tr>
          <td  width="100%" >演讲地点:${speechPlace}</td>
        </tr>
         <tr>
          <td   width="100%" align="left"  >演讲方式:${way}</td>
        </tr>
         <tr>
          <td  width="100%"  align="left" >演讲规则:${speechRule}</td>
        </tr>
         <tr>
          <td  width="100%"  align="left" >演讲提醒:${speechRemind}</td>
        </tr>
         <tr>
          <td  width="100%"  align="left" >评委组成:${remark}</td>
        </tr>
    </table>
      <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   