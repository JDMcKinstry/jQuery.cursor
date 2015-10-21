jQuery.cursor
===================

This plugin attempts to add a little extra functionality when changing the mouse cursor on comman. Sure, the base change is easy, but this shoots for a little more.

----------

Most Basic Uses
-------------
```
$.cursor();	//	return current cursor style relative to document BODY
$.cursor('style');	//	set current cursor style relative to document BODY
```

```
$.cursor('position');	//	return current cursor position relative to document page
$.cursor('position', 'client');	//	return current cursor position relative to client window
$.cursor('position', 'screen');	//	return current cursor position relative to screen position
```

> **Note:**
> List of available styles can be found at [here][1]


Most Basic Element Uses
-------------
```
$(ele).cursor();	//	return current cursor style for given elements
$(ele).cursor('position');	//	return current cursor position relative to given elements and elements' posisiont on document page
$(ele).cursor('style');	//	set current cursor style for given elements
$(ele).cursor('clear');	//	remove any set style to given elements
$(ele).cursor('revert');	//	restore given elements to default cursor before first use of $.cursor
$(ele).cursor('reset');	//	remove all $.cursor data and revert to default style
```

The Hover
-------------
 <i>isHover</i> does a little more than the simple command `$(ele).is('hover');`. With the following `$.cursor` commands, you can discover all elements currently hovered over, if a list of elements is hovered over, or the good old fashioned boolean for one given element. 

```
/*	To simply return if an element is hovered over	*/
$('#ele').cursor('isHover');
/*	To get an array if a list of elements is hovered over	*/
$('#ele, [name=bob], h4').cursor('isHover');
/*	To verify if ALL elements in a list are hovered over	*/
$('#ele, [name=bob], h4').cursor('isHover', true);
/*	to get a list of ALL elements currrently hovered over	*/
$.cursor('isHover');
```

> **Note: `$('#ele, [name=bob], h4').cursor('isHover');`**

> The list returned is an OBJECT containing key/value pairs, wherein the <i>value</i> is whether the elements have hover or not. The <b>key</b> is decided based on each element's <i>ID, Name, or TagName</i>, in that order.

> **Note: `$.cursor('isHover');`**

> The list is simply an ARRAY of strings of elements that DO have hover. Each string is either an element's <i>ID, Name, or TagName</i>, in that order.


Advanced Element Uses
-------------

Another handy feature of this plugin is being able to asign multiple cursors to an element for easy swapping later. 

For example, you have a form, and everytime the user submits the form, you want to change the cursor from <i>pointer</i> to <i>wait</i> and then back again. 

```
//	first asign your multiple cursors
$('div').cursor('pointer', 'wait'); //	NOTE: this will immidiatly change the cursor for that element to `pointer`
//	you can also set multiple cursors using an array
$('div').cursor([ 'pointer', 'wait' ]);

//	then, in your form's beforeSubmit method
$('div').cursor('toggle', 'next');	//	this will go to next cursor in the list

//	and finally, after the form's return
$('div').cursor('toggle', 'prev');	//	this will go to previous cursor in list
```

Several toggle commands are available once you have multiple cursors set.

**The Toggle Commands** <i>only available once cursor styles have been set</i>:
 - `$(ele).cursor('toggle', 'first');` Will go to first cursor style in last given list
 - `$(ele).cursor('toggle', 'last');` Will go to last cursor style in last given list
 - `$(ele).cursor('toggle', 'next');` Will go to next cursor style in last given list
 - `$(ele).cursor('toggle', 'prev');` Will go to prev cursor style in last given list
 - `$(ele).cursor('toggle', 'rand');` Will randomly select a cursor style in last given list

Setting with Properties! (Advanced)
-------------
<sub>More features coming soon! Suggestions welcome.</sub>

Setting `.cursor` using an object allows you to set a few different options, including what ***event*** will trigger the next cursor change!

```
$(ele).cursor({
	delaySet: false, //	If set to true, then the element will not change to a new cursor until you tell it too
	trigger: 'jQuery.event',	//	This feature supports a handful of jQuery events and will automatically trigger a cursor change whenever this event occurs on given element
		//	see complete list of supported events below
	triggerStyle: 'next',	//	determines in which direction to search for a cursor when event fires
		//	available styles are (default)`next`, `prev`, & `rand`
	styles: []	//	an array of desired cursor styles
});
```

> Take note, the only required property in this method of assignment is ***styles***.

#####Full Example:

	$('#ele').cursor({
		delaySet: true,
		trigger: 'click',
		triggerStyle: 'rand',
		styles: [ 'pointer', 'crosshair', 'zoom-in' ]
	});



[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#Values
