brcmenu.swf 对应函数

addCallback("clear",function():void
{
main.removeAllChildren();
});
//添加一个按钮
addCallback("addButton",function(c:Object):void
{
main.addButton(c);
});
//添加一个折线点
addCallback("addFoldPoint",function(c:Object):void
{
main.addFoldPoint(c);
});
//是否显示折线点
addCallback("showFoldPoint",function(b:Boolean):void
{
main.showFoldPoint(b);
});
//获取图像对应的json对象
addCallback("getJsonInfo",function():Object
{
return main.getJsonInfo();
});
//从外表载入一个json对象
addCallback("setJsonInfo",function(c:Object):void
{
return main.setJsonInfo(c);
});
//设置连线的类型，standard,dashed,bold
addCallback("setLineType",function(t:String):void
{
return main.setLineType(t);
});
//删除选中的图像
addCallback("delSelected",function(t:String):void
{
return main.delSelected();
});
//选中图像横向对齐
addCallback("horizSelected",function(t:String):void
{
return main.horizSelected();
});
//选中图像纵向对齐
addCallback("verticalSelected",function(t:String):void
{
return main.verticalSelected();
});
//设置是否允许拖动
addCallback("setDragEnable",function(b:Boolean):void
{
return main.setDragEnable(b);
});
//获取选中节点信息
addCallback("getSelecteds",function():Array
{
return main.getSelecteds();
});
//更新节点信息
addCallback("updateButton",function(d:Object):void
{
main.updateButton(d);
});
//获取图像大小
addCallback("getImgSize",function():Object
{
return main.getImgSize()
});


//例子

var flash = document.getElementById('brcmenu');
flash.setJsonInfo({
buttons: [{
id: '1000',x: 156,y: 316,text:'test 1000'
},{
id: '1001',x: 136,y: 196,text:'test 1001'
},{
id: '1002',x: 300,y: 210,text: 'disable',disabled: true
}],
folds: [],
lines: [{from:'1000',to:'1001',type: 'standard'}]
});


//按钮的属性默认值，这些值都是可以改的
_default = {
				color: "#000000",
				border_color: "#fef9e3",
				eclipse: 4,
				width: 142,
				height: 42,
				font_size: "14px",
				disabled: false,
				text:""
			}
