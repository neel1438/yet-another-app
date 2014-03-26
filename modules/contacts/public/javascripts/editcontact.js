
$(document).ready(function(){


		$('#addcontactform').validate({
	    rules: {
	      name: {
	        minlength: 2,
	        required: true
	      },
	      email: {
	        required: true,
	        email: true
	      },
	      phone: {
	      	minlength: 10,
		maxlength : 10,
		digits :true,
	        required: true
	      },
	      place: {
	      	minlength : 2,
		required : true
		
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
