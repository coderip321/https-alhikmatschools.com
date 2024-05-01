(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	$(document).ready(function (){
		// Answer Sound Muter
		$(document).on('click', '.ays_music_sound', function() {
			var $this = $(this);
			var audioEl = $(document).find('.ays_pb_sound').get(0);
			if($this.hasClass('ays_sound_active')){
				audioEl.volume = 0;
				$this.find('.ays_pb_fa_volume').remove();
				$this.html(pbLocalizeObj.icons.volume_mute_icon);
				$this.find('.ays_pb_fa_volume').addClass('ays_pb_fa_volume_off').removeClass('ays_pb_fa_volume');
				$this.removeClass('ays_sound_active');
			} else {
				audioEl.volume = 1;
				$this.find('.ays_pb_fa_volume_off').remove();
				$this.html(pbLocalizeObj.icons.volume_up_icon);
				$this.find('.ays_pb_fa_volume_off').addClass('ays_pb_fa_volume').removeClass('ays_pb_fa_volume_off');
				$this.addClass('ays_sound_active');
			}
		});

		$(document).on('click', '#ays_pb_dismiss_ad', function(){
			var expTime = $(this).parent().data('dismiss');
			var id = $(this).parent().data('id');

			if(expTime != ''){
				set_cookies('ays_pb_dismiss_ad_'+id, 'ays_pb_dismiss_ad_'+id, parseInt(expTime));
			}else{
				var expiryDate = new Date();
				expiryDate.setMonth(expiryDate.getMonth() + 1);
				set_cookies('ays_pb_dismiss_ad_'+id, 'ays_pb_dismiss_ad_'+id, expiryDate);
			}
			$(document).find('.ays-pb-modal-close_'+id).trigger('click');
		});

		$(document).on('click', '.asypb-cta', function(){
			let popupContainer = $(this).closest('.ays-pb-modals');
			if (!popupContainer) return;

			// Check if conversion already updated
			if (typeof popupContainer.attr('data-updated-conversion') != 'undefined') return

			var classValue = popupContainer.attr('class');
			var id = classValue.match(/av_pop_modals_(\d+)/)[1];
			updatePopupConversions(id);

			popupContainer.attr('data-updated-conversion', true);
		});

		function set_cookies( cname, cvalue, exdays ) {
			var expires = 'expires=' +  (new Date(Date.now() + exdays)).toUTCString();  
				document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
		}

		var isMobileDevice = false;
		if (window.innerWidth < 768) {
			isMobileDevice = true;
		}

		$('div.ays-pb-modals').each(function() {
			var classValue = $(this).attr('class');
			var id = classValue.match(/av_pop_modals_(\d+)/)[1];
			var popup = JSON.parse(atob(window.aysPopupOptions[id])).popupbox;
			var popupOptions = JSON.parse(popup.options);

			var actionType = popup.action_button_type;
			var openDelay = popup.delay;
			var scrollTop = popup.scroll_top;

			var template = popup.view_type;
			var height = popup.height;
			var minHeight = popupOptions.pb_min_height;
			var borderSize = (typeof popup.bordersize != 'undefined') ? popup.bordersize : 0;
			var enableborderSizeMobile = (typeof popupOptions != 'undefined' && typeof popupOptions.enable_bordersize_mobile != 'undefined' && popupOptions.enable_bordersize_mobile == 'on') ? true : false;
			if (typeof popupOptions != 'undefined' && typeof popupOptions.bordersize_mobile != 'undefined') {
				var borderSizeMobile = popupOptions.bordersize_mobile;
			} else {
				var borderSizeMobile = borderSize;
			}

			if (!enableborderSizeMobile) {
				borderSizeMobile = borderSize;
			}

			var enableFullScreen = popupOptions.enable_pb_fullscreen == 'on' ? true : false;

			var closeButtonPosition = popupOptions.close_button_position;
			var closeButtonText = popupOptions.close_button_text;
			var closeButtonImage = popupOptions.close_button_image;

			var enableOpenDelayMobile = popupOptions.enable_open_delay_mobile == 'on' ? true : false ;
			var enableScrollTopMobile = popupOptions.enable_scroll_top_mobile == 'on' ? true : false ;
			var enableCloseButtonPositionMobile = popupOptions.enable_close_button_position_mobile == 'on' ? true : false ;
			var enableCloseButtonTextMobile = popupOptions.enable_close_button_text_mobile == 'on' ? true : false ;

			$(document).find('.ays-pb-modal-close_'+id).on('click', function() {
				$(document).find('input#ays-pb-modal-checkbox_' + id).trigger('change');
			})

			var formattedBorderSize = borderSize;
			if (isMobileDevice) {
				if (enableCloseButtonPositionMobile) {
					closeButtonPosition = popupOptions.close_button_position_mobile;
				}
				if (enableCloseButtonTextMobile) {
					closeButtonText = popupOptions.close_button_text_mobile;
				}
				if (enableOpenDelayMobile) {
					openDelay = popupOptions.open_delay_mobile;
				}
				if (enableScrollTopMobile) {
					scrollTop = popupOptions.scroll_top_mobile;
				}
				if (enableborderSizeMobile) {
					formattedBorderSize = borderSizeMobile;
				}

				height = popupOptions.mobile_height ? popupOptions.mobile_height : popup.height;
				enableFullScreen = false;
			}

			if (actionType == 'both' || actionType == 'pageLoaded') {
				if (openDelay == 0 && scrollTop == 0) {
					$(document).find('input#ays-pb-modal-checkbox_' + id).prop('checked', true);
				}
			}

			if (enableFullScreen) {
				height = window.innerHeight;
			}
			setCloseButtonPosition(template, id, height, minHeight, formattedBorderSize, enableFullScreen, closeButtonPosition, closeButtonImage);
			setCloseButtonText(closeButtonText, closeButtonImage, id, template);
		});

		function setCloseButtonPosition(template, id, height, minHeight, borderSize, enableFullScreen, closeButtonPosition, closeButtonImage) {
			if (template !== 'default' && template !== 'lil' && template !== 'image' && template !== 'template' && template !== 'video' && template !== 'minimal' && template !== 'image_type_img_theme' && template !== 'facebook' && template !== 'notification') {
				return false;
			}

			var heightForPosition = height;
			if (minHeight > height) {
				heightForPosition = minHeight;
			}

			var closeButtonPositionValue = {};

			if (template == 'default' || template == 'image_type_img_theme' || template == 'facebook') {
				var aysConteiner       = parseInt(heightForPosition);
				var h2Height           = $(document).find('.ays-pb-modal_' + id + ' h2').outerHeight(true);
				var hrHeight           = $(document).find('.ays-pb-modal_' + id + ' hr').outerHeight(true);
				var descriptionHeight  = $(document).find('.ays-pb-modal_' + id + ' .ays_pb_description').outerHeight(true);
				var timerHeight        = $(document).find('.ays-pb-modal_' + id + ' .ays_pb_timer_' + id).outerHeight(true);
				var customHtml         = $(document).find('.ays-pb-modal_' + id + ' .ays_content_box').outerHeight(true);

				if(h2Height == undefined){
					h2Height = 0;
				}
				if(hrHeight == undefined){
					hrHeight = 0;
				}
				if(descriptionHeight == undefined){
					descriptionHeight = 0;
				}
				if(timerHeight == undefined){
					timerHeight = 0;
				}
				if(customHtml == undefined){
					customHtml = 0;
				}
				var aysConteinerHeight = (h2Height + descriptionHeight + timerHeight + customHtml + hrHeight);
				if(aysConteinerHeight < aysConteiner){
					if(enableFullScreen){
						aysConteinerHeight =  (aysConteiner - 75) + 'px';
					}else{
						aysConteinerHeight =  (aysConteiner - 55) + 'px';
					}
				}
				switch(closeButtonPosition) {
					case 'left-top':
						closeButtonPositionValue = {top: '10px', left: '10px'};
						break;
					case 'left-bottom':
						closeButtonPositionValue = {top: aysConteinerHeight, left: '10px'};
						break;
					case 'right-bottom':
						closeButtonPositionValue = {top: aysConteinerHeight, right: '10px'};		
						break;
					default:
						closeButtonPositionValue = {top: '10px', right: '4%'};
						break;
				}
			} else if (template == 'lil') {
				var closeButtonTop;
				if(enableFullScreen){
					closeButtonTop = heightForPosition - 43 + (2 * borderSize);
				}else{
					closeButtonTop = heightForPosition - 43 - (2 * borderSize);
				}
				switch(closeButtonPosition) {
					case 'left-top':
						closeButtonPositionValue = { top: '10px', left: '10px' };
						break;
					case 'left-bottom':
						closeButtonPositionValue = { top: closeButtonTop + 'px', left: '10px' };
						break;
					case 'right-bottom':
						 closeButtonPositionValue = { top: closeButtonTop + 'px', right: '40px', bottom: 'auto', left: 'auto' };
						break;
					default:
						closeButtonPositionValue = { top: '10px', right: '40px' };
						break;
				}
			} else if (template == 'template') {
				var closeBttnImageExist = closeButtonImage != '';
				switch(closeButtonPosition) {
					case 'left-top':
						var sidePostion = closeBttnImageExist ? 30 + 'px' : 20 + 'px';
						closeButtonPositionValue = { top: '14px', left: sidePostion };
						break;
					case 'left-bottom':
						var sidePostion = closeBttnImageExist ? 30 + 'px' : 16 + 'px';
						closeButtonPositionValue = { bottom: '25px', left: sidePostion };
						break;
					case 'right-bottom':
						var sidePostion = closeBttnImageExist ? 30 + 'px' : 16 + 'px';
						closeButtonPositionValue = { bottom: '25px', right: sidePostion };
						break;
					default:
						var sidePostion = closeBttnImageExist ? 30 + 'px' : 20 + 'px';
						closeButtonPositionValue = { top: '14px', right: sidePostion };
						break;
				}
			} else if (template == 'image' || template == 'minimal' || template == 'video') {
				switch(closeButtonPosition) {
					case 'left-top':
						if (enableFullScreen) {
							closeButtonPositionValue = { right: '97%' };
						} else {
							closeButtonPositionValue = {
								top: (-25 - borderSize) + 'px',
								left: (-borderSize) + 'px'
							};
						}
						break;
					case 'left-bottom':
						if (enableFullScreen) {
							closeButtonPositionValue = { top: '97%', right: '95%' };
						} else {
							var close_btn_pos = -15 - borderSize;
							closeButtonPositionValue = {
								bottom: close_btn_pos + 'px',
								left: (-borderSize) + 'px'
							};
						}
						break;
					case 'right-bottom':
						if (enableFullScreen) {
							closeButtonPositionValue = { top: '97%', left: '95%' };
						} else {
							var close_btn_pos = -15 - borderSize;
							closeButtonPositionValue = {
								bottom: close_btn_pos + 'px',
								right: (-borderSize) + 26 + 'px'
							};
						}
						break;
					default:
						if (template == 'image' || template == 'minimal') {
							var top = (enableFullScreen) ? (6 - borderSize) + 'px' : (-29 - borderSize) + 'px';
							closeButtonPositionValue = {
								top: top,
								right: (-borderSize) + 26 + 'px'
							};
						}
						if (template == 'video') {
							if (enableFullScreen) {
								closeButtonPositionValue = { right: '15px' };
							} else {
								closeButtonPositionValue = { 
									top: (-25 - borderSize) + 'px',
									right: (-borderSize) + 15 + 'px'
								};
							}
						}
						break;
				}
			} else if (template == 'notification') {
				switch(closeButtonPosition) {
					case 'left-top':
						closeButtonPositionValue = {top: '0', left: '0'};
						break;
					case 'left-bottom':
						closeButtonPositionValue = {bottom: '0', left: '0'};
						break;
					case 'right-bottom':
						closeButtonPositionValue = {bottom: '0', right: '0'};		
						break;
					default:
						closeButtonPositionValue = {top: '0', right: '0'};
						break;
				}
			}
			closeButtonPositionValue.position = 'absolute';
			$(document).find('.ays-pb-modal_' + id + ' .ays-pb-modal-close_' + id).css(closeButtonPositionValue);

		}

		function setCloseButtonText(closeButtonText, closeButtonImage, id, template) {
			var currentCloseBttnContainer = $(document).find('div.ays-pb-modal-close_' + id );
			var defaultCloseIcon = '<svg class="ays_pb_material_close_icon" xmlns="https://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000" alt="Pop-up Close"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
			var text = '';
			var closeBttnContainerClass = '';

			switch(template) {
				case 'default':
				case 'image_type_img_theme':
				case 'facebook':
				case 'notification':
					if(closeButtonImage != ""){
						text = "<img class='close_btn_img' src='" + closeButtonImage + "' width='30' height='30'>";
					}else{
						if(closeButtonText === '✕'){
							text = defaultCloseIcon;
						}else{
							text = closeButtonText;
						}
					}
					currentCloseBttnContainer.html(text);
					break;
				case 'win98':
					text = closeButtonText;
					currentCloseBttnContainer.find('span').html(text);
					break;
				case 'lil':
					if(closeButtonImage != ""){
						text = "<img class='close_btn_img' src='" + closeButtonImage + "' width='50' height='50'>";
					}else{
						text = closeButtonText;
						if(closeButtonText != '✕'){
							closeBttnContainerClass = 'close-lil-btn-text';
						}
					}
					currentCloseBttnContainer.find('a').addClass(closeBttnContainerClass);
					currentCloseBttnContainer.find('a').html(text);
					break;
				case 'image':
				case 'template':
				case 'minimal':
				case 'video':
					if(closeButtonImage != ""){
						text = "<img class='close_btn_img' src='" + closeButtonImage + "' width='30' height='30'>";
					}else{
						text = closeButtonText;
					}
					currentCloseBttnContainer.find('div').html(text);
					break
			}
		}

		function updatePopupConversions(id) {
			$.ajax({
				url: pbLocalizeObj.ajax,
				method: 'POST',
				dataType: 'text',
				data: {
					id: id,
					action: 'ays_increment_pb_conversions',
				},
			});
		}
	})

	document.addEventListener('DOMContentLoaded', function () {
		(function(d, s, id) {
			let js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0';
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}, false);

})( jQuery );

window.onload = function(){
	var classList = document.body.classList;
	document.ontouchmove = function(e){
    	for( var i = 0; i < classList.length; i++ ){
    		if( classList[i].startsWith('pb_disable_scroll_') ){
    			if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                    e.preventDefault(); 
    			}
    			break;
    		}
    	}
	}
}