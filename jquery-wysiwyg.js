(function( $ ){
	"use strict";
	$.fn.wysiwyg = function( options ){
		var opts = $.extend( {}, $.fn.wysiwyg.defaults, options ), // read all the options
			textarea = this, // make the this variable also known as textarea
			iframe = $( "<iframe style='clear:both;display:block;' height='500px' name='richtext' id="+textarea[0].id+"richtext></iframe>" ); //build the iframe


		iframe.insertAfter( textarea ); // insert the iframe
		var idoc = iframe[0].contentDocument || iframe[0].contentWindow.document, // ie compatibility
			iwin = iframe[0].contentWindow,
		styles = "<style>"+ // the stylesheet for the markup
						".dropdown {position: relative;display: inline-block;width: 19.5px;}"+
						".dropdown-contents {display: none;position: absolute;background-color: #f9f9f9;min-width: 32px;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);padding: 12px 16px;}"+
						".dropdown:hover .dropdown-contents {display: block;}"+
						".color{width: 20px!important;height:20px!important;cursor:pointer;}"+
						"/* Modal full page box */"+
						".custommodal {display: none; position: fixed; z-index: 10; left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);}"+
						"/* Modal Content/Box */"+
						".modal-content {background-color: #fefefe;margin: 15% auto; padding: 20px;border: 1px solid #888;width: 80%; }"+
						"/* Modal close button */"+
						".close {color: #aaa;float: right;font-size: 28px;font-weight: bold;}"+
						".close:hover,.close:focus {color: black;text-decoration: none;cursor: pointer;}"+
						"img {resize:both;}"+
					"</style>";
		var codeInjection = "<div style='display:inline-block;min-width:100px;'>"+ // all the code we will inject
								styles;
		if ( opts.allowBasic ) { // check if the option is set to true
			codeInjection+=	"	<a data-command='bold' class='waves-effect waves-light btn'><i class='material-icons'>format_bold</i></a>"+
							"	<a data-command='italic' class='waves-effect waves-light btn'><i class='material-icons'>format_italic</i></a>"+
							"	<a data-command='underline' class='waves-effect waves-light btn'><i class='material-icons'>format_underline</i></a>"+
							"	<a data-command='strikeThrough' class='waves-effect waves-light btn'><i class='material-icons'>format_strikethrough</i></a>";
		}
		if ( opts.allowPositioning ) {
			codeInjection +="	<a data-command='justifyLeft' class='waves-effect waves-light btn'><i class='material-icons'>format_align_left</i></a>"+
							"	<a data-command='justifyCenter' class='waves-effect waves-light btn'><i class='material-icons'>format_align_center</i></a>"+
							"	<a data-command='justifyRight' class='waves-effect waves-light btn'><i class='material-icons'>format_align_right</i></a>"+
							"	<a data-command='justifyFull' class='waves-effect waves-light btn'><i class='material-icons'>format_align_justify</i></a>";
		}
		if ( opts.allowLists ) {
			codeInjection+=	"	<a data-command='insertUnorderedList' class='waves-effect waves-light btn'><i class='material-icons'>format_list_bulleted</i></a>"+
							"	<a data-command='insertOrderedlist' class='waves-effect waves-light btn'><i class='material-icons'>format_list_numbered</i></a>";
		}
		if ( opts.allowImages ) {
			codeInjection+=	"	<a data-modal='image' class='waves-effect waves-light btn'><i class='material-icons'>insert_photo</i></a>"+
							"	<div class='custommodal' id='image'>"+
							"		<div class='modal-content'>"+
							"			<span class='close'>x</span>"+
							"			<input type='text' placeholder='imagelink'>"+
							"			<p>Type an url to an image in the input above</p>"+
							"			<a data-command='insertImageCustom' class='waves-effect waves-light btn'>Insert image</a>"+
							"		</div>"+
							"	</div>";
		}
		if ( opts.allowLinks ) {
			codeInjection+=	"	<a data-modal='link' class='waves-effect waves-light btn'><i class='material-icons'>insert_link</i></a>"+
							"	<div class='custommodal' id='link'>"+
							"		<div class='modal-content'>"+
							"			<span class='close'>x</span>"+
							"			<input type='text' placeholder='sitename'>"+
							"			<p>Type the site name in the input above</p>"+
							"			<a data-command='createLink' class='waves-effect waves-light btn'>Insert link</a>"+
							"		</div>"+
							"	</div>";
		}
		if ( opts.allowColor ) {
			codeInjection+=	"	<a data-modal='fontSize' class='waves-effect waves-light btn'><i class='material-icons'>format_color_text</i></a>"+
							"	<div class='custommodal' id='fontSize'>"+
							"		<div class='modal-content'>"+
							"			<span class='close'>x</span>"+
							"			<input type='color'>"+
							"			<p>Chose text color</p>"+
							"			<a data-custom-command='fontColor' class='waves-effect waves-light btn'>font color</a>"+
							"		</div>"+
							"	</div>";
		}

		if ( opts.allowSize ) {
			codeInjection+=	"	<a data-modal='fontSize' class='waves-effect waves-light btn'><i class='material-icons'>format_size</i></a>"+
							"	<div class='custommodal' id='fontSize'>"+
							"		<div class='modal-content'>"+
							"			<span class='close'>x</span>"+
							"			<input type='text' placeholder='px size'>"+
							"			<p>Type the pixel size in the input above</p>"+
							"			<a data-custom-command='fontSize' class='waves-effect waves-light btn'>font size</a>"+
							"		</div>"+
							"	</div>";
		}
		if ( opts.allowTable ) {
			codeInjection+=	"	<a data-modal='insertTable' class='waves-effect waves-light btn'><i class='material-icons'>border_all</i></a>"+
							"	<div class='custommodal' id='inserTable'>"+
							"		<div class='modal-content'>"+
							"			<span class='close'>x</span>"+
							"			<input type='number' data-type='rows' placeholder='amount of rows'>"+
							"			<input type='number' data-type='cols' placeholder='amount of columns'>"+
							"			<p>Type the amount of columns and rows you want</p>"+
							"			<a data-custom-command='insertTable' class='waves-effect waves-light btn'>insert table</a>"+
							"		</div>"+
							"	</div>";
		}
		codeInjection += 	"	<a data-command='removeFormat' class='waves-effect waves-light btn'><i class='material-icons'>format_clear</i></a>"+
							"	<a data-command='showCode' class='waves-effect waves-light btn'><i class='material-icons'>code</i></a>"+
							"</div>";

		idoc.body.innerHTML = $( this ).val(); 	// Incase the textarea was pre-filled
		var buttons = $( codeInjection ); 		// Make the codeinjection into DOM
		buttons.insertBefore( textarea ); 		// Insert the buttons
		textarea.css('display','none'); 		// Set the textarea to be hidden
		idoc.designMode = "On";					// Make sure the iframe is editable
		iframe.css( "width", "100%" );			// Set the iframe width to the parent width


		// All the functionality for the clicking of buttons (seperated in 2 main groups: default commands (execCommand) and custom commands)
		$( textarea ).parent().on("click", "a", function(){
			if ( $( this ).attr( "data-command" ) !== undefined ) {
				if ( $( this ).attr( "data-command" ) === "insertImageCustom" ) {
					var image = $( this ).parent().find( "input" ).val();
					idoc.execCommand( $( this ).attr( "data-command" ).splice( -6 ), false, image );
					$( this ).parent().parent().css( "display","none" );
					$( this ).parent().find( "input" ).val( "" );
				} else if ( $(this).attr("data-command") === "createLink" ) {
					var site = $( this ).parent().find( "input" ).val();
					idoc.execCommand( $( this ).attr( "data-command" ), false, site );
					$( this ).parent().parent().css( "display","none" );
					$( this ).parent().find( "input" ).val( "" );
				} else if ( $(this).attr("data-command") === "insertImage" ) {
					idoc.execCommand( $( this ).attr( "data-command" ), false, $( this ).attr( "data-value" ) );
					$( this ).parent().parent().css( "display","none" );
					idoc.execCommand( "enableObjectResizing", true, true );
				} else if ( $(this).attr("data-command") === "showCode" ) {
					if(textarea.css('display') == 'none'){
						textarea.css('display','inline');
						$(iframe).css('display','none');
					} else {
						textarea.css('display','none');
						$(iframe).css('display','inline');
					}
					$( textarea ).val( idoc.body.innerHTML );

				}  else {
					idoc.execCommand( $( this ).attr( "data-command" ), false, $( this ).attr( "data-value" ) );
				}
				$( iframe ).focus();
				$( textarea ).val( idoc.body.innerHTML );
			} else if ( $( this ).attr( "data-custom-command" ) !== undefined ) {
				var selection = idoc.getSelection();
				if ( $( this ).attr( "data-custom-command" ) === "fontSize" ) {
					var size = $( this ).parent().find( "input" ).val(),
						range = selection.getRangeAt( 0 ),
						content = range.extractContents(),
						span = document.createElement( "SPAN" );
					span.appendChild( content );
					span.style.fontSize = size + "px";
					range.insertNode(span);
					$( this ).parent().parent().css( "display","none" );
					$( this ).parent().find( "input" ).val( "" );
				} else if ( $( this ).attr( "data-custom-command" ) === "insertTable" ) {
					var cols = $( this ).parent().find( "input[data-type=cols]" ).val();
					var rows = $( this ).parent().find( "input[data-type=rows]" ).val();
					var range = selection.getRangeAt( 0 ),
						content = range.extractContents(),
						table = document.createElement( 'TABLE' );
						table.style.border = "1px solid black";
						table.style.width = "200px";
						table.style.height = "200px";
					for ( var i = 0; i < rows; i++ ) {
						var tr = document.createElement( "TR" );
						table.appendChild( tr );
						for ( var j = 0; j < cols; j++ ) {
							var td = document.createElement( "TD" );
							td.style.border = "1px solid black";
							tr.appendChild( td );
						}
					}
					range.insertNode( table );
					$( this ).parent().parent().css( "display","none" );
					$( this ).parent().find( "input[data-type=rows]" ).val( "" );
					$( this ).parent().find( "input[data-type=cols]" ).val( "" );
				} else if ( $( this ).attr( "data-custom-command" ) === "fontColor" ) {
					var color = $( this ).parent().find( "input" ).val(),
						range = selection.getRangeAt( 0 ),
						content = range.extractContents(),
						span = document.createElement( "SPAN" );
					span.appendChild( content );
					span.style.color = color;
					range.insertNode(span);
					$( this ).parent().parent().css( "display","none" );
					$( this ).parent().find( "input" ).val( "" );
				}
			} else {
				if ( $( this ).attr( "data-modal" ) === "image" && opts.imageAjax ) {
					var that = this;
					$.ajax({
						method: opts.imageAjax.method,
						url: opts.imageAjax.url
					})
					.done(function( data ){
						var i = 0,
							alreadyLoaded = false,
							images = $( that ).next().children( "div" ).children( "img" ),
							j = 0;			
						for (; i < data.length; i++) {
							for ( ; j < images.length; j++ ) {
								if ( $( images[j] ).attr( "src" ) == data[i].url ) {
									alreadyLoaded = true;
								}
							}
							if ( !alreadyLoaded ) {
								$( that ).next().find( "div.modal-content" ).append( 
									"<br><img src='"+data[i].url+
									"' width='50px' height='50px'><a data-command='insertImage' data-value='"+data[i].url+
									"' class='waves-effect waves-light btn'>"+data[i].name+
									"</a>" 
								);
							}
							alreadyLoaded = false;
							j = 0;
						}
					});
				}
				$( this ).next().css( "display", "block" );
				$( textarea ).val( idoc.body.innerHTML );
			}
		});

		// The close button for the modals
		$( textarea ).parent().on("click", "span", function(){
			$( this ).parent().parent().css( "display","none" );
			$( textarea ).val( idoc.body.innerHTML );
		});
		// Image resizing functionality
		$( idoc ).on("click", "img", function(){
			// add image resizing functionality
			console.log("clicked a image");
		});
		// When the textarea changes the iframe should also change
		$( textarea ).on("change", function(){
			var code = $( this ).val();
			idoc.body.innerHTML = code;
		});
		// Blur event for the iframe
		$( iwin ).on("blur", function(){
			var design = idoc.body.innerHTML;
			$( textarea ).val( design );
		});
		// When the iframe changes the textarea should also change
		$( idoc ).on("change keyup", function(){
			var design = idoc.body.innerHTML;
			$( textarea ).val( design );
		});
		// Recursive function for checking the "depth" of elements at cursor
		function parentUntilBody( el, list, callback ){
			if( $( el )[0].nodeName !== "BODY" ) {
				if ( $( el )[0].nodeName === "SPAN" ) {
					var style = $( el )[0].nodeName.style;
					for ( var child in style ) {
						if ( ( !style[child] ) || child !== "length" ) {
							list.push( $( el )[0].nodeName+"_"+style[child] );
						}
					}
				} else {
					list.push( $( el )[0].nodeName );
				}
				parentUntilBody( el.parentNode, list, callback );
			} else {
				callback( list );
			}
		}
		// When the user clicks anywhere in the iframe check which commands are active
		$( idoc ).on("click", function(){
			var selection = idoc.getSelection();
			parentUntilBody( selection.anchorNode, [], function( data ){
				console.log( data );
			});
		});
		iwin.focus(); // This only works if only 1 iframe is initialized on the page, moves focus into the iframe
		return textarea; // Return this as the main object, even though not much data is added/changed
	};
	// Default options
	$.fn.wysiwyg.defaults = {
		allowSize: true,
		allowColor: true,
		allowPositioning: true,
		allowBasic:true,
		allowLists:true,
		allowLinks:true,
		allowImages:true,
		imageAjax: false,
		allowTable:true
	};
}( jQuery ));