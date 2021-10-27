// odoo.define('website_qa.website_qa', function (require)
// {
// 	$('btnpostqns').onclick(function(){
// 		console.log('222222222')
// 		alert("555555555")
// 		var $form = $(this).closest('form');
// 		var data = $(this).parents("#questionId");
// 			var p_uid = data.data('p_uid');
// 			var uid = data.data('uid');
		
// 		if(uid != p_uid)
// 		 {
// 			// $form.submit()
// 		 }
// 		else
// 			{
			
// 				$('#myModal').modal('show');
// 				return false;
// 			} 
			
		
// 	})

$(document).ready(function () {
$('#myForm').on('submit',function(e) {
    var data = $(this).parents("#questionId");
    var p_uid = data.data('p_uid');
    var uid = data.data('uid');
	if(uid != p_uid)
	 {
 		return true;	
	 }
	else
	  {
	    $('#myModal').modal('show');
	    return false;
	  } 
	
});

$(document).on('click', '#wk_cancel', function () {
    $("#wk_show_sigin").hide();
  });
});

 
