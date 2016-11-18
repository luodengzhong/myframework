<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>验收单</title>  
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
               word-break: break-all;word-wrap: break-word;
            }
            table.print td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
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
                word-break:break-all;
			    border: 1px solid #000000;
			    border-width: 1px 0 0 1px;
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
          <h3>验&nbsp;收&nbsp;单</h3>
      </div>
      <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				制单日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				经办人：<strong>${organName}.${deptName}.${personMemberName}</strong>
			</span>
      </div>
      <br></br>
      
      <table cellspacing="0px" cellpadding="0px" class="print"> 
      	 <tr>  
            <td class="center">文件编号</td>  
            <td class="left">${dispatchNo}</td>  
            <td class="center">单位</td>  
            <td class="center">元</td>  
         </tr>  
         <tr>  
            <td class="center">验收公司</td>  
            <td class="left">${organName}</td>  
            <td class="center">验收人</td>  
            <td class="left">${personMemberName}</td>  
         </tr>  
         <tr>  
         	<td class="center">验收业务类型</td>  
            <td class="left">${acceptanceBizTypeTextView?default("")?html}</td>  
            <td class="center">关键字</td>  
            <td class="left">${keyword?html}</td>   
         </tr>  
         <tr>  
            <td class="center">业务单号</td>  
            <td class="left">${bizBillCode}</td>  
            <td class="center">到货日期</td>  
            <td class="left"><@formatdate date=arrialDate/></td>  
         </tr>
         <tr>  
            <td class="center">金额(元)</td>  
            <td class="left">${amount}</td>  
            <td class="center">是否入库</td>  
            <td class="left">${yesornoTextView?default("")?html}</td>  
         </tr>
         <tr>  
            <td class="center">备注</td>  
            <td colspan="3" class="left">${remark?html}</td>  
         </tr>
      </table>
      
      <br/>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>验收详情</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:30px;"><b>序号</b></td> 
            <td class="center" style="width:50px;"><b>资产编号</b></td>  
            <td class="center" style="width:60px;"><b>所属公司</b></td>
            <td class="center" style="width:50px;"><b>使用公司</b></td>
            <td class="center" style="width:50px;"><b>使用中心</b></td>
            <td class="center" style="width:50px;"><b>资产名称</b></td>
            <td class="center" style="width:50px;"><b>资产类别</b></td>
            <td class="center" style="width:50px;"><b>物资类别</b></td>
            <#--
            <td class="center" style="width:60px;"><b>品牌</b></td>
            <td class="center" style="width:60px;"><b>规格\型号</b></td>
            -->
            <td class="center" style="width:30px;"><b>单位</b></td>
            <td class="center" style="width:30px;"><b>数量</b></td>
            <td class="center" style="width:50px;"><b>单价</b></td>
            <td class="center" style="width:50px;"><b>金额</b></td>
         </tr>
        <#if acceptanceDetail?? && acceptanceDetail?size gt 0> 
		<#list acceptanceDetail as acceptance>
			<tr >
				<td class="center">${acceptance_index?if_exists+1}</td>
				<td class="center">${acceptance.assetCode}</td>
				<td class="center">${acceptance.companyName}</td>
				<td class="center">${acceptance.useOrganName}</td>
				<td class="center">${acceptance.useCenterName}</td>
				<td class="center">${acceptance.assetName?html}</td>
				<td class="center">${acceptance.assetTypeDicTextView?default("")?html}</td>
				<td class="center">${acceptance.materialName}</td>
				<#--
				<td class="center">${acceptance.brand?html}</td>
				<td class="center">${acceptance.specification?html}</td>
				-->
				<td class="center">${acceptance.unitTextView?default("")?html}</td>
				<td class="center">${acceptance.quantity}</td>
				<td class="center">${acceptance.price}</td>
				<td class="center">${acceptance.totalPrice}</td>
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
				<#--
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				-->
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <br/>
      
	<div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>入库详情</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:30px;"><b>序号</b></td> 
            <td class="center" style="width:50px;"><b>资产编号</b></td>  
            <td class="center" style="width:50px;"><b>资产名称</b></td>
            <td class="center" style="width:50px;"><b>物资类别</b></td>
            <td class="center" style="width:100px;"><b>品牌</b></td>
            <td class="center" style="width:100px;"><b>规格\型号</b></td>
            <td class="center" style="width:30px;"><b>数量</b></td>
            <td class="center" style="width:50px;"><b>送缴数量</b></td>
            <td class="center" style="width:30px;"><b>单位</b></td>
            <td class="center" style="width:50px;"><b>单价</b></td>
            <td class="center" style="width:50px;"><b>金额</b></td>
         </tr>
        <#if inStockDetail?? && inStockDetail?size gt 0> 
		<#list inStockDetail as inStock>
			<tr >
				<td class="center">${inStock_index?if_exists+1}</td>
				<td class="center">${inStock.assetCode}</td>
				<td class="center">${inStock.assetName?html}</td>
				<td class="center">${inStock.materialName}</td>
				<td class="center">${inStock.brand?html}</td>
				<td class="center">${inStock.specification?html}</td>
				<td class="center">${inStock.quantity}</td>
				<td class="center">${inStock.sendQuantity}</td>
				<td class="center">${inStock.unitTextView?default("")?html}</td>
				<td class="center">${inStock.price}</td>
				<td class="center">${inStock.amount}</td>
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
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <br/>
      
          <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>出库详情</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:30px;"><b>序号</b></td> 
      		<td class="center" style="width:50px;"><b>资产编号</b></td>  
            <td class="center" style="width:50px;"><b>使用人</b></td>  
            <td class="center" style="width:50px;"><b>物资类别</b></td>
            <td class="center" style="width:100px;"><b>品牌</b></td>
            <td class="center" style="width:100px;"><b>规格\型号</b></td>
            <td class="center" style="width:30px;"><b>数量</b></td>
            <td class="center" style="width:30px;"><b>单位</b></td>
            <td class="center" style="width:50px;"><b>单价</b></td>
            <td class="center" style="width:50px;"><b>金额</b></td>
         </tr>
        <#if outStockDetail?? && outStockDetail?size gt 0> 
		<#list outStockDetail as outStock>
			<tr >
				<td class="center">${outStock_index?if_exists+1}</td>
				<td class="center">${outStock.assetCode}</td>
				<td class="center">${outStock.recipientName}</td>
				<td class="center">${outStock.materialName}</td>
				<td class="center">${outStock.brand?html}</td>
				<td class="center">${outStock.specification?html}</td>
				<td class="center">${outStock.quantity}</td>
				<td class="center">${outStock.unitTextView?default("")?html}</td>
				<td class="center">${outStock.price}</td>
				<td class="center">${outStock.amount}</td>
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