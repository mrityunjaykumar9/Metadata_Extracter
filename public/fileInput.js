var input = document.querySelector( '#fileInput' );
var label	 = input.nextElementSibling,
labelVal = label.innerHTML;

input.addEventListener( 'change', function( e )
{
	var fileName = e.target.value.split( '\\' ).pop();
	if(fileName)
		label.querySelector( 'span' ).innerHTML = fileName;
	else
		label.innerHTML = labelVal;
});

window.onload = function() {
    document.getElementById('fileLink').value = ''; // Clear the input field
	document.getElementById('uploadedFile').value = ''; // Clear the input file field
};
