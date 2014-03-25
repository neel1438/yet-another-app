
$(document).ready(function(){


		$('#signup-form').validate({
	    rules: {
	      name: {
	        minlength: 2,
	        required: true
	      },
	      email: {
	        required: true,
	        email: true
	      },
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
