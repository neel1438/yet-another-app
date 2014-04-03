
$(document).ready(function(){


		$('#changepasswd-form').validate({
	    rules: {
	      password: {
	      	minlength: 6,
	        required: true
	      },
	     cpassword: {
	      	minlength : 6,
		required : true,
		equalTo : "#password"
	      }
	     },
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
				
			},
			success: function(element) {
				element
				.text('OK!').addClass('valid')
				.closest('.form-group').removeClass('has-error').addClass('has-success');
			}
	  });

}); // end 
