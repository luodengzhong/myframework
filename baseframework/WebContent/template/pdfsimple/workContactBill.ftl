<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>工联单</title>  
        <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    border-bottom: 1px solid #000000;
            }
            
            table.print{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
            }
            
            table.print tr{  
               height: 55px;text-align: left;
            } 
                        
            table.print td{
               border-right: 1px solid #000000;height:25px;border-bottom: 1px solid #000000;
               word-break:break-strict;word-wrap: break-word;
            }
            table.print td.center{
                width:100px;
            	text-align: center;
            	word-break:break-strict;word-wrap: break-word;
            }
            table.print td.left{
                width:200px;
            	text-align: left;
            	padding-left:20px;
            }
            table.tableInput{
				font-size:9pt;
				width:100%;
				table-layout:fixed;
				word-wrap:break-word; 
                word-break:break-strict;
			    border: 1px solid #000000;
			    border-width: 1px 0 0 1px;
			}
			
			table.tableInput td{
				border: 1px solid #000000;
			    border-width: 0 1px 1px 0;
			    height:auto;
			    min-height:25px;
			    vertical-align:middle;
				word-break:break-strict;
				word-wrap:break-word;
			}
			table.tableInput td div.textLabel{
				padding-left:5px;
			}
            @page {    
              size:  210mm 297mm;
              @bottom-right {  
                    content: "KJ-A04-01[A/0版]";  
              } 
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
      <div align="center" style="font-weight:bold;font-size:20px;">  
          <h3>工&nbsp;联&nbsp;单</h3>
      </div>
      
      <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				制单日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				发起人：<strong>${organName}.${deptName}.${personName}</strong>
			</span>
      </div>
      <br></br>
      <table cellspacing="0" cellpadding="0" class="print">
      	 <tr>  
            <td class="center" style="width:60px;">标题</td>  
            <td colspan="5" class="left" style="width:60px;">${title?default("")?html}</td>  
         </tr>
         <tr>  
            <td class="center">发起部门</td>  
            <td class="left">${deptName}</td>  
            <td class="center">发起人</td>  
            <td class="left">${personName}</td>  
            <td class="center">审核状态</td>  
            <td class="left">${statusTextView?default("")?html}</td>  
         </tr>
         <tr>  
            <td class="center"  style="width:60px;">公司名称</td>  
            <td class="left"  style="width:60px;">${organName}</td>  
            <td class="center"  style="width:60px;">单据号码</td>  
            <td class="left"  style="width:100px;">${billCode}</td>  
            <td class="center"  style="width:60px;">填表日期</td>  
            <td class="left"  style="width:60px;">${fillinDate}</td> 
         </tr>  
         <tr>  
            <td class="center">预估工作量</td>  
            <td class="left">${expectLoadTextView?default("")?html}</td>  
            <td class="center">完成时间</td>  
            <td class="left">${expectDate?default("")?html}</td>   
            <td class="center"></td>  
            <td class="left"></td>  
         </tr>
         <tr>  
            <td class="center">备注信息</td>  
            <td colspan="5" class="left">${remark?default("")?html}</td>  
         </tr>
          <tr>  
            <td colspan="6" class="left">联系事项</td>  
         </tr>
         <tr>  
      		<td class="center"	>序号</td>  
      		<td class="center">联系部门</td>  
            <td class="center">全路径</td>  
            <td class="center">对接人</td>
            <td class="center"  colspan="2"  >事项描述</td>
         </tr>
         <#if workContactDetail?? && workContactDetail?size gt 0> 
		<#list workContactDetail as workContact>
			<tr >
				<td class="center">${workContact_index?if_exists+1}</td>
				<td class="center"  style="word-break:break-strict;white-space:pre-wrap" >${workContact.deptName}</td>
				<td class="center"  style="word-break:break-strict;white-space:pre-wrap" >${workContact.fullName?html}</td>
				<td class="center"  style="word-break:break-strict;white-space:pre-wrap" >${workContact.personName?html}</td>
				<td class="center"  colspan="2"   style="word-break:break-strict;white-space:pre-wrap" >${workContact.description?html}</td>
			</tr> 
		</#list>
		<#else>
			<tr>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center"  colspan="2"  >&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <br></br> 
      <br/>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   