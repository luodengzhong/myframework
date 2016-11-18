<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>请示报告单</title>  
   <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            .brcImg{
			    border-bottom: 1px solid #000000;
            }
            table{
               width:100%;table-layout:fixed; word-break:break-strict;
               border:0px;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
            }
           
            table tr{  
               text-align: left;
            } 
                        
            table td{
               border-right: 1px solid #000000;height:35px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word; 
               padding-left:5px;
           }
           table.tableInput td{
				border: 1px solid #000000;
			    border-width: 0 1px 1px 0;
			    height:auto;
			    min-height:25px;
			    vertical-align:middle;
				word-break:break-all;
				word-wrap:break-word;
			}
			table.tableInput td div.textLabel{
				padding-left:5px;
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
  <div>
	<div align="center" style="font-weight:bold;font-size:30px;">${subject}</div>
    <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				制单日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				发送人：<strong>${organName}.${deptName}.${personMemberName}</strong>
			</span>
     </div>
     <br></br>
     <table cellspacing="0" cellpadding="0"> 
         <tr>  
         	<td width='34%'>文件编号:${dispatchNo?default("&nbsp;")}</td>
            <td width='33%'>主送:${reportToName?default("&nbsp;")}</td>
            <td width='33%'>责任人:${personInChargeName}</td>
         </tr>  
      </table>
      </br>
     <div style="margin-top:3px;">
     	<#include "/simple/extendedField.ftl" />   
 	</div>
 	</br>
 	<div style="width:98%;margin-top:3px;">
 	  ${askContent?default("")}
 	</div>
 	<div style="margin-top:3px;">&nbsp;</div>
 	<#include "/simple/taskExecutionList.ftl" /> 
 </div>
</body>  
</html>   