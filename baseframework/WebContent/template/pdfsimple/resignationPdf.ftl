<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>离职申请单</title>  
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
          <b>员工【${staffName}】离职申请单</b>
   </div>
   <div style="height:15px;font-size:14px;"></div>
   <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
    	<tr>
          <td width="15%" align="left">姓名:${staffName}</td>
          <td width="15%" align="left">入职时间:<@formatdate date=employedDate/></td>
          <td width="15%" align="left">单位:${orgnizationName}</td>
        </tr>
         <tr>
          <td  align="left">中心:${centerName}</td>
          <td  align="left" >部门:${departmentName}</td>
          <td  align="left" >岗位:${posName}</td>
        </tr>
         <tr>
          <td  align="left">行政级别:${posLevelTextView?default("")?html}</td>
          <td  align="left" >性别:${sexTextView?default("")?html}</td>
          <td  align="left" >学历:${educationTextView?default("")?html}</td>
        </tr>
         <tr>
          <td  align="left">离职类型:${resignationTypeTextView?default("")?html}</td>
          <td  align="left" >考勤预计截止日期:<@formatdate date=attendanceDeadlineDate/></td>
          <td  align="left" >系统账号注销时间:<@formatdate date=accountDeadlineDate/></td>
        </tr>
        <tr>
         <td  align="left"  colspan="3"  rowspan="3">离职原因:${resignationReason}</td>
        </tr>
   </table>
   <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   