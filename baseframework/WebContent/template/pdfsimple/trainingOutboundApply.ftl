<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>外送专项培训申请单</title>  
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
          <b>外送专项培训申请单</b>
   </div>
   <div style="height:15px;font-size:14px;"></div>
   <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
    	<tr>
          <td width="15%" align="left">申请人:${staffName}</td>
          <td width="15%" align="left">单位:${ognName}</td>
          <td width="15%" align="left">所属一级中心:${centreName}</td>
        </tr>
         <tr>
          <td  align="left">部门:${dptName}</td>
          <td  align="left" >岗位:${posName}</td>
          <td  align="left" >入职时间:<@formatdate date=employedDate/></td>
        </tr>
   </table>
    <br/>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>培训类别选择</b>
   </div>
    <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
         <tr>
          <td width="100%" align="left">外送培训类别:${outboundApplyTypeTextView}</td>
        </tr>
        <#if educationApplyType??&&educationApplyType?string!=''>
		 <tr>
          <td width="100%" align="left">申请类别:${educationApplyTypeTextView}</td>
        </tr>
	    </#if>  
	     <#if applyProperty??&&applyProperty?string!=''>
	     <tr>
          <td width="100%" align="left">申请性质:${applyPropertyTextView}</td>
        </tr>
       </#if>  
        
   </table>
   <br/>
   <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>外送培训人员列表</b>
   </div>
   <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="center" style="width:30px;"><b>单位名称</b></td>  
            <td class="center" style="width:30px;"><b>部门名称</b></td>
            <td class="center" style="width:30px;"><b>岗位名称</b></td>
            <td class="center" style="width:30px;"><b>员工姓名</b></td>
            <td class="center" style="width:30px;"><b>预计培训费用/元</b></td>
            <td class="center" style="width:30px;" ><b>差旅费/元</b></td>
         </tr>
        <#if OutboundApplyPersons?? && OutboundApplyPersons?size gt 0> 
		<#list OutboundApplyPersons as OutboundApplyPerson>
			<tr >
				<td class="center">${OutboundApplyPerson.ognName}</td>
				<td class="center">${OutboundApplyPerson.dptName}</td>
				<td class="center">${OutboundApplyPerson.posName}</td>
				<td class="center">${OutboundApplyPerson.personName}</td>
			    <td class="center">${OutboundApplyPerson.predictFee}</td>
				<td class="center">${OutboundApplyPerson.travelExpenses}</td>
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
      <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>外送专项培训基本信息</b>
   </div>
       <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
    	<tr>
           <td width="15%" align="left">培训课程:${course}</td>
          <td width="35%" align="left">培训地点:${place}</td>
        </tr>
         <tr>
           <td width="15%" align="left">讲师姓名:${teacherName}</td>
          <td width="35%" align="left">讲师简介:${teacherDesc}</td>
        </tr>
         <tr>
          <td width="15%" align="left">培训机构:${trainingOrgName}</td>
          <td width="35%" align="left">培训机构简介:${trainingOrgDesc}</td>
        </tr>
          <#if educationOrgan??&&educationOrgan?string!=''>
          <tr>
          <td width="15%" align="left">招生单位:${educationOrgan}</td>
          <td width="35%" align="left">上课地点:${educationPlace}</td>
        </tr>
         </#if>  
          <#if certificationName??&&certificationName?string!=''>
          <tr>
          <td width="15%" align="left">认证名称:${certificationName}</td>
          <td width="35%" align="left">颁发机构:${certificationOrgan}</td>
        </tr>
          <tr>
          <td width="15%" align="left">培训主办机构:${hostTrainOrgan}</td>
          <td width="35%" align="left">培训地点:${certificationPlace}</td>
        </tr>
         </#if> 
           <tr>
          <td width="15%" align="left">培训开始时间:<@formatdate date=startTime/></td>
          <td width="35%" align="left">培训结束时间:<@formatdate date=endTime/></td>
        </tr>
         <tr>
          <td  width="50%"  align="left" >申请内容及理由:${applicationContent}</td>
        </tr>
    </table>
      <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   