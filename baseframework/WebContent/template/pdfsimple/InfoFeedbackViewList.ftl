<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
        <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    border-bottom: 1px solid #000000;
            }
            
            table.print{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 3px solid #000000;border-top: 2px solid #000000;border-right: 2px solid #000000;
               background:#c6d9f1;
            }
            
            table.print tr{  
               height: 40px;text-align: left;
            } 
                        
            table.print td{
               border-right: 1px solid #000000;height:25px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word;
            }
            table.print td.center{
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table.print td.left{
            	text-align: left;
            }
            @page {   
            	size:  420mm ;
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
  <div style="page-break-after:always"> 
  	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>   
            <td class="center"><b>反馈人</b></td>  
            <td class="center"><b>反馈内容</b></td>  
            <td class="center"><b>反馈时间</b></td>
            <#if feedBackItems?? && feedBackItems?size gt 0>
            <#list feedBackItems as item>
             <td class="center"><b>${item.itemName}</b></td>
            </#list>
            </#if>
         </tr>
		<#if feedBackDatas?? && feedBackDatas?size gt 0> 
		<#list feedBackDatas as data>
			<tr style="background:#ffffff;">
				<td>${data.personName}</td>
				<td>${data.content}</td>
				<td><@formatdate date=data.feedbackTime/></td>
				<#if feedBackItems?? && feedBackItems?size gt 0>
	            <#list feedBackItems as item>
	             <td><b>${data['f'+(item_index?if_exists+1)]}</b></td>
	            </#list>
	            </#if>
			</tr> 
		</#list>
		</#if>
      </table>
   </div> 
</body>  
</html>   