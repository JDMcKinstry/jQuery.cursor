(function($) {
	
	var styles = {
			alias: 'alias',
			'all-scroll': 'all-scroll',
			auto: 'auto',
			'default': 'default',
			'col-resize': 'col-resize',
			crosshair: 'crosshair',
			'e-resize': 'e-resize',
			help: 'help',
			inherit: 'inherit',
			move: 'move',
			'n-resize': 'n-resize',
			'ne-resize': 'ne-resize',
			'nw-resize': 'nw-resize',
			'no-drop': 'no-drop',
			'not-allowed': 'not-allowed',
			pointer: 'pointer',
			progress: 'progress',
			'row-resize': 'row-resize',
			's-resize': 's-resize',
			'se-resize': 'se-resize',
			'sw-resize': 'sw-resize',
			text: 'text',
			url: void 0,
			'vertical-text': 'vertical-text',
			'w-resize': 'w-resize',
			wait: 'wait'
		},
		cursorStyles = function() { $.extend(this, styles) };
	
	if (Object['defineProperty']) {	//	TODO: possibly add 'else' statement using things like hasOwnProp for older browser support
		Object.defineProperty(cursorStyles.prototype, 'toArray', { value: function() { return $.map($.cursor.styles, function(v, k) { return v }); } });
		Object.defineProperty(cursorStyles.prototype, 'toString', { value: function() { return this.toArray().join(', ') } });
		
		/*	simply add camel case versions of each property having a dash, but make not visible in itterations	*/
		var cs = new cursorStyles();
		for (var x in cs) {
			if (/-/.test(x)) {
				var y = x.split('-');
				y[1] = y[1].charAt(0).toUpperCase() + y[1].slice(1);
				var z = y.join('');
				Object.defineProperty(cursorStyles.prototype, z, { value: cs[x] });
			}
		}
	}
	
	$.extend({
		cursor: function() {
			var args = arguments,
				elm = $([]),
				command = void 0,
				cursors = [],
				props = {
					delaySet: false,
					trigger: void 0,
					triggerStyle: void 0
				},
				cs = new cursorStyles(),
				triggs = [ 'blur', 'change', 'click', 'dblclick', 'focus', 'hover', 'keydown', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup' ];
			
			if (args.length) {
				for (x in args) {
					var argsX = args[x];
					switch (typeof argsX) {
						case 'object':
							if (argsX instanceof Object && "jquery" in argsX) {
								if ($(document).find(argsX).length) elm = elm.length ? elm.add(argsX) : argsX;
							}
							else if (argsX instanceof Array) $.each(function(i, v){ if (cs.hasOwnProperty(v)) cursors.push(v); });
							else $.extend(true, props, argsX);
							break;
						case 'string':
							if ($(document).find(argsX).length) elm = elm.length ? elm.add($(argsX)) : $(argsX);
							else if (!/#|\./.test(argsX.charAt(0)) && $(document).find("#" + argsX).length) elm = elm.length ? elm.add($("#" + argsX)) : $("#" + argsX);
							else if (!/#|\./.test(argsX.charAt(0)) && $(document).find("." + argsX).length) elm = elm.length ? elm.add($("." + argsX)) : $("." + argsX);
							else if (cs.hasOwnProperty(argsX)) cursors.push(argsX);
							else command = argsX;
							break;
						default:
							//	throw error? TODO: implement some error control for developers ... but oh the headache for other sections ...
					}
				}
				
				if (elm.get(0) && elm.length) {
					if (args.length == 1) {	//	was passed simply as $('ele').cursor() || $.cursor($('ele'))
						if (elm.length == 1) return elm.css('cursor');
						var a = {};
						elm.each(function(i) {
							if (this.id) a['#' + this.id] = $(this).css('cursor');
							else if (this.getAttribute('name')) a[this.getAttribute('name')] = $(this).css('cursor');
							else a[this.tagName.toLowerCase()] = $(this).css('cursor');
						});
						return a;
					}
					
					if (command) {
						var d = elm.data('cursorDefault'),
							p = elm.data('cursorProps'),
							s = elm.data('cursorStyles'),
							i = s.indexOf(elm.get(0).style.cursor ? elm.get(0).style.cursor : 'auto');
						switch(command) {
							case 'clear':
								return elm.each(function(i) { $(this).css('cursor', ''); });
								break;
							case 'revert':
								return elm.each(function(i) { $(this).css('cursor', $(this).data('cursorDefault')); });
								break;
							case 'reset':
								return elm.each(function(i) { $(this).css('cursor', $(this).data('cursorDefault')).removeData([ 'cursorDefault', 'cursorProps', 'cursorStyles' ]); });
								break;
							case 'isHover':
								if (elm.length == 1) return elm.is(':hover');
								else {
									var a = {};
									elm.each(function(i) {
										if (this.id) a['#' + this.id] = $(this).is(':hover');
										else if (this.getAttribute('name')) a[this.getAttribute('name')] = $(this).is(':hover');
										else a[this.tagName.toLowerCase()] = $(this).is(':hover');
									});
									return a;
								}
								break;
							case 'position':
								var cpos = $.cursor.position;
								
								if (cpos.x != void 0 && cpos.y != void 0) {
									if (elm.length == 1) {
										var tpos = elm.offset();
										return { x: cpos.x - tpos.left, y: cpos.y - tpos.top };
									}
									else {
										var a = {};
										elm.each(function(i) {
											var tpos = $(this).offset();
											if (this.id) a['#' + this.id] = { x: cpos.x - tpos.left, y: cpos.y - tpos.top };
											else if (this.getAttribute('name')) a[this.getAttribute('name')] = { x: cpos.x - tpos.left, y: cpos.y - tpos.top };
											else a[this.tagName.toLowerCase()] = { x: cpos.x - tpos.left, y: cpos.y - tpos.top };
										});
										return a;
									}
								}
								else throw 'cursor position is currently turned off!';
								break;
							case 'toggleNext':
								if (s.length) {
									i++;
									if (i > s.length - 1) i = 0;
									return elm.css('cursor', s[i]);
								}
								break;
							case 'togglePrev':
								if (s.length) {
									i--;
									if (i < 0) i = s.length - 1;
									return elm.css('cursor', s[i]);
								}
								break;
							case 'toggleRand':
							case 'toggleRandom':
								if (s.length) {
									i = Math.floor(Math.random() * s.length - 1);
									while (i < 0 || i > s.length -1) i = Math.floor(Math.random() * s.length - 1);
									return elm.css('cursor', s[i]);
								}
								break;
						}
						throw 'cursor command [' + command + '] not valid!';
					}
					
					//	remove styles & trigs from properties and set properties for future use
					if (props['styles']) {
						$.each(props['styles'], function(i, v) { cursors.push(v); });
						delete props['styles'];
					}
					
					if (props['trigger'] != void 0) {
						var ct = props['trigger'].split(' ');
						$.each(ct, function(i, t) {
							elm.each(function(i) {
								if (!$(this).data('cursorTriggers')) $(this).data('cursorTriggers', []);
								if ($.inArray(t, $(this).data('cursorTriggers')) < 0) {
									$(this).data('cursorTriggers').push(t);
									$(this).on(t, function(e) {
										if (e.type == 'mousemove') {
											var cpl = $(this).data('cursorPositionLast')
											if (!$.isEmptyObject(cpl) && Math.round(cpl.x) == Math.round(e.pageX) && Math.round(cpl.y) == Math.round(e.pageY)) return $(this);
											else $(this).data('cursorPositionLast', { x: e.pageX, y: e.pageY })
										}
										var $this = $(this),
											d = $this.data('cursorDefault'),
											p = $this.data('cursorProps'),
											s = $this.data('cursorStyles'),
											i = s.indexOf($this.get(0).style.cursor ? $this.get(0).style.cursor : 'auto');
										if ($this.data('tmrCursorTrigger')) clearTimeout($this.data('tmrCursorTrigger'));
										$this.data('tmrCursorTrigger', setTimeout(function() {
											if (!$.isEmptyObject(p) && s.length) {
												//if ((s.indexOf(d) < 0) && s.length == 1) s.unshift(d);
												switch (p.triggerStyle) {
													case 'rand':
													case 'random':
														i = Math.floor(Math.random() * s.length - 1);
														while (i < 0 || i > s.length -1) i = Math.floor(Math.random() * s.length - 1);
														$this.css('cursor', s[i]);
														break;
													case 'prev':
														i--;
														if (i < 0) i = s.length - 1;
														$this.css('cursor', s[i]);
														break;
													case 'next':
													default:
														i++;
														if (i > s.length - 1) i = 0;
														$this.css('cursor', s[i]);
												}
											}
										}));
									});
								}
							});
						});
						delete props['trigger'];
					}
					elm.data('cursorProps', props);
					
					//	set cursor styles data and possibly set cursor
					if (cursors.length) {
						elm.each(function(i) { if (!$(this).data('cursorDefault')) $(this).data('cursorDefault', $(this).css('cursor')); });
						$.each(cursors, function(i, v) {
							if (/(url\([^\)]*\))/.test(v)) {
								var av = v.split(',');
								$.each(av, function(i, u) {	//	preload images for faster toggling later
									var url = u.match(/\(([^)]+)\)/);
									if (url) {
										url = url[1];
										var ph = $('<img />', { style: 'height: 1px; left: -2px; position: fixed; top: -2px; width: 1px;' }).appendTo('body');
										ph.on('load', function(e) { $(this).remove(); }).attr('src', url);
									}
								}); 
								if (!/,(?!url\()/.test(v)) cursors[i] += ', auto';
							}
						});
						if (!props['delaySet']) elm.css('cursor', cursors[0]);
					}
					elm.data('cursorStyles', cursors);
					
					return elm;
				}
				else if (void 0 == elm.get(0)) {
					if (command) {
						switch (command) {
							case 'isHover':
								var a = $('*').filter(function(i) { return $(this).is(':hover'); }).cursor('isHover');
								return $.map(a, function(v, k) { return k; });
								break;
							case 'position':
								return $.cursor.position;
								break;
							default: return $('body').cursor(command);
						}
					}
					if (cursors.length) return $('body').cursor(cursors.join(', '));
					if (!$.isEmptyObject(props)) return $('body').cursor(props);
				}
			}
			
			return $('body').css('cursor');
		}
	});
	
	$.fn.extend({
		cursor: function() {
			var args = [$(this)];
			if (arguments.length) for (x in arguments) args.push(arguments[x]);
			return $.cursor.apply($, args);
		}
	});
	
	//	maintain overall mouse position
	var cursorPosition = function(delay) { this.x = void 0; this.y = void 0; if (!delay) this.on(); },
		setCursorPosition = function(e) { $.cursor.position = { x: e.pageX, y: e.pageY }; };
	if (Object['defineProperty']) {
		Object.defineProperty(cursorPosition.prototype, 'setCursorPosition', { value: function(e) { $.extend(true, $.cursor.position, { x: e.pageX, y: e.pageY }); } });
		Object.defineProperty(cursorPosition.prototype, 'on', { value: function() { $(document).on('mousemove', this['setCursorPosition']); } });
		Object.defineProperty(cursorPosition.prototype, 'off', { value: function() {
			$(document).off('mousemove', this['setCursorPosition']);
			$.cursor.position.x = void 0;
			$.cursor.position.y = void 0;
		} });
	}
	$.cursor.position = new cursorPosition();
	
	$.cursor.styles = new cursorStyles();
	
})(jQuery);