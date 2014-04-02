
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
		$('input[type=file]').change(function(e){
  			filename=$(this).val();
  			console.log(filename);
  			extenstion=filename.split(".");
  			while(extenstion.length!=1)
  			{
  				extenstion.shift();
  			}
  			extenstion=extenstion.toString();
  			console.log(extenstion);
  			if(extenstion ==="jpg" || extenstion === "png" || extenstion ==="gif" || extenstion === "JPG" || extenstion=== "PNG" || extenstion==="GIF")
  			{
  				$(this).text('OK!').addClass('valid')
  				.closest('.form-group').removeClass('has-error').addClass('has-success');
  					   
  			}
  			else
  			{
  				$(this).closest('.form-group').removeClass('has-success').addClass('has-error');
  			}

  		});

}); 


// end 
