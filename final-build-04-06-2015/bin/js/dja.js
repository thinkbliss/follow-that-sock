$.fn.goTo = function (anchor) {
	location.href = "#" + this.selector;
}

function openRegister() {
    $("registerMe").goTo();
}

/* iframe resize
    Usage : postSize(event) when the parent window resize.
*/
function postSize(e) {
    var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined); 
    if (typeof target != "undefined") {
        target.postMessage($("body").outerHeight(), "*");
        //target.postMessage('{"action": "scroll"}', "*"); 
    } 
    if (window.addEventListener) {
        window.addEventListener("load", postSize, false);
        window.addEventListener("resize", postSize, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload", postSize, false);
        window.attachEvent("onresize", postSize, false);
    }
}

$(function() {
    /*------------------ Load and initialize iframe.js ---------------------------*/
    var ifrmscript = document.createElement('script');
    ifrmscript.src = "bin/js/iframe.js";
    document.head.appendChild(ifrmscript);

    /*------------------ front-end form validation ----------------*/

    var has_error_class = "not-valid";
    var has_no_error_class = "is-valid";

    var resetForm = function(hForm) {
        // Reset form
        hForm[0].reset();

        // Remove classes from input controls
        var inputcollection = $(hForm).find(".dja-validate");
        inputcollection.each( function(index, element){
            $(element).removeClass(has_error_class);
            $(element).removeClass(has_no_error_class);
        });

    };

    var verifier = function(input_element) {
    	// Makes sure input is filled out

    	if ($(input_element).val() == "" || $(input_element).val() == "dja-null") return false;

        if ($(input_element).prop("type") == "checkbox") {
            if ($(input_element).is(":checked")) {
                // add default value as 'yes' when checked.
                $(input_element).val("yes");
                return result = true;
            }else {
                // add default value as 'no' when checked.
                $(input_element).val("no");
                return result = false;
            }
        }

    	var result = false;
    	var validateThisVal = $(input_element).val();
    	var re = null;

    	switch ($(input_element).attr("name")) {
    		case "dja-fname":
    		case "dja-lname": {
    			//console.log("first name logged");
    			re = /^[-'a-zA-ZÀ-ÖØ-öø-ſ ]+$/;
    			break;
    		}
    		case "dja-addr1": {
    			re = /^[0-9]+\s+([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+)$/;
    			break;
    		}
    		case "dja-email": {
    			re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    			break;
    		}
    		case "dja-city": {
    			re = /^[-.'a-zA-Z\s]{3,}$/;
    			break;
    		}
    		case "dja-state": {
    			re = /^[a-zA-Z]{2}$/;
    			break;
    		}
    		case "dja-zip": {
    			re = /^\d{5}(-\d{4})?$/;
    			break;
    		}
    		case "dja-pass": {
    			re = /^[a-zA-Z0-9]{5,15}$/;
    			break;
    		}
    		case "dja-confimpass": {
    			f = $(input_element).closest("form");
    			v = $(f).find('input[name="dja-pass"]').eq(0).val();
    			//console.log(v);
    			re = new RegExp("^"+v+"$");
    			break;
    		}
    		default: {
    			re = /^(?!\s*$).+$/; /// Accept anything but empty string
    		}
    	}

    	if (re && validateThisVal.match(re)) {
			result = true;
		}else {
			result = false;
		}

    	return result;
    }

    var highlightError = function(input_elem, bool){
         switch($(input_elem).prop("type")) {
            case "checkbox": {
                    var checkbox_id = $(input_elem).prop("id");
                    if (!checkbox_id) return;
                    var previousLabels = $(input_elem).prevAll('label[for="'+checkbox_id+'"]');
                    var nextLabels = $(input_elem).nextAll('label[for="'+checkbox_id+'"]');

                    var closet_label = null;

                    // if either or both lengths are zero, then one or both don't have matches. In that case select the first match of nonempty array.
                    if (previousLabels.length == 0 || nextLabels.length == 0) {
                        closet_label = (previousLabels.length != nextLabels.length) ? ((previousLabels.length>0)?$(previousLabels).eq(0):$(nextLabels).eq(0)) : null;
                    }
                    else {
                        // Check if the closest matched label in down or after. Else then its up or before. Less value means closer.
                        closet_label = (previousLabels.length>0)?$(nextLabels).eq(0):$(previousLabels).eq(0);
                    }

                    if (!closet_label) return;

                    if (bool) {
                        $(closet_label).addClass(has_error_class);
                        $(closet_label).removeClass(has_no_error_class);
                    }else {
                        $(closet_label).addClass(has_no_error_class);
                        $(closet_label).removeClass(has_error_class);
                    }
                break;
            }
            default : {
                if (bool) {
                    $(input_elem).addClass(has_error_class);
                    $(input_elem).removeClass(has_no_error_class);
                }else {
                    $(input_elem).addClass(has_no_error_class);
                    $(input_elem).removeClass(has_error_class);
                }
            }
         }
    }

    /// Validation on Dirty (if value of an input control is altered and lost focus)
    $(".dja-validate").focusout(function(e) {
    //console.log($(elem).attr("name"));
    	if (verifier(this)) { // If verifier returns true, then its a pass
            highlightError(this, false);
        } else {
            highlightError(this, true);
        }

    });

    var formValidator = function(hForm){

    	//var validateForm = $('#registerMe > form.validate-form');
        if (!hForm) {
            throw "Validation form is null";
        }

    	var formerrors = {
			    		hasErrors : false,
			    		errorFields: []
			    	};

      	// Gets all forms to validate
      	hForm.each( function(){
	        var validateForm = $(this);
	        var inputcollection = $(this).find(".dja-validate");

	        inputcollection.each( function(index, element){
	        	if (verifier(element)) {
                        highlightError(this, false);
			      } else {
                        highlightError(this, true);
			        	formerrors.hasErrors = true;
			        	formerrors.errorFields.push($(element).attr("name"));
			      }
	        });
      });
		return formerrors;
    };

	var handleRegistrationError = function (hForm, data) {
        if (!hForm || !data) {
                throw "Validation or error data form is missing";
            }

        hForm.each( function(){
            switch (data.error_code) {
                case 1  : {
                    //messageOverlay("Sorry. The server has encountered an error and couldn't compelte your request.");
                    alert("Sorry. The server has encountered an error and couldn't compelte your request.");
                }
                case 11 : {
                    for (var i = 0; i < data.error_fields.length; i++) {
                        $(this).find('input[name="'+ data.error_fields[i] +'"]').eq(0).addClass(has_error_class).removeClass(has_no_error_class);
                    }
                    break;
                }
                case 12 : {
                    //window.location.href = "noteligible.php";
                    alert("Sorry. You are not eligible.");
                    break;
                }
                case 13 : {
                    //messageOverlay("This email is already registered.");
                    alert("This email is already registered.");
                    break;
                }
            }
        });
			
	};

	$("a.dja-submitbtn1").on("click", function(e){
		e.preventDefault();

		var regform = $("#dja-regform");
		var result = formValidator(regform);

        console.log("Form validation errors below:");
        console.log(result);

    	if (!result.hasErrors) {
    		$(regform).serialize();

    		$.post("https://disneyhanesfollowthatsock2.rev2.dja.com/php/ajax/register.php", //Send data to our end point
				$(regform).serialize(), 
				function(json_reply){ // handle response
                    var response = JSON.parse(json_reply);
					$("close").goTo();
                    resetForm(regform);
					if (response.status == "success"){
						$('.signedOut').fadeOut();
        				$('.vertical.flip-container').fadeIn(1000);
					}else if (response.status == "error") {
                    	handleRegistrationError(regform, response.data);
                	}
					//console.log(reponse);
			});
    	}
        /*$('.signedOut').fadeOut();
        $('.vertical.flip-container').fadeIn(1000);
        */
    });

    var handleLoginError = function (hForm, data) {

        if (!hForm || !data) {
            throw "Validation or error data form is missing";
        }

        hForm.each( function(){
            switch (data.error_code) {
                case 1  : {
                    //messageOverlay("Sorry. The server has encountered an error and couldn't compelte your request.");
                    alert("Sorry. The server has encountered an error and couldn't compelte your request.");
                }
                case 31 : {
                    for (var i = 0; i < data.error_fields.length; i++) {
                        $(this).find('input[name="'+ data.error_fields[i] +'"]').eq(0).addClass(has_error_class).removeClass(has_no_error_class);
                    }
                    break;
                }
                case 32 : {
                    alert("Email Id is not available. Please register");
                    break;
                }
                case 33 : {
                    alert("Email password combination does not match");
                    break;
                }
            }
        });
            
    };

    $("a.dja-submitbtn2").on("click", function(e){
		e.preventDefault();

		var signinform = $("#dja-signInForm");
		var result = formValidator(signinform);

        console.log("Form validation errors:");
		console.log(result);

    	if (!result.hasErrors) {
    		$(signinform).serialize();

    		$.post("https://disneyhanesfollowthatsock2.rev2.dja.com/php/ajax/login.php", //Send data to our end point
				$(signinform).serialize(),
				function(json_reply){ // handle response
                    var response = JSON.parse(json_reply);
                    resetForm(signinform);
                    $("close").goTo();
                    if (response.status == "success"){
                        $('.signedOut').fadeOut();
                        $('.vertical.flip-container').fadeIn(1000);
                    }else if (response.status == "error") {
                        handleLoginError(signinform, response.data);
                    }
			});
    	}
        /*$('.signedOut').fadeOut();
        $('.vertical.flip-container').fadeIn(1000);
        */
    });

    $("a.dja-register").on("click", function(e){
        e.preventDefault();
        var regform = $("#dja-regform");
        // Reset register form before display
        resetForm(regform);
        $("registerMe").goTo();
    });

    $("a.dja-signin").on("click", function(e){
        e.preventDefault();
        var signinform = $("#dja-signInForm");
        // Reset register form before display
        resetForm(signinform);
        $("signIn").goTo();
    });
    
    /*$('a.registerSubmit, a.signinSubmit').on('click', function(e){
        /*$('.signedOut').fadeOut();
        $('.vertical.flip-container').fadeIn(1000);
        e.preventDefault();*/
    //});
})