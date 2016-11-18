$(document).ready(function () {
	$("#chartContainer").insertFusionCharts({
		swfUrl: "./biz/demo/MSColumn3D.swf",
		width: "400",
		height: "300",
		id: "myChartId",

		dataFormat: "json",
		dataSource: {
			"chart": {
				"caption": "Sales Comparison by Country",
				"showlabels": "1",
				"showvalues": "0",
				"decimals": "0",
				"numberprefix": "$",
				"palettecolors": "#AFD8F8,#F6BD0F,#8BBA00"
			},
			"categories": [
				{
					"category": [
						{
							"label": "Austria"
						},
						{
							"label": "Brazil"
						},
						{
							"label": "France"
						},
						{
							"label": "Germany"
						},
						{
							"label": "USA"
						}
					]
				}
			],
			"dataset": [
				{
					"seriesname": "2011",
					"data": [
						{
							"value": "25601.34"
						},
						{
							"value": "20148.82"
						},
						{
							"value": "17372.76"
						},
						{
							"value": "35407.15"
						},
						{
							"value": "38105.68"
						}
					]
				},
				{
					"seriesname": "2012",
					"data": [
						{
							"value": "57401.85"
						},
						{
							"value": "41941.19"
						},
						{
							"value": "45263.37"
						},
						{
							"value": "117320.16"
						},
						{
							"value": "114845.27"
						}
					]
				},
				{
					"seriesname": "2013",
					"data": [
						{
							"value": "45000.65"
						},
						{
							"value": "44835.76"
						},
						{
							"value": "18722.18"
						},
						{
							"value": "77557.31"
						},
						{
							"value": "92633.68"
						}
					]
				}
			]
		}
	});
});