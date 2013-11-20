var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = $(document).width()- margin.left - margin.right,
    height = $(document).height()*0.4 - margin.top - margin.bottom;
    
$( ".qftrend" ).click(function() {
  getPanel(this.id);
});
function getPanel(name) {
	$.get("http://localhost:1337/htrend/"+name+".html", function (data) {
   		$("#container").html(data);
   		$("#hlabel").html("<h2 style='margin: 0 auto; text-align: center;'>Quality Factors Trend of 중앙대학교</h2>");
   		//$("#hlabel").html("<a href='#' data-role='button' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' data-theme='c' class='ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-up-c'><span class='ui-btn-inner'><span class='ui-btn-text'>중앙대학교</span></span></a>");
	});
}