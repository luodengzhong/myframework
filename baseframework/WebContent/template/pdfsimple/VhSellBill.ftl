<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>车辆出让单</title>  
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
          <h3>车&nbsp;辆&nbsp;出&nbsp;让</h3>
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
            <td class="center">单位 </td>  
            <td class="center">元</td>  
         </tr>  
         <tr>  
            <td class="center">经办中心</td>  
            <td class="left">${centerName}</td>  
            <td class="center">经办人</td>  
            <td class="left">${personMemberName}</td>  
         </tr>
         <tr>  
            <td class="center">原值总金额(元)</td>  
            <td class="left">${totalAmount}</td>  
            <td class="center">出让总金额(元)</td>  
            <td class="left">${amount}</td>  
         </tr>
         <tr>  
            <td class="center">出让原因</td>  
            <td colspan="3" class="left">${reason?html}</td>  
         </tr>
         <tr>  
            <td class="center">备注</td>  
            <td colspan="3" class="left">${remark?html}</td>  
         </tr>
      </table>
      
      <br/>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>出让车辆清单</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
      		<td class="center" style="width:30px;"><b>序号</b></td>  
            <td class="center" style="width:60px;"><b>资产编号</b></td>  
            <td class="center" style="width:30px;"><b>车牌号</b></td>
            <td class="center" style="width:50px;"><b>出让金额(元)</b></td>
            <td class="center" style="width:50px;"><b>所属单位</b></td>
            <td class="center" style="width:50px;"><b>使用单位</b></td>
            <td class="center" style="width:50px;"><b>购车时间</b></td>
            <td class="center" style="width:50px;"><b>购车价(元)</b></td>
            <td class="center" style="width:50px;"><b>卡片号</b></td>
            <td class="center" style="width:50px;"><b>现行驶公里数</b></td>
            <td class="center" style="width:50px;"><b>备注</b></td>
         </tr>
        <#if vhSellDetail?? && vhSellDetail?size gt 0> 
		<#list vhSellDetail as detail>
			<tr >
				<td class="center">${detail_index?if_exists+1}</td>
				<td class="center">${detail.assetName?html}</td>
				<td class="center">${detail.plate}</td>
				<td class="center">${detail.sellAmount}</td>
				<td class="center">${detail.ownerOrganName}</td>
				<td class="center">${detail.useOrganName}</td>
				<td class="center"><@formatdate date=detail.purchaseDate/></td>
				<td class="center">${detail.totalPrice}</td>
				<td class="center">${detail.cardNumber}</td>
				<td class="center">${detail.mileCount}</td>
				<td class="center">${detail.remark}</td>
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
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   