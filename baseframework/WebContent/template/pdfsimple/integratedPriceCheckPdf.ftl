<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>综合单价认价</title>  
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
          <b>综合单价认价</b>
   </div>
   <div style="height:15px;font-size:14px;"></div>
   <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
    	<tr>
          <td  width="33%"  align="left">机构名称:${organName}</td>
          <td   width="33%" align="left">部门名称:${deptName}</td>
          <td  width="33%" align="left" >岗位名称:${positionName}</td>
        </tr>
    	<tr>
    	   <td  align="left" >申请人:${personMemberName}</td>
          <td align="left">填表日期:<@formatdate date=fillinDate/></td>
          <td align="left">单据号码:${billCode}</td>
        </tr>
         <tr>
          <td  align="left" colspan="2" >认价名称:${title}</td>
          <td  align="left" >对应变更业务:${name}</td>
         </tr>
         <tr>
          <td  align="left" colspan="3" rowspan="4">备注:${remark}</td>
        </tr>
   </table>
    <br/>
   <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>认价明细</b>
   </div>
   <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="center" style="width:20%;"><b>认价项目名称</b></td>  
            <td class="center" style="width:20%;"><b>项目特征</b></td>  
            <td class="center" style="width:20%;"><b>工程内容</b></td>
            <td class="center" style="width:8%;"><b>单位</b></td>
            <td class="center" style="width:11%;"><b>综合单价</b></td>
            <td class="center" style="width:10%;"><b>数量</b></td>
             <td class="center" style="width:11%;"><b>总价</b></td>
           
             
         </tr>
        <#if IntegratedPriceCheckDetas?? && IntegratedPriceCheckDetas?size gt 0> 
		<#list IntegratedPriceCheckDetas as IntegratedPriceCheckDeta>
			<tr >
				<td class="center">${IntegratedPriceCheckDeta.contractCommonInstName}</td>
				<td class="center">${IntegratedPriceCheckDeta.charac}</td>
				<td class="center">${IntegratedPriceCheckDeta.content}</td>
				<td class="center">${IntegratedPriceCheckDeta.unitName}</td>
			    <td class="center">${IntegratedPriceCheckDeta.complexPrice}</td>
				<td class="center">${IntegratedPriceCheckDeta.quantity}</td>
				<td class="center">${IntegratedPriceCheckDeta.amount}</td>
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
				
			</tr> 
		</#if>
      </table>
          <br/>
       <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>认价组成明细</b>
      </div>
       <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="center" style="width:20%;"><b>认价项目名称</b></td>  
            <td class="center" style="width:15%;"><b>费用组成项</b></td>  
            <td class="center" style="width:15%;"><b>产品名称</b></td>
            <td class="center" style="width:11%;"><b>规格型号</b></td>
            <td class="center" style="width:8%;"><b>单位</b></td>
            <td class="center" style="width:10%;"><b>数量</b></td>
            <td class="center" style="width:10%;"><b>单价</b></td>
             <td class="center" style="width:11%;"><b>合价</b></td>
           
             
         </tr>
        <#if IntegratedPriceCheckComps?? && IntegratedPriceCheckComps?size gt 0> 
		<#list IntegratedPriceCheckComps as IntegratedPriceCheckComp>
			<tr >
				<td class="center">${IntegratedPriceCheckComp.contractCommonInstName}</td>
				<td class="center">${IntegratedPriceCheckComp.compKindTextView}</td>
				<td class="center">${IntegratedPriceCheckComp.fieldName}</td>
				<td class="center">${IntegratedPriceCheckComp.specification}</td>
				<td class="center">${IntegratedPriceCheckComp.unitName}</td>
				<td class="center">${IntegratedPriceCheckComp.quantity}</td>
				<td class="center">${IntegratedPriceCheckComp.price}</td>
				<td class="center">${IntegratedPriceCheckComp.amount}</td>
				
				
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
				
			</tr> 
		</#if>
      </table>
      
      <br/>
      <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   