/*
 * custom select based on jquery
 * author: Max Wang
 * Email: wrymax@qq.com
 */
/*
 * HTML Structure:
 * div.custom_select
 *   div.main_option.option
 *   div.candidate_options
 *     div.candidate_option.option
 *     div.candidate_option.option
 *     div.candidate_option.option
 *     ...
 */
/*
 * Mechanism:
 *   1. Hide the original select and add a select-like div.custom_select
 *   2. Add css for the div.custom_select
 *   3. Bind click and hover events for it,
 *      what's the most important is, 
 *      trigger the relevant change of the hidden select, 
 *      so you can submit right params using the original select 
 */
$.fn.custom_select = function(options) {
	options = options || {};
	var select = $(this);
	// encode the select
	select.find('option').each(function(index){
		$(this).attr('seq_code', index);
	})
	// function for making the select token
	function make_token() {
    var width = parseInt(options.width || select.width()) + 25 + 'px';
    var height = parseInt(options.height || select.height()) + 'px';
    var token = $("<div class='custom_select'></div>").attr('id', select.attr('id') + '_custom_select');
		var selected_option = select.find('option:selected');
		var other_options = select.find('option:not(:selected)');
		var candidate_options = $("<div class='candidate_options'></div>").width(width).css('top', height).hide();
		var main_option = $("<div class='option main_option'></div>").height(height).text(selected_option.text()).data('value', selected_option.attr('value')).attr('seq_code', selected_option.attr('seq_code'));
    token.width(width).height(height).append(main_option);
		candidate_options.appendTo(token);
		other_options.each(function(){
			var that = $(this);
			var div = $('<div class="option candidate_option"></div>');
			div.text(that.text()).data('value', that.attr('value')).attr('seq_code', that.attr('seq_code'));
			candidate_options.append(div);
		})
    token.find('.option').css('lineHeight', /px/.test(height)?height:(height+'px'));
		candidate_options.find('.option:not(:last)').css('borderBottom', '1px solid #CCC');
		// bind events
		bind_events(token);
		select.hide();
		return token;
	}
	function bind_events(token) {
		var main_option = token.find('.main_option');
		var candidates = token.find('.candidate_options');
		var options = token.find('.option');
		main_option.click(function(){
			candidates.toggle();
		})
		options.hover(
			function(){
				$(this).addClass('hovered');
				if($(this).hasClass('main_option'))
					token.addClass('hovered');
			}, 
			function(){
				$(this).removeClass('hovered');
				token.removeClass('hovered');
			}
		)
		candidates.find('.candidate_option').click(option_chosen);
		$(document).click(function(){
			if(token.find('.option.hovered').size() <= 0)
				candidates.hide();
		})
	}
	// core function of the plugin, action when option is chosen
	function option_chosen() {
		var that = $(this);
		var token = that.parents('.custom_select:first');
		var main_option = token.find('.main_option');
		var candidates = token.find('.candidate_options');
    select.find('option').removeAttr('selected')
    select.find('option[seq_code=' + that.attr('seq_code') + ']').attr('selected', 'selected');
		var buffer = {
			text: that.text(), 
      value: that.data('value'), 
      seq_code: that.attr('seq_code')
		}
    that.text(main_option.text()).data('value', main_option.data('value')).attr('seq_code', main_option.attr('seq_code'));
		main_option.text(buffer.text).data('value', buffer.value).attr('seq_code', buffer.seq_code);
		candidates.hide();	
    select.trigger('change');
	}
	// function for binding events on the token
	// bind the custom_select to the target
	make_token().insertAfter(select);
}
