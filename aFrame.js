
/**
 * aFrame Description goes here.
 * <p /><PRE>
 * System Generated Events
 * -----------------------
 * SYSTEM.ERROR
 * SYSTEM.WARNING
 * SYSTEM.NOTICE
 * SYSTEM.STARTUP
 * SYSTEM.SHUTDOWN
 * 
 * SYSTEM.APP.LOAD
 * SYSTEM.APP.LOADED
 * SYSTEM.APP.UNLOAD
 * SYSTEM.APP.CLICK
 * SYSTEM.APP.DOUBLECLICK
 * SYSTEM.APP.MOUSEOVER
 * SYSTEM.APP.MOUSEOUT
 * SYSTEM.APP.MOUSEMOVE
 * SYSTEM.APP.SHOW
 * SYSTEM.APP.HIDE
 * 
 * SYSTEM.RESOURCE.LOAD
 * SYSTEM.RESOURCE.LOADED
 * SYSTEM.RESOURCE.UNLOAD
 * 
 * AJAX.START
 * AJAX.STATECHANGE
 * AJAX.END
 * AJAX.SUCESS
 * AJAX.ERROR
 * 
 * BROWSER.LOAD
 * BROWSER.UNLOAD
 * BROWSER.RESIZE
 * BROWSER.BLUR
 * BROWSER.FOCUS
 * BROWSER.CLOSE
 * BROWSER.MOUSEOVER
 * BROWSER.MOUSEOUT
 * BROWSER.MOUSEMOVE
 * BROWSER.CLICK
 * BROWSER.DOUBLECLICK
 * BROWSER.CONTEXTMENU
 * BROWSER.MOUSEDOWN
 * BROWSER.MOUSEUP
 * BROWSER.KEYPRESS
 * BROWSER.KEYDOWN
 * BROWSER.KEYUP
 * BROWSER.ABORT
 * BROWSER.ERROR
 * BROWSER.SCROLL
 * BROWSER.MOUSESCROLL
 * BROWSER.NODE_INSERT
 * BROWSER.NODE_REMOVE
 * BROWSER.CHARACTER_DATA_MODIFIED
 * </PRE><P />
 * CREDITS:<UL>
 * <LI>aframe.ajax: 	based on a modified version of  AjaxToolbox by Matt Kruse <matt@ajaxtoolbox.com> {@link http://www.AjaxToolbox.com/}
 * <LI>aframe.select:	Sizzle
 * </UL>
 * @namespace
 * @author Mark Holtzhausen <nemesarial@gmail.com>
 * */
aframe=new function(){
	this._cfg={
		'randomIdAllowedChars'					:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890_$',
		'uniqueIdentifierSize'					:24
	}
	
	/**
	 * Stores private data aFrame needs to operate
	 * @private
	 */
	this._data={
		'uniqueIdentifiers':{}
	}
	
	/**
	 * @private
	 */
	this.init=function(){
		aframe.dom.select(); //Start the Sizzle Functions
		aframe.events.trigger('BROWSER.LOAD',{});
		aframe.events.trigger('SYSTEM.STARTUP',{})
	};
	
	/**
	 * This is a shortcut to aframe.dom.select. It will select each element satisfying
	 * the css3 selector passed.
	 * @method
	 * @param {String} css3selector			A CSS3 selector
	 * @returns {Array} Elements resulting from the CSS3 selector filter
	 * @see aframe.dom.select
	 */
	this.select=function(css3selector,context){
		return aframe.dom.select(css3selector,context);
	}
	
	/**
	 * @private
	 */
	this.destroy=function(){
		aframe.events.trigger('SYSTEM.SHUTDOWN');
		try{delete(this);}catch(e){}
	}

	/**
	 * Extends an object with the properties of another.
	 * 
	 * @param destination The object to be extended
	 * @param source The object containing the properties to be inserted. 
	 */
	this.extend = function(destination,source) {
		if(destination!=undefined && source!=undefined){
			for (var property in source)
				destination[property] = source[property];
			return destination;
		}
	}
	
	/**
	 * Creates a Namespace if it doesn't already exist.
	 * 
	 * @param namespaceString A dot-notation namespace string.
	 */
	this.nameSpace=function(namespaceString){
		var ns=(new String(namespaceString)).split('\.');
		var obj=null;
		try{eval('obj='+ns[0]+';');}catch(e){obj={};eval(ns[0]+'=obj;')};
		for(var i=1; i<ns.length; i++){
			if(!aframe.vars.isset(obj[ns[i]]))obj[ns[i]]={};
		}
	};

	/**
	 * Generates a Random ID.
	 * 
	 * @method
	 * @param {String} prefix		The prefix to the id. Defaults to '_' if not supplied
	 * @param {Number} size			The total length of the returned id. Default defined in aframe._cfg.uniqueIdentfierSize.
	 * @returns {String}			A string consisting of random characters defined in aframe._cfg.randomIdAllowedChars
	 */
	this.randomId=function(prefix,size){
		var id=aframe.vars.getDefault(prefix,'_');
		size=this.vars.getDefault(size,this._cfg.uniqueIdentifierSize,16);
		var rep=size-aframe.vars.strlen(id);
		var chars=new String(this._cfg.randomIdAllowedChars);
		var rndlen=chars.length;
		//There must be space for at least 5 unique characters after the prefix
		if(rep<=5){
			aframe.events.trigger('SYSTEM.ERROR',aframe.events.createErrorEvent(this,'SYSTEM ERROR','Configuration Error:aframe','prefix and size parameters allow too few unique id\'s.'));
		}else{
			for(var i=0; i<rep; i++){
				var pos=aframe.vars.rand(0,rndlen);
				var char_=chars[pos-1];
				id=id+char_;
			}
		}
		return id;
	}
	
	/**
	 * Generates a Unique Random ID. The uniqueness of this ID is limited to the current aFrame execution span. 
	 * As soon as the page is refreshed, the uniqueness will be lost.
	 * 
	 * @method
	 * @param {String} prefix		The prefix to the id. Defaults to '_' if not supplied
	 * @param {Number} size			The total length of the returned id. Default defined in aframe._cfg.uniqueIdentfierSize.
	 * @returns {String}			A string consisting of random characters defined in aframe._cfg.randomIdAllowedChars
	 */
	this.uniqueId=function(prefix,size){
		prefix=aframe.vars.getDefault(prefix,'_');
		size=new Number(aframe.vars.getDefault(size,this._cfg.uniqueIdentifierSize,16));
		var id;
		do{
			id=this.randomId(prefix,size);
		}while(this._data.uniqueIdentifiers[id]!=undefined);
		this._data.uniqueIdentifiers[id]=true;
		return id;
	}
	
	/**
	 * Functions passed to this method will be executed when the SYSTEM.STARTUP event is fired
	 * @method
	 * @param {Function} func The function that will be executed on SYSTEM.STARTUP
	 */
	this.onLoad=function(func){
		aframe.events.bind('SYSTEM.STARTUP',func);
	}
	
	window.addEventListener('load',function(){aframe.init();},false);
	window.addEventListener('unload',function(){aframe.destroy();},false);
	window.addEventListener('blur',function(e){aframe.events.trigger('BROWSER.BLUR',{target:e.target,data:e})},false);
	window.addEventListener('focus',function(e){aframe.events.trigger('BROWSER.FOCUS',{target:e.target,data:e})},false);
	window.addEventListener('close',function(e){aframe.events.trigger('BROWSER.CLOSE',{target:e.target,data:e})},false);
	window.addEventListener('mouseover',function(e){aframe.events.trigger('BROWSER.MOUSEOVER',{target:e.target,data:e})},false);
	window.addEventListener('mouseout',function(e){aframe.events.trigger('BROWSER.MOUSEOUT',{target:e.target,data:e})},false);
	window.addEventListener('mousemove',function(e){aframe.events.trigger('BROWSER.MOUSEMOVE',{target:e.target,data:e})},false);
	window.addEventListener('click',function(e){aframe.events.trigger('BROWSER.CLICK',{target:e.target,data:e})},false);
	window.addEventListener('dblclick',function(e){aframe.events.trigger('BROWSER.DOUBLECLICK',{target:e.target,data:e})},false);
	window.addEventListener('contextmenu',function(e){aframe.events.trigger('BROWSER.CONTEXTMENU',{target:e.target,data:e})},false);
	window.addEventListener('mousedown',function(e){aframe.events.trigger('BROWSER.MOUSEDOWN',{target:e.target,data:e})},false);
	window.addEventListener('mouseup',function(e){aframe.events.trigger('BROWSER.MOUSEUP',{target:e.target,data:e})},false);
	window.addEventListener('keypress',function(e){aframe.events.trigger('BROWSER.KEYPRESS',{target:e.target,data:e})},false);
	window.addEventListener('keydown',function(e){aframe.events.trigger('BROWSER.KEYDOWN',{target:e.target,data:e})},false);
	window.addEventListener('keyup',function(e){aframe.events.trigger('BROWSER.KEYUP',{target:e.target,data:e})},false);
	window.addEventListener('abort',function(e){aframe.events.trigger('BROWSER.ABORT',{target:e.target,data:e})},false);
	window.addEventListener('error',function(e){aframe.events.trigger('BROWSER.ERROR',{target:e.target,data:e})},false);

	document.addEventListener('scroll',function(e){aframe.events.trigger('BROWSER.SCROLL',{target:e.target,data:e})},false);
	document.addEventListener('DOMMouseScroll',function(e){aframe.events.trigger('BROWSER.MOUSESCROLL',{target:e.target,data:e})},false);
	document.addEventListener('DOMNodeInserted',function(e){aframe.events.trigger('BROWSER.NODE_INSERT',{target:e.target,data:e})},false);
	document.addEventListener('DOMNodeRemoved',function(e){aframe.events.trigger('BROWSER.NODE_REMOVE',{target:e.target,data:e})},false);
	document.addEventListener('DOMCharacterDataModified',function(e){aframe.events.trigger('BROWSER.CHARACTER_DATA_MODIFIED',{target:e.target,data:e})},false);
}

aframe.bindFunction=function(fn,obj){
	if(typeof(obj)!=='object')obj={};
	if(typeof(fn)!=='function')fn=function(){};
	return (function(that,fn){
		return function(){
			obj.apply(fn,arguments);
		}
	})(obj,fn);
}

aframe.delay=function(ms,fn){
	alert(fn);
	setTimeout(fn,ms);
}

aframe.cfg=function(){
	this._data={};
	
	this.get=function(name){
		var ret=undefined;
		try{
			ret=this._data[name];
		}catch(E){}
		return ret;
	};
	
	this.set=function(name,value){
		this._data[aframe.vars.stringify(name)]=value;
	};
	
	this.isset=function(name){
		var ret=false;
		try{
			ret=(typeof(this._data[name])!==undefined);
		}catch(E){}
		return ret;
	};
	
	this.remove=function(name){
		try{
			this._data[name]=undefined;
			delete(this._data[name]);
		}catch(E){};
	};
	
	this.clear=function(){
		this._data={};
		return true;
	}
}

/**
 * The Event Handler will allow you to generate and respond to application level events
 * in your code. Any javascript anywhere after the framework has loaded can trigger an event.
 * If there are any handlers bound to the triggered event, they will be called with the 
 * predefined event object as a parameter.
 * 
 * Event functionality allows disparate and disconnected pieces of code to respond to application
 * events.
 *  
 * @namespace 
 * */
aframe.events=new function(){
	this._cfg={
		'uniqueEventIdLength'		:20,
		'uniqueEventIdPrefix'		:'evt_',
		'uniqueEventIdChars'		:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890_$',
		'uniqueEventIdTries'		:15,
		'restrictUnregisteredEvents':false
	};
	
	/** @private */
	this._bindings={};
	/** @private */
	this._registered={};
	/** @private */
	this._callData={};
	
	/**
	 * Register an Event by Name. This can be used to prevent unregistered events from being handled
	 * 
	 * @param eventName The name of the event to register.
	 */
	this.register=function(eventName){
		this._registered[eventName]=true;
	};
	
	/**
	 * Unregister an Event by Name. When an application is unloaded it should always
	 * also unregister any events for which it registered itself on initialization.
	 * This convention keeps the garbage collector up to date and will speed up your script.
	 * 
	 * @param eventName The name of the event to unregister.
	 */
	this.unregister=function(eventName){
		try{delete this._registered[eventName];}catch(e){};
	};
	
	/**
	 * Test whether the event has been registered.
	 * 
	 *  @param eventName The name by which the event is identified
	 */
	this.isRegistered=function(eventName){
		var test=false;
		try{test=this._registered[eventName];}catch(e){};
		return test;
	};
	
	/**
	 * Generates a unique ID to be attached to the next bound event. This function can be
	 * called publicly when you need to get the unique id associated with a particular event bound
	 * function before you make the bind. The bind method will return a unique id if none is passed to it.
	 */
	this.getUniqueEventId=function(){
		var c=(arguments.length>0)?arguments[0]:0;
		c=aframe.vars.getDefault(c,0);
		var evt=this._cfg['uniqueEventIdPrefix'];
		var rep=this._cfg['uniqueEventIdLength']-aframe.vars.strlen(evt);
		var chars=new String(this._cfg['uniqueEventIdChars']);
		var rndlen=chars.length;
		//There must be space for at least 5 unique characters after the prefix
		if(rep<=5){
			this.trigger('config_error',this.createErrorEvent(this,'config_error','Configuration Error:aframe.events','uniqueEventIdPrefix and uniqueEventIdLength settings allow too few unique event ids.'));
		}else{
			for(var i=0; i<rep; i++){
				var pos=aframe.vars.rand(0,rndlen);
				var char_=chars[pos-1];
				evt=evt+char_;
			}
		}
		if(aframe.vars.isset(this._callData[evt])){
			if(c<this._cfg['uniqueEventIdTries']){
				evt=this.getUniqueEventId(c+1);
			}else{
				this.trigger('config_error',this.createErrorEvent(this,'framework_error','Unable to find unique id','aframe.events.getUniqueEventId() was unable to find a unique id in '+this._cfg['uniqueEventIdTries']+' attempts.'));
			}
		}
		return evt;
	}
	
	/**
	 * Bind an event to a function. When triggering the named event the supplied function will be
	 * executed with the eventObject as a parameter. If _cfg.restrictUnregisteredEvents is set to 
	 * true, bound events will only be triggered if they had already been registered. 
	 * 
	 * @param eventName The name of the event to bind to the handler.
	 * @param eventFunction The function that you want to bind to the event. This parameter can be
	 * either a function or a string literal representing a function.
	 * @param eventId The unique id for the event handler.
	 * @return <b>eventId</b> If no id was supplied, a unique id will be generated and returned.
	 */
	this.bind=function(eventName,eventFunction,eventId){
		//Make sure the eventId specified is valid
		switch(typeof(eventId)){
			case 'undefined':
				eventId=this.getUniqueEventId();
				break;
			case 'string':
				break;
			default:
				eventId=(new String(eventId)).toString();
		}
		this._callData[eventId]={type:typeof(eventFunction),fn:eventFunction};
		if(!aframe.vars.isset(this._bindings[eventName]))this._bindings[eventName]=new Array();
		this._bindings[eventName][this._bindings[eventName].length]=eventId
		
		return eventId;
	};
	
	/**
	 * Unbind the function identified from the event handler stack. It does not matter to
	 * which event it was bound, it will be removed from all.
	 * At this point the binding table is not altered. However, when an event is fired that still
	 * has this handler in it's binding table, it will detect that it no longer exists and clean
	 * up the garbage.
	 * 
	 * @param eventId The identifier of the event handler. This identifier can be specified
	 * when the event is first bound. If it was not specified, a unique identifier would be passed
	 * back. It is this identifier that you need to use in unbinding the handler.
	 */
	this.unbind=function(eventId){
		delete (this._callData[eventId]);
	};
	
	/**
	 * Determines whether the event handler identified by the eventId is still bound.
	 * 
	 * @param eventId The id of the event handler.
	 */	
	this.isBound=function(eventId){
		return aframe.vars.isset(this._callData[eventId]);
	};
	
	this.e=function(obj){
		this._data={};
		this.setData=function(obj){
			if(typeof(this._data.data)!='object')this._data.data={};
			if(typeof(obj)=='object'){
				for(var prop in obj){
					this._data.data[prop]=obj[prop];
				}
			}
		}
		this.target=function(){return this._data.data.target;}
		this.timestamp=function(){return this._data.data.timestamp;}
		this.getData=function(){return this._data.data;}
		this.hasProperties=function(mixed){
			if(typeof(mixed)=='string')mixed=mixed.split(',');
			if(typeof(mixed)=='array'){
				var flag=true;
				for(var i=0;i=mixed.length;i++){
					if(typeof(this._data.data[mixed[i]])=='undefined')flag=false;
				}
				return flag;
			}else{
				return false
			}
		}
		this.setData(obj);
	}
	
	
	/**
	 * Create an event object. This is used internally to create the object that will be passed
	 * to the relevant event handlers.
	 * 
	 * @param target Denotes the target or source of the event. Useful if the event handler needs to 
	 * access it.
	 * @param data An object containing additional information that the event handler may make use of.
	 */
	this.createEvent=function(target,data){
		var evt={
			'target'		:target,
			'timestamp'		:(new Date()).getTime(),
			'data'			:data
		};
		return evt;
	}
	
	/**
	 * A special instance of the eventObject containing more tightly formatted information for the
	 * purposes of error & exception handling.
	 * 
	 * @param target The target or source of the event.
	 * @param errorId An ID identifying the particular error.
	 * @param errorName The title, name or summary of the error.
	 * @param errorMessage The full description of the error.
	 */
	this.createErrorEvent=function(target,errorId,errorName,errorMessage){
		var evt=this.createEvent(target,{'err':errorId,'name':errorName,'message':errorMessage});
		return evt;
	}
	
	/**
	 * Trigger an event. This function will trigger the named event and fire all handlers that
	 * have been bound to it. If the _cfg.restrictUnregisteredEvents property is set to true,
	 * unregistered events will not be handled.
	 * 
	 * @param eventName The name of the event to trigger.
	 * @param eventObject The eventObject that will be passed as parameter to the event handler
	 * functions.
	 */
	this.trigger=function(eventName,eventObject){
		eventObject=typeof(eventObject)=='undefined'?{}:eventObject;
		var evt=this.createEvent(eventObject.target,eventObject.data);
		var cleanup=new Array();
		if(!aframe.vars.isset(this._bindings[eventName]))return evt;
		for(var i=0; i<this._bindings[eventName].length; i++){
			var runfunc=this._callData[this._bindings[eventName][i]];
			if(aframe.vars.isset(runfunc)){
				this._exec(runfunc,evt);
			}else{
				cleanup.push(i);
			}
		}
		
		//Cleanup Cycle;
		for(var i=0;i<cleanup.length; i++)delete(this._bindings[eventName][cleanup[i]]);
		
		return evt;
	};
	
	/** 
	 * @private
	 * The _exec function is an internal function meant to handle the actual execution of
	 * the event handlers. It is used by the trigger method.
	 *  
	 * */
	this._exec=function(fn,eventObject){
		var e=eventObject;
		var func=function(){};
		switch(fn.type){
			case 'string':
				try{
					eval('func='+fn.fn+'(e);');
				}catch(e){
					//TODO: Trigger a system error if the function cannot be executed
				}
				break;
			case 'function':
				func=fn.fn
				try{
					func(eventObject);
				}catch(e){
					//TODO: Trigger a system error when the function cannot be called
				}
				break;
			default:
				return;
				break;
		}
	}
}

/** @namespace */
aframe.vars=new function(){
	
	
	/**
	 * Test whether the passed variable is a string.
	 * 
	 * @param mixed Mixed variable
	 */
	this.is_string=function(mixed){
		return(typeof(mixed)=='string');
	};
	
	
	
	/**
	 * Test whether the passed variable is set.
	 * 
	 * @param mixed Mixed variable.
	 */
	this.isset=function(mixed){
		//return ('made it here');
		return(typeof(mixed)!='undefined');
	};
	
	
	
	/**
	 * Test whether the passed variable is empty.
	 * 
	 * @param mixed Mixed variable.
	 */
	this.is_empty=function(mixed){
		if(!this.isset(mixed))return true;
		var t=new String(mixed);
		return t=='';
	};	
	
	
	
	/**
	 * Test whether the passed variable is boolean true
	 * 
	 * @param variable Mixed Variable.
	 */
	this.is_true=function(variable){
		var ret=false;
		if(arguments.length>1 && typeof[variable]=='object'){
			if(this.isset(arguments[0],arguments[1])){
				if(arguments[0][arguments[1]]==true) ret=true;
			}
		}else{
			if(this.isset(variable)){
				if(variable==true) ret=true;
			}
		}
		return ret;
	}
	
	
	
	/**
	 * Test whether the passed variable is an object.
	 * 
	 * @param variable Mixed Variable.
	 */
	this.is_object=function(variable){
		return typeof(variable)=='object';
	};

	
	
	/**
	 * Test whether the passed variable is an array.
	 * 
	 * @param mixed_var Mixed Variable.
	 */
	this.is_array=function(mixed_var) {
	    var key = '';
	    if (!mixed_var)return false;
	 
	    if (typeof mixed_var === 'object') {
	        if (mixed_var.propertyIsEnumerable('length') || typeof mixed_var.length !== 'number') {
	            return false;
	        }
	        return true;
	    }
	    return false;
	}

	
	
	/**
	 * Test whether the passed variable is a function.
	 * 
	 * @param variable Mixed variable.
	 */
	this.is_function=function(variable){
		return typeof(variable)=='function';
	};
	
	
	
	/**
	 * Get the variable type.
	 * 
	 * @param variable Mixed Variable.
	 */
	this.get_type=function(variable){
		var type=typeof(variable);
		if(type=='object' && type!='undefined'){
			type=variable.toString();
			if(type=='undefined' || type=='' || type==variable)return 'unknown';
			if(type=='undefined')return 'unknown';
			type=new String(variable.toString().split(' ')[1]);
			type=type.substr(0,type.length-1).toLowerCase();
		}
		return type;
	}

	
	
	/**
	 * Get the length of a string.
	 * 
	 * @param mixed Mixed variable.
	 */
	this.strlen=function(mixed){
		return (new String(mixed)).length;
	};
	
	
	
	/**
	 * Turn the passed variable into a string.
	 * 
	 * @param mixed Mixed Variable.
	 */
	this.stringify=function(mixed){
		return (new String(mixed)).toString();
	}
	
	
	/**
	 * Return the first defined argument
	 * 
	 * @param variable[x] Any number of variables.
	 */
	this.getDefault=function(){
		for(var i=0; i<arguments.length; i++){
			if(arguments[i]!=undefined)return arguments[i];
		}
		return undefined;
	};
	
	
	
	/**
	 * Return a random number between the minimun and maximum values.
	 * 
	 * @param min The minimum value to be returned
	 * @param max The maximum value to be returned
	 */
	this.rand=function(min,max){
		min=new Number(this.getDefault(min,0));
		max=new Number(this.getDefault(max,100000000));
		var scope=max-min;
		var rnd=Math.ceil((Math.random()*scope)+min);
		return rnd;
	}
}

/**
 * The debug namespace contains shortcuts to generating system events 
 * meant to be captured by the aframe.firebug handlers if they have been initialized.
 * 
 * @namespace
 */
aframe.debug=new function(){
	this.error=function(title,message){
		aframe.events.trigger('SYSTEM.ERROR',{data:{name:'###ERROR: '+aframe.vars.stringify(title),message:message}});
	}
	this.trace=function(title){
		aframe.events.trigger('SYSTEM.TRACE',{data:{name:'###TRACE: '+aframe.vars.stringify(title),message:''}});
	}
	this.inspectNode=function(title,DOMnode){
		aframe.events.trigger('SYSTEM.INSPECTNODE',{data:{name:'###INSPECTNODE: '+aframe.vars.stringify(title),message:DOMnode}});
	}
	this.inspect=function(title,mixed){
		aframe.events.trigger('SYSTEM.DEBUG',{data:{name:'###INSPECT: '+aframe.vars.stringify(title),message:mixed}});
	}
	this.info=function(title,message){
		aframe.events.trigger('SYSTEM.NOTICE',{data:{name:'###INFO: '+aframe.vars.stringify(title),message:message}});
	}
	this.warn=function(title,message){
		aframe.events.trigger('SYSTEM.WARNING',{data:{name:'###WARNING: '+aframe.vars.stringify(title),message:message}});
	}
	this.startGroup=function(title){
		aframe.firebug.startGroup(title);
	}
	this.endGroup=function(title){
		aframe.firebug.endGroup();
	}
}

/** 
 * This object is a storage space for system configuration options. 
 * <p />
 * 
 * @author Mark Holtzhausen
 * @since 0.1 Apr 7, 2009 [4:17:00 PM]
 * @version 0.1
 * @namespace
 **/
aframe.dom=new function(){
	this.defaultBehaviours={
		show:function(){this.style.display=(this.get('display_before_hide')||'');return this;},
		hide:function(){
			if(!this.isset('display_before_hide')){
				this.set('display_before_hide',this.style.display);
			}
			this.style.display='none';
			return this;
		},
		set:function(varName,value){aframe.dom.meta.write(this,varName,value);},
		get:function(varName){return aframe.dom.meta.read(this,varName);},
		isset:function(varName){return aframe.dom.meta.isset(this,varName);}
	}
	
	this.refreshWindowSize=function(){
		alert('here');
		try{
			window.resizeBy(1,1);window.resizeBy(-1,-1);
		}catch(E){};
	}
	
 	/**
	 * Get the ID of the passed DOM element. If no id exists, an ID will be created and then passed back.
	 * 
	 * @param elem A DOM node.
	 */
	this.id=function(elem){
		elem=this.element(elem);
		if(typeof(elem.id)=='undefined'){
			elem.id=aframe.uniqueId('el_');
		}
		if(elem.id=='')elem.id=aframe.uniqueId('el_');
		return elem.id;
	}
	
	/**
	 * Get the element (Alias to document.getElementById())
	 * 
	 * @param element This could be the id of an element or an element itself. If no element was found
	 * it will return an empty object.
	 * @param defaultobject If no object was found it will first try passing the defaultobject.
	 * If no defaultobject was passed and the element does not resolve, an empty object will be passed back. 
	 */
	this.element=function(element,defaultobject){
		var defautobject=(defaultobject==undefined)?true:defaultobject;
		if(typeof(element)!=='object')element=document.getElementById(element);
		if(defaultobject){
			if(typeof(defaultobject)=='object')element=defaultobject;
			if(element===undefined || element===null)var elem={};
		}
		return element;
	}
	
	this.extend=function(element,funct){
		this._doExtend(element,this.defaultBehaviours);
		this._doExtend(element,funct||{});
	}
	
	this._doExtend=function(element,funct){
		if(typeof(element.length)=='undefined')element=new Array(element);
		funct=funct||{};
		for(var f in funct){
			for(var e=0; e<element.length; e++){
				if(typeof(element[e][f])=='undefined'){
					element[e][f]=funct[f];
				}
			}
		}
	}
	


	/**
	 * Apply a function to each element in the array. If a css3 selector is passed instead of an array
	 * of elements, the selector will be used to find elements satisfying the criteria. The function
	 * given will be passed an DOM element node as first parameter.
	 * @method
	 * @param {mixed} mixed			A CSS3 selector or an array of DOM Elements
	 * @returns {Array} Elements resulting from the CSS3 selector filter or the original array of elements
	 */
	this.apply=function(mixed,applyFunction){
		var elems;
		if(typeof(mixed)=='object')elems=mixed;
		if(typeof(elems)=='undefined')elems=aframe.select(mixed);
		if(typeof(applyFunction)=='function'){
			for(var i in elems){
				applyFunction(elems[i]);
			}
		}
		return elems;
	}
 	
	this.insertAfter=function(){}
	this.insertBefore=function(){}
	this.wrap=function(){}
	this.remove=function(){}
	this.css=function(element/*,cssObject*/){}
 }

aframe.dom.state=new function(){}

/**
 * MetaData for DOM Elements. Certain browsers do not allow the extension of DOM objects with
 * additional properties or methods. This is a workaround by which meta-data is stored in a separate
 * memory location and organized by element id. As you probably know by now, the aframe.dom.id() function will
 * get the id of any element you pass to it. If it has no id already, a random unique id will be assigned.
 * With this knowledge, it is easy to see how the aframe.dom.meta functions can apply themselves to any DOM object
 */
aframe.dom.meta=new function(){
	this._data={}
	/**
	 * Write metadata to a DOM element.
	 * @method
	 * @param {DOM Node} element The element to which to attach the metadata.
	 * @param {String} varName	The name of the variable to store.
	 * @param {mixed} varValue	The value of the metadata to store.
	 */
	this.write=function(element,varName,varValue){
		var data=this._getMetaDataObject(element);
		data[varName]=varValue;
	}
	
	/**
	 *Read metadate from a DOM element.
	 *@method
	 *@param {DOM Node} element The element from which to get the metadata.
	 *@param {String} varName The name of the variable to fetch.
	 *@returns {mixed} The metadata stored against the varName for the element.
	 */
	this.read=function(element,varName){
		var data=this._getMetaDataObject(element);
		return data[varName];
	}
	
	/**
	 * Clear all metadata for an element.
	 * @method
	 * @param {DOM Node} element The element you wish to clear of metadata.
	 */
	this.clear=function(element){
		var data=this._getMetaDataObject(element);
		data={};
	}
	
	this.isset=function(element,varName){
		var data=this._getMetaDataObject(element);
		return (typeof(data[varName])!='undefined');
	}
	
	/**
	 * Returns the MetaData object associated with the passed element
	 * @private
	 */
	this._getMetaDataObject=function(element){
		element=aframe.dom.element(element);
		var id=aframe.dom.id(element);
		if(typeof(this._data[id])!='object')this._data[id]={};
		return this._data[id];
	}
}

/**
 * @namespace
 */
aframe.dom.method=new function(){}

/**
 * @namespace
 */
aframe.dom.form=new function(){}

/**
 * The Ajax communications library. Here you will find several standard functionalities for ajax
 * interaction. 
 * @namespace
 */
aframe.ajax=new function(){
	this.get=function(url,params,success_callback,failure_callback){
		params['url']=url;
		params['onSuccess']=(function(that){return function(r){that(r.responseText);}})(success_callback);
		params['onError']=(function(that){return function(r){that(r.responseText);}})(failure_callback);
		aframe.ajax._engine.get(params);
	}
	this.post=function(url,params,success_callback,failure_callback){
		params['url']=url;
		params['onSuccess']=(function(that){return function(r){that(r.responseText);}})(success_callback);
		params['onError']=(function(that){return function(r){that(r.responseText);}})(failure_callback);
		aframe.ajax._engine.post(params);
	}
	this.get_async=function(url,params,success_callback,failure_callback){
		params['url']=url;
		params['async']=false;
		params['onSuccess']=(function(that){return function(r){that(r.responseText);}})(success_callback);
		params['onError']=(function(that){return function(r){that(r.responseText);}})(failure_callback);
		aframe.ajax._engine.get(params);
	}
	this.post_async=function(url,params,success_callback,failure_callback){
		params['url']=url;
		params['async']=false;
		params['onSuccess']=(function(that){return function(r){that(r.responseText);}})(success_callback);
		params['onError']=(function(that){return function(r){that(r.responseText);}})(failure_callback);
		aframe.ajax._engine.post(params);
	}
}

/** 
 * Firebug Integration. This component allows developer integration with firebug. Use the configuration settings
 * to hook into events and map the eventObject members to function parameters for firebug messages.
 * <p />
 * 
 * @author Mark Holtzhausen
 * @since 2.0 Apr 8, 2009 [1:50:44 PM]
 * @version 2.0
 * @namespace
 **/
aframe.firebug=new function(){
	this._cfg={
		autoTrace:false
	}
 		/**
 		 * Used to configure pre-set bindings to system events. To install the automatic bindings use
 		 * aFrame.firebug.init()
 		 * @config
 		 * @example
 		 * \{
 		 *		'event'		:[The name of the event to bind]  
 		 *		'title'		:[A function, passed an eventObject, that returns the desired title]
 		 *		'message'	:[A function, passed an eventObject, that returns the desired title]
 		 *		'dispatch'	:[The name of an aframe.firebug method]
 		 * \}
 		 * @see #.init
 		 **/
 	this.map=new Array(
 		{
 			'event':'SYSTEM.ERROR',
 			'title':function(eventObject){return eventObject.data.name;},
 			'message': function(eventObject){return eventObject.data.message;},
 			'dispatch': 'error'
 		},
 		{
 			'event':'SYSTEM.NOTICE',
 			'title':function(eventObject){return eventObject.data.name;},
 			'message': function(eventObject){return eventObject.data.message;},
 			'dispatch': 'info'
 		},
 		{
 			'event':'SYSTEM.WARNING',
 			'title':function(eventObject){return eventObject.data.name;},
 			'message': function(eventObject){return eventObject.data.message;},
 			'dispatch': 'warning'
 		},
 		{
 			'event':'SYSTEM.DEBUG',
 			'title':function(eventObject){return eventObject.data.name;},
 			'message': function(eventObject){return eventObject.data.message;},
 			'dispatch': 'debug'
 		},
 		{
 			'event':'SYSTEM.TRACE',
 			'title':function(eventObject){return eventObject.data.name;},
 			'message': function(eventObject){return eventObject.data.message;},
 			'dispatch': 'trace'
 		},
 		{
 			'event':'SYSTEM.INSPECTNODE',
 			'title':function(eventObject){return eventObject.data.name;},
 			'message': function(eventObject){return eventObject.data.message;},
 			'dispatch': 'debugNode'
 		}
 		
 	);

	/**
	 * Initializes the pre-set bindings to system events. The reason this has to be called and is not automatically enabled
	 * is to ensure that debug info doesn't show up automatically, only when initialized this way or when the firebug
	 * commands are called directly.
	 * 
	 * @method
	 * @param
	 */
 	this.init=function(){
		var dispatch;
		var title;
		var message;
		for(var i=0; i<this.map.length; i++){
			dispatch='event_'+this.map[i].dispatch;
			title=this.map[i].title;
			message=this.map[i].message;
			if(typeof(typeof(title)=='function') && typeof(message)=='function'){
				aframe.events.bind(this.map[i].event,(function(that,title,message,dispatch){
					return function(eventObject){
						that[dispatch](title(eventObject),message(eventObject),eventObject);
					}
				})(this,title,message,dispatch))
			}
		}
	}
	
	/**
	 * Used to manufacture the title of a message using the given title, timestamp and trigger target
	 * @private
	 */
	this._makeHeading=function(title,eventObject){
		var ptitle='';
		if(typeof(eventObject!='undefined')){
			var d=aframe.Date.properties(eventObject.timestamp);
			ptitle='['+d.hour+'h'+d.min+'('+d.sec+'.'+d.millisec+'s)]';
			if(eventObject.target!=undefined){
				ptitle+='{'+eventObject.target.tagName+'#'+aframe.vars.id(eventObject.target)+'}';
			}
			ptitle+=' ';
		}
		title=ptitle+title;
		return title;
	}
	
	this._autoTrace=function(title){
		title=aframe.vars.getDefault(title,'');
		if(this._cfg.autoTrace){
			window.console.groupCollapsed('AUTOTRACE::'+title);
			window.console.trace();
			window.console.groupEnd();
		}
	}
	
	/**
	 * Print a warning message to the firebug console.
	 * 
	 * @method
	 * @param {String} title 	The title of the message to be displayed
	 * @param {Mixed} message	The message to be printed.
	 * @param {Object} eventObject	Optional eventObject if the function is called via an event_binding. calling via aframe.events is encouraged.
	 */
	this.event_warning=function(title,message,eventObject){
		if(this.hasFirebug()){
			window.console.warn(this._makeHeading(title,eventObject));
			window.console.log(message);
			this._autoTrace('event_warning');
		}
	}

	
	/**
	 * Print a debug message to the firebug console.
	 * 
	 * @method
	 * @param {String} title 	The title of the message to be displayed
	 * @param {Mixed} message	The message to be printed.
	 * @param {Object} eventObject	Optional eventObject if the function is called via an event_binding. calling via aframe.events is encouraged.
	 */
	this.event_debug=function(title,message,eventObject){
		if(this.hasFirebug()){
			this.startGroup(this._makeHeading(title,eventObject),undefined,false);
			window.console.dir(message);
			this._autoTrace('event_debug');
			this.endGroup(false);
		}
	}
	
	
	/**
	 * Start a firebug console grouping
	 * 
	 * @method
	 * @param {String} groupTitle		The title of the collapsible group area.
	 * @param {Boolean} collapsed		Start the group area in its collapsed state. Default=true
	 */
	this.startGroup=function(groupTitle,collapsed,showautoTrace){
		showautoTrace=aframe.vars.getDefault(showautoTrace,true);
		if(typeof(collapsed)=='undefined')collapsed=true;
		collapsed=collapsed?'groupCollapsed':'group';
		if(this.hasFirebug()){
			window.console[collapsed](groupTitle);
			if(showautoTrace==true)this._autoTrace('startGroup');
		}
	}

	/**
	 * End a firebug console grouping area
	 * 
	 * @method
	 * @see #.startGroup
	 */
	this.endGroup=function(showautoTrace){
		showautoTrace=aframe.vars.getDefault(showautoTrace,true);
		if(this.hasFirebug()){
			window.console.groupEnd();
			if(showautoTrace==true)this._autoTrace('endGroup');
		}
	}

	/**
	 * Print a location trace to the firebug console.
	 * 
	 * @method
	 * @param {String} title 	The title of the message to be displayed
	 * @param {Mixed} message	The message to be printed.
	 * @param {Object} eventObject	Optional eventObject if the function is called via an event_binding. calling via aframe.events is encouraged.
	 */
	this.event_trace=function(title,message,eventObject){
		if(this.hasFirebug()){
			window.console.info(this._makeHeading(title,eventObject));
			window.console.trace(message);
		}
	}

	/**
	 * Inspect a DOM/XML Node in the firebug console.
	 * 
	 * @method
	 * @param {String} title 	The title of the message to be displayed
	 * @param {Mixed} message	The node to be inspected.
	 * @param {Object} eventObject	Optional eventObject if the function is called via an event_binding. calling via aframe.events is encouraged.
	 */
	this.event_debugNode=function(title,message,eventObject){
		if(this.hasFirebug()){
			window.console.info(this._makeHeading(title,eventObject));
			window.console.dirxml(message);
			this._autoTrace('event_debugNode');
		}
	}
	
	/**
	 * Print an error message to the firebug console.
	 * 
	 * @method
	 * @param {String} title 	The title of the message to be displayed
	 * @param {Mixed} message	The message to be printed.
	 * @param {Object} eventObject	Optional eventObject if the function is called via an event_binding. calling via aframe.events is encouraged.
	 */
	this.event_error=function(title,message,eventObject){
		if(this.hasFirebug()){
			window.console.error(this._makeHeading(title,eventObject));
			window.console.log(message);
			this.startGroup('Error Trace (aFrame tracing should start below the trigger() line)',true,false);
			window.console.trace();
			this.endGroup(false);
		}
	}

	/**
	 * Print an info message to the firebug console.
	 * 
	 * @method
	 * @param {String} title 	The title of the message to be displayed
	 * @param {Mixed} message	The message to be printed.
	 * @param {Object} eventObject	Optional eventObject if the function is called via an event_binding. calling via aframe.events is encouraged.
	 */
	this.event_info=function(title,message,eventObject){
		if(this.hasFirebug()){
			window.console.info(this._makeHeading(title,eventObject));
			window.console.log(message);
			this._autoTrace('event_info');
		}
	}
	
	/**
	 * Determines whether firebug console is active.
	 * 
	 * @method
	 * @returns {Boolean} Firebug Console Status.
	 */
	this.hasFirebug=function(){
		return aframe.vars.isset(window.console);
	}
}

/**
 * @namespace
 */
aframe.resource=new function(){}

/**
 * @namespace
 */
aframe.app=new function(){
	this.registerClass=function(){}
	this.createApp=function(){}
	this.destroyApp=function(){}
	this.findAppsByClass=function(){}
}

/**
 * @namespace
 */
aframe.thread=new function(){}

/**
 * @namespace
 */
aframe.String=new function(){
	this.trim=function(mixed){}
	this.force=function(mixed){}
}

/**
 * @namespace
 */
aframe.String.json=new function(){
	this.decode = function(){
		var	filter, result, self, tmp;
		if($$("toString")) {
			switch(arguments.length){
				case	2:
					self = arguments[0];
					filter = arguments[1];
					break;
				case	1:
					if($[typeof arguments[0]](arguments[0]) === Function) {
						self = this;
						filter = arguments[0];
					}
					else
						self = arguments[0];
					break;
				default:
					self = this;
					break;
			};
			if(rc.test(self)){
				try{
					result = e("(".concat(self, ")"));
					if(filter && result !== null && (tmp = $[typeof result](result)) && (tmp === Array || tmp === Object)){
						for(self in result)
							result[self] = v(self, result) ? filter(self, result[self]) : result[self];
					}
				}
				catch(z){}
			}
			else {
				throw new JSONError("bad data");
			}
		};
		return result;
	};
	
	/*
	Method: encode
		encode a generic JavaScript variable into a valid JSON string.
	
	Arguments:
		[Object] - Optional generic JavaScript variable to encode if method is not an Object prototype.
	
	Returns:
		String - Valid JSON string or undefined
	
	Example [Basic]:
		>var	s = JSON.encode([1,2,3]);
		>alert(s);	// [1,2,3]
	
	Example [Prototype]:
		>Object.prototype.toJSONString = JSON.encode;
		>
		>alert([1,2,3].toJSONString());	// [1,2,3]
	*/
	this.encode = function(){
		var	self = arguments.length ? arguments[0] : this,
			result, tmp;
		if(self === null)
			result = "null";
		else if(self !== undefined && (tmp = $[typeof self](self))) {
			switch(tmp){
				case	Array:
					result = [];
					for(var	i = 0, j = 0, k = self.length; j < k; j++) {
						if(self[j] !== undefined && (tmp = JSON.encode(self[j])))
							result[i++] = tmp;
					};
					result = "[".concat(result.join(","), "]");
					break;
				case	Boolean:
					result = String(self);
					break;
				case	Date:
					result = '"'.concat(self.getFullYear(), '-', d(self.getMonth() + 1), '-', d(self.getDate()), 'T', d(self.getHours()), ':', d(self.getMinutes()), ':', d(self.getSeconds()), '"');
					break;
				case	Function:
					break;
				case	Number:
					result = isFinite(self) ? String(self) : "null";
					break;
				case	String:
					result = '"'.concat(self.replace(rs, s).replace(ru, u), '"');
					break;
				default:
					var	i = 0, key;
					result = [];
					for(key in self) {
						if(self[key] !== undefined && (tmp = JSON.encode(self[key])))
							result[i++] = '"'.concat(key.replace(rs, s).replace(ru, u), '":', tmp);
					};
					result = "{".concat(result.join(","), "}");
					break;
			}
		};
		return result;
	};
	
	/*
	Method: toDate
		transforms a JSON encoded Date string into a native Date object.
	
	Arguments:
		[String/Number] - Optional JSON Date string or server time if this method is not a String prototype. Server time should be an integer, based on seconds since 1970/01/01 or milliseconds / 1000 since 1970/01/01.
	
	Returns:
		Date - Date object or undefined if string is not a valid Date
	
	Example [Basic]:
		>var	serverDate = JSON.toDate("2007-04-05T08:36:46");
		>alert(serverDate.getMonth());	// 3 (months start from 0)
	
	Example [Prototype]:
		>String.prototype.parseDate = JSON.toDate;
		>
		>alert("2007-04-05T08:36:46".parseDate().getDate());	// 5
	
	Example [Server Time]:
		>var	phpServerDate = JSON.toDate(<?php echo time(); ?>);
		>var	csServerDate = JSON.toDate(<%=(DateTime.Now.Ticks/10000-62135596800000)%>/1000);
	
	Example [Server Time Prototype]:
		>Number.prototype.parseDate = JSON.toDate;
		>var	phpServerDate = (<?php echo time(); ?>).parseDate();
		>var	csServerDate = (<%=(DateTime.Now.Ticks/10000-62135596800000)%>/1000).parseDate();
	
	Note:
		This method accepts an integer or numeric string too to mantain compatibility with generic server side time() function.
		You can convert quickly mtime, ctime, time and other time based values.
		With languages that supports milliseconds you can send total milliseconds / 1000 (time is set as time * 1000)
	*/
	this.toDate = function(){
		var	self = arguments.length ? arguments[0] : this,
			result;
		if(rd.test(self)){
			result = new Date;
			result.setHours(i(self, 11, 2));
			result.setMinutes(i(self, 14, 2));
			result.setSeconds(i(self, 17, 2));
			result.setMonth(i(self, 5, 2) - 1);
			result.setDate(i(self, 8, 2));
			result.setFullYear(i(self, 0, 4));
		}
		else if(rt.test(self))
			result = new Date(self * 1000);
		return result;
	};
	
	/* Section: Properties - Private */
	
	/*
	Property: Private
	
	List:
		Object - 'c' - a dictionary with useful keys / values for fast encode convertion
		Function - 'd' - returns decimal string rappresentation of a number ("14", "03", etc)
		Function - 'e' - safe and native code evaulation
		Function - 'i' - returns integer from string ("01" => 1, "15" => 15, etc)
		Array - 'p' - a list with different "0" strings for fast special chars escape convertion
		RegExp - 'rc' - regular expression to check JSON strings (different for IE5 or old browsers and new one)
		RegExp - 'rd' - regular expression to check a JSON Date string
		RegExp - 'rs' - regular expression to check string chars to modify using c (char) values
		RegExp - 'rt' - regular expression to check integer numeric string (for toDate time version evaluation)
		RegExp - 'ru' - regular expression to check string chars to escape using "\u" prefix
		Function - 's' - returns escaped string adding "\\" char as prefix ("\\" => "\\\\", etc.)
		Function - 'u' - returns escaped string, modifyng special chars using "\uNNNN" notation
		Function - 'v' - returns boolean value to skip object methods or prototyped parameters (length, others), used for optional decode filter function
		Function - '$' - returns object constructor if it was not cracked (someVar = {}; someVar.constructor = String <= ignore them)
		Function - '$$' - returns boolean value to check native Array and Object constructors before convertion
	*/
	var	c = {"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\","/":"/"},
		d = function(n){return n<10?"0".concat(n):n},
		e = function(c,f,e){e=eval;delete eval;if(typeof eval==="undefined")eval=e;f=eval(""+c);eval=e;return f},
		i = function(e,p,l){return 1*e.substr(p,l)},
		p = ["","000","00","0",""],
		rc = null,
		rd = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
		rs = /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
		rt = /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
		ru = /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
		s = function(i,d){return "\\".concat(c[d])},
		u = function(i,d){
			var	n=d.charCodeAt(0).toString(16);
			return "\\u".concat(p[n.length],n)
		},
		v = function(k,v){return $[typeof result](result)!==Function&&(v.hasOwnProperty?v.hasOwnProperty(k):v.constructor.prototype[k]!==v[k])},
		$ = {
			"boolean":function(){return Boolean},
			"function":function(){return Function},
			"number":function(){return Number},
			"object":function(o){return o instanceof o.constructor?o.constructor:null},
			"string":function(){return String},
			"undefined":function(){return null}
		},
		$$ = function(m){
			function $(c,t){t=c[m];delete c[m];try{e(c)}catch(z){c[m]=t;return 1}};
			return $(Array)&&$(Object)
		};
	try{rc=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}
	catch(z){rc=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/}
}

/**
 * @namespace
 */
aframe.String.base64=new function(){

    // private property
    this._keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    this.encode=function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = rttc.utils.utf8.encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    }

    // public method for decoding
    this.decode=function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = rttc.utils.utf8.decode(output);

        return output;

    }
}

/**
 * @namespace
 */
aframe.String.utf8=new function(){
    this.encode=function (string) {
        string=new String(string);
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    // private method for UTF-8 decoding
    this.decode=function (utftext) {
        var string = "";
        var i=0;
        var c=0;
        var c1=0;
        var c2=0;
        var c3;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    };
}

/**
 * @namespace
 */
aframe.Array=new function(){}

/**
 * @namespace
 */
aframe.Date=new function(){
	this.properties=function(timestamp){
		var d=new Date(timestamp);
		var a={
			day			:'',
			month		:'',
			year		:'',
			hour		:d.getHours(),
			min			:d.getMinutes(),
			sec			:d.getSeconds(),
			millisec	:d.getMilliseconds()
		};
		return a;
	}
}

/**
 * @namespace
 */
aframe.validate=new function(){
	this.email=function(value) {
		value=new String(value);
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(reg.test(value) == false) {
			return false;
		}
		return true;
	};
	
	this.id=function(value){
		var value=new String(value);
		if(value.length!=13)return false;
		return this.luhn(value);
	};


	this.luhn=function(value){
		var num_p;
		var num_p_Idx;
		var checksum = 0;
		var value = value;
		var isValid = false;
		
		for (var i = value.length - 1;i >= 0; i--) {
		    checksum += parseInt(value.charAt(i));
		    if (i > 0) {
		          i--;
		          num_p = String((value.charAt(i) * 2));
		          for (var j = 0; j < num_p.length; j++) {
		                checksum += parseInt(num_p.charAt(j));
		          }
		    }
		}
		
		isValid = (checksum % 10 == 0);
		return isValid;	
	}
}






/**
 * The AjaxRequest class is a wrapper for the XMLHttpRequest objects which 
 * are available in most modern browsers. It simplifies the interfaces for
 * making Ajax requests, adds commonly-used convenience methods, and makes 
 * the process of handling state changes more intuitive.
 * An object may be instantiated and used, or the Class methods may be used 
 * which internally create an AjaxRequest object.
 * @private
 */
aframe.ajax._engine=function(){
  var httpObj ={};
  
  // -------------------
  // Instance properties
  // -------------------

  /**
   * Timeout period (in ms) until an async request will be aborted, and
   * the onTimeout function will be called
   */
  httpObj.timeout = null;
  
  /**
   *  Since some browsers cache GET requests via XMLHttpRequest, an
   * additional parameter called noCache will be added to
   * the request URI with a unique numeric value appended so that the requested
   * URL will not be cached.
   */
  httpObj.allowCaching = false;
  
  /**
   * The url that the request will be made to, which defaults to the current 
   * url of the window
   */
  httpObj.url = '/';
  
  /**
   * The method of the request, either GET (default), POST, or HEAD
   */
  httpObj.method = "GET";
  
  /**
   * Whether or not the request will be asynchronous. In general, synchronous 
   * requests should not be used so this should rarely be changed from true
   */
  httpObj.async = true;
  
  /**
   * The username used to access the URL
   */
  httpObj.username = null;
  
  /**
   * The password used to access the URL
   */
  httpObj.password = null;
  
  /**
   * The parameters is an object holding name/value pairs which will be 
   * added to the url for a GET request or the request content for a POST request
   */
  httpObj.parameters = new Object();
  
  /**
   * The sequential index number of this request, updated internally
   */
  httpObj.requestIndex = aframe.ajax._engine.numAjaxRequests++;
  
  /**
   * Indicates whether a response has been received yet from the server
   */
  httpObj.responseReceived = false;
  
  /**
   * The name of the group that this request belongs to, for activity 
   * monitoring purposes
   */
  httpObj.groupName = null;
  
  /**
   * The query string to be added to the end of a GET request, in proper 
   * URIEncoded format
   */
  httpObj.queryString = "";
  
  /**
   * After a response has been received, this will hold the text contents of 
   * the response - even in case of error
   */
  httpObj.responseText = null;
  
  /**
   * After a response has been received, this will hold the XML content
   */
  httpObj.responseXML = null;
  
  /**
   * After a response has been received, this will hold the status code of 
   * the response as returned by the server.
   */
  httpObj.status = null;
  
  /**
   * After a response has been received, this will hold the text description 
   * of the response code
   */
  httpObj.statusText = null;

  /**
   * An internal flag to indicate whether the request has been aborted
   */
  httpObj.aborted = false;
  
  /**
   * The XMLHttpRequest object used internally
   */
  httpObj.xmlHttpRequest = null;

  // --------------
  // Event handlers
  // --------------
  
  /**
   * If a timeout period is set, and it is reached before a response is 
   * received, a function reference assigned to onTimeout will be called
   */
  httpObj.onTimeout = null; 
  
  /**
   * A function reference assigned will be called when readyState=1
   */
  httpObj.onLoading = null;

  /**
   * A function reference assigned will be called when readyState=2
   */
  httpObj.onLoaded = null;

  /**
   * A function reference assigned will be called when readyState=3
   */
  httpObj.onInteractive = null;

  /**
   * A function reference assigned will be called when readyState=4
   */
  httpObj.onComplete = null;

  /**
   * A function reference assigned will be called after onComplete, if 
   * the statusCode=200
   */
  httpObj.onSuccess = null;

  /**
   * A function reference assigned will be called after onComplete, if 
   * the statusCode != 200
   */
  httpObj.onError = null;
  
  /**
   * If this request has a group name, this function reference will be called 
   * and passed the group name if this is the first request in the group to 
   * become active
   */
  httpObj.onGroupBegin = null;

  /**
   * If this request has a group name, and this request is the last request 
   * in the group to complete, this function reference will be called
   */
  httpObj.onGroupEnd = null;
  
  httpObj.localFile=false;

  // Get the XMLHttpRequest object itself
  httpObj.xmlHttpRequest = aframe.ajax._engine.getXmlHttpRequest();
  if (httpObj.xmlHttpRequest==null) { return null; }
  
  // -------------------------------------------------------
  // Attach the event handlers for the XMLHttpRequest object
  // -------------------------------------------------------
  httpObj.xmlHttpRequest.onreadystatechange = 
  function() {
    if (httpObj==null || httpObj.xmlHttpRequest==null) { return; }
    if (httpObj.xmlHttpRequest.readyState==1) { httpObj.onLoadingInternal(httpObj); }
    if (httpObj.xmlHttpRequest.readyState==2) { httpObj.onLoadedInternal(httpObj); }
    if (httpObj.xmlHttpRequest.readyState==3) { httpObj.onInteractiveInternal(httpObj); }
    if (httpObj.xmlHttpRequest.readyState==4) { httpObj.onCompleteInternal(httpObj); }
  };
  
  // ---------------------------------------------------------------------------
  // Internal event handlers that fire, and in turn fire the user event handlers
  // ---------------------------------------------------------------------------
  // Flags to keep track if each event has been handled, in case of 
  // multiple calls (some browsers may call the onreadystatechange 
  // multiple times for the same state)
  httpObj.onLoadingInternalHandled = false
  httpObj.onLoadedInternalHandled = false
  httpObj.onInteractiveInternalHandled = false
  httpObj.onCompleteInternalHandled = false
  httpObj.onLoadingInternal = 
    function() {
      if (httpObj.onLoadingInternalHandled) { return; }
      aframe.ajax._engine.numActiveAjaxRequests++;
      if (aframe.ajax._engine.numActiveAjaxRequests==1 && typeof(window['AjaxRequestBegin'])=="function") {
        AjaxRequestBegin();
      }
      if (httpObj.groupName!=null) {
        if (typeof(aframe.ajax._engine.numActiveAjaxGroupRequests[httpObj.groupName])=="undefined") {
          aframe.ajax._engine.numActiveAjaxGroupRequests[httpObj.groupName] = 0;
        }
        aframe.ajax._engine.numActiveAjaxGroupRequests[httpObj.groupName]++;
        if (aframe.ajax._engine.numActiveAjaxGroupRequests[httpObj.groupName]==1 && typeof(httpObj.onGroupBegin)=="function") {
          httpObj.onGroupBegin(httpObj.groupName);
        }
      }
      if (typeof(httpObj.onLoading)=="function") {
        httpObj.onLoading(httpObj);
      }
      httpObj.onLoadingInternalHandled = true;
    };
  httpObj.onLoadedInternal = 
    function() {
      if (httpObj.onLoadedInternalHandled) { return; }
      if (typeof(httpObj.onLoaded)=="function") {
        httpObj.onLoaded(httpObj);
      }
      httpObj.onLoadedInternalHandled = true;
    };
  httpObj.onInteractiveInternal = 
    function() {
      if (httpObj.onInteractiveInternalHandled) { return; }
      if (typeof(httpObj.onInteractive)=="function") {
        httpObj.onInteractive(httpObj);
      }
      httpObj.onInteractiveInternalHandled = true;
    };
  httpObj.onCompleteInternal = 
    function() {
      if (httpObj.onCompleteInternalHandled || httpObj.aborted) { return; }
      httpObj.onCompleteInternalHandled = true;
      aframe.ajax._engine.numActiveAjaxRequests--;
      if (aframe.ajax._engine.numActiveAjaxRequests==0 && typeof(window['AjaxRequestEnd'])=="function") {
        AjaxRequestEnd(httpObj.groupName);
      }
      if (httpObj.groupName!=null) {
        aframe.ajax._engine.numActiveAjaxGroupRequests[httpObj.groupName]--;
        if (aframe.ajax._engine.numActiveAjaxGroupRequests[httpObj.groupName]==0 && typeof(httpObj.onGroupEnd)=="function") {
          httpObj.onGroupEnd(httpObj.groupName);
        }
      }
      httpObj.responseReceived = true;
      httpObj.status = httpObj.xmlHttpRequest.status;
      httpObj.statusText = httpObj.xmlHttpRequest.statusText;
      httpObj.responseText = httpObj.xmlHttpRequest.responseText;
      httpObj.responseXML = httpObj.xmlHttpRequest.responseXML;
      if (typeof(httpObj.onComplete)=="function") {
        httpObj.onComplete(httpObj);
      }
      if ((httpObj.xmlHttpRequest.status==200||httpObj.xmlHttpRequest.status==0) && typeof(httpObj.onSuccess)=="function") {
      	if(httpObj.xmlHttpRequest.status==0){
      		httpObj.localFile=true;
        	httpObj.onSuccess(httpObj);
      	}else{
        	httpObj.onSuccess(httpObj);
      	}
      }
      else if (typeof(httpObj.onError)=="function") {
        httpObj.onError(httpObj);
      }

      // Clean up so IE doesn't leak memory
      delete httpObj.xmlHttpRequest['onreadystatechange'];
      httpObj.xmlHttpRequest = null;
    };
  httpObj.onTimeoutInternal = 
    function() {
      if (httpObj!=null && httpObj.xmlHttpRequest!=null && !httpObj.onCompleteInternalHandled) {
        httpObj.aborted = true;
        httpObj.xmlHttpRequest.abort();
        aframe.ajax._engine.numActiveAjaxRequests--;
        if (aframe.ajax._engine.numActiveAjaxRequests==0 && typeof(window['AjaxRequestEnd'])=="function") {
          AjaxRequestEnd(httpObj.groupName);
        }
        if (httpObj.groupName!=null) {
          aframe.ajax._engine.numActiveAjaxGroupRequests[httpObj.groupName]--;
          if (aframe.ajax._engine.numActiveAjaxGroupRequests[httpObj.groupName]==0 && typeof(httpObj.onGroupEnd)=="function") {
            httpObj.onGroupEnd(httpObj.groupName);
          }
        }
        if (typeof(httpObj.onTimeout)=="function") {
          httpObj.onTimeout(httpObj);
        }
      // Opera won't fire onreadystatechange after abort, but other browsers do. 
      // So we can't rely on the onreadystate function getting called. Clean up here!
      delete httpObj.xmlHttpRequest['onreadystatechange'];
      httpObj.xmlHttpRequest = null;
      }
    };

  // ----------------
  // Instance methods
  // ----------------
  /**
   * The process method is called to actually make the request. It builds the
   * querystring for GET requests (the content for POST requests), sets the
   * appropriate headers if necessary, and calls the 
   * XMLHttpRequest.send() method
  */
  httpObj.process = 
    function() {
      if (httpObj.xmlHttpRequest!=null) {
        // Some logic to get the real request URL
        if (!httpObj.allowCaching && httpObj.method=="GET") {
          httpObj.parameters["noCache"] =aframe.uniqueId()+httpObj.requestIndex;
        }
        var content = null; // For POST requests, to hold query string
        for (var i in httpObj.parameters) {
          if (httpObj.queryString.length>0) { httpObj.queryString += "&"; }
          httpObj.queryString += encodeURIComponent(i) + "=" + encodeURIComponent(httpObj.parameters[i]);
        }
        if (httpObj.method=="GET") {
          if (httpObj.queryString.length>0) {
            httpObj.url += ((httpObj.url.indexOf("?")>-1)?"&":"?") + httpObj.queryString;
          }
        }
        httpObj.xmlHttpRequest.open(httpObj.method,httpObj.url,httpObj.async,httpObj.username,httpObj.password);
        if (httpObj.method=="POST") {
          if (typeof(httpObj.xmlHttpRequest.setRequestHeader)!="undefined") {
            httpObj.xmlHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          }
          content = httpObj.queryString;
        }
        if (httpObj.timeout>0) {
          setTimeout(httpObj.onTimeoutInternal,httpObj.timeout);
        }
        httpObj.xmlHttpRequest.send(content);
        if(httpObj.async!=true)httpObj.onCompleteInternal();
      }
    };

  /**
   * An internal function to handle an Object argument, which may contain
   * either AjaxRequest field values or parameter name/values
   */
  httpObj.handleArguments = 
    function(args) {
      for (var i in args) {
        // If the AjaxRequest object doesn't have a property which was passed, treat it as a url parameter
        if (typeof(httpObj[i])=="undefined") {
          httpObj.parameters[i] = args[i];
        }
        else {
          httpObj[i] = args[i];
        }
      }
    };

  /**
   * Returns the results of XMLHttpRequest.getAllResponseHeaders().
   * Only available after a response has been returned
   */
  httpObj.getAllResponseHeaders =
    function() {
      if (httpObj.xmlHttpRequest!=null) {
        if (httpObj.responseReceived) {
          return httpObj.xmlHttpRequest.getAllResponseHeaders();
        }
        alert("Cannot getAllResponseHeaders because a response has not yet been received");
      }
    };

  /**
   * Returns the the value of a response header as returned by 
   * XMLHttpRequest,getResponseHeader().
   * Only available after a response has been returned
   */
  httpObj.getResponseHeader =
    function(headerName) {
      if (httpObj.xmlHttpRequest!=null) {
        if (httpObj.responseReceived) {
          return httpObj.xmlHttpRequest.getResponseHeader(headerName);
        }
        alert("Cannot getResponseHeader because a response has not yet been received");
      }
    };

  return httpObj;
}

// ---------------------------------------
// Static methods of the AjaxRequest class
// ---------------------------------------

/**
 * Returns an XMLHttpRequest object, either as a core object or an ActiveX 
 * implementation. If an object cannot be instantiated, it will return null;
 */
aframe.ajax._engine.getXmlHttpRequest = function() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    // Based on http://jibbering.com/2002/4/httprequest.html
    /*@cc_on @*/
    /*@if (@_jscript_version >= 5)
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (E) {
        return null;
      }
    }
    @end @*/
  }
  else {
    return null;
  }
};

/**
 * See if any request is active in the background
 */
aframe.ajax._engine.isActive = function() {
  return (aframe.ajax._engine.numActiveAjaxRequests>0);
};

/**
 * Make a GET request. Pass an object containing parameters and arguments as 
 * the second argument.
 * These areguments may be either AjaxRequest properties to set on the request 
 * object or name/values to set in the request querystring.
 */
aframe.ajax._engine.get = function(args) {
  aframe.ajax._engine.doRequest("GET",args);
};

/**
 * Make a POST request. Pass an object containing parameters and arguments as 
 * the second argument.
 * These areguments may be either AjaxRequest properties to set on the request 
 * object or name/values to set in the request querystring.
 */
aframe.ajax._engine.post = function(args) {
  aframe.ajax._engine.doRequest("POST",args);
};

/**
 * The internal method used by the .get() and .post() methods
 */
aframe.ajax._engine.doRequest = function(method,args) {
  if (typeof(args)!="undefined" && args!=null) {
    var myRequest = new aframe.ajax._engine();
    myRequest.method = method;
    myRequest.handleArguments(args);
    myRequest.process();
  }
}  ;

/**
 * Submit a form. The requested URL will be the form's ACTION, and the request 
 * method will be the form's METHOD.
 * Returns true if the submittal was handled successfully, else false so it 
 * can easily be used with an onSubmit event for a form, and fallback to 
 * submitting the form normally.
 */
aframe.ajax._engine.submit = function(theform, args) {
  var myRequest = new aframe.ajax._engine();
  if (myRequest==null) { return false; }
  var serializedForm = aframe.ajax._engine.serializeForm(theform);
  myRequest.method = theform.method.toUpperCase();
  myRequest.url = theform.action;
  myRequest.handleArguments(args);
  myRequest.queryString = serializedForm;
  myRequest.process();
  return true;
};

/**
 * Serialize a form into a format which can be sent as a GET string or a POST 
 * content.It correctly ignores disabled fields, maintains order of the fields 
 * as in the elements[] array. The 'file' input type is not supported, as 
 * its content is not available to javascript. This method is used internally
 * by the submit class method.
 * @private
 */
aframe.ajax._engine.serializeForm = function(theform) {
  var els = theform.elements;
  var len = els.length;
  var queryString = "";
  this.addField = 
    function(name,value) { 
      if (queryString.length>0) { 
        queryString += "&";
      }
      queryString += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    };
  for (var i=0; i<len; i++) {
    var el = els[i];
    if (!el.disabled) {
      switch(el.type) {
        case 'text': case 'password': case 'hidden': case 'textarea': 
          this.addField(el.name,el.value);
          break;
        case 'select-one':
          if (el.selectedIndex>=0) {
            this.addField(el.name,el.options[el.selectedIndex].value);
          }
          break;
        case 'select-multiple':
          for (var j=0; j<el.options.length; j++) {
            if (el.options[j].selected) {
              this.addField(el.name,el.options[j].value);
            }
          }
          break;
        case 'checkbox': case 'radio':
          if (el.checked) {
            this.addField(el.name,el.value);
          }
          break;
      }
    }
  }
  return queryString;
};

// -----------------------
// Static Class variables
// -----------------------

/**
 * The number of total AjaxRequest objects currently active and running
 */
aframe.ajax._engine.numActiveAjaxRequests = 0;

/**
 * An object holding the number of active requests for each group
 */
aframe.ajax._engine.numActiveAjaxGroupRequests = new Object();

/**
 * The total number of AjaxRequest objects instantiated
 */
aframe.ajax._engine.numAjaxRequests = 0;




/**
 * The sizzle css3 selector framework.
 * <p />
 * @method
 * @param {String} cssSelector	The selector (made up of formats displayed in the example code) to select dom elements.
 * @param {Optional DOM Element} context	The DOM Node under which to start searching.
 * @example
 * <pre>
 * Pattern					Meaning
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------
 * *				any element
 * E				an element of type E
 * E[foo]				an E element with a "foo" attribute
 * E[foo="bar"]			an E element whose "foo" attribute value is exactly equal to "bar"
 * E[foo~="bar"]			an E element whose "foo" attribute value is a list of whitespace-separated values, one of which is exactly equal to "bar"
 * E[foo^="bar"]			an E element whose "foo" attribute value begins exactly with the string "bar"
 * E[foo$="bar"]			an E element whose "foo" attribute value ends exactly with the string "bar"
 * E[foo*="bar"]			an E element whose "foo" attribute value contains the substring "bar"
 * E[hfoo|="en"]			an E element whose "foo" attribute has a hyphen-separated list of values beginning (from the left) with "en"
 * E:root				an E element, root of the document
 * E:nth-child(n)			an E element, the n-th child of its parent
 * E:nth-last-child(n)		an E element, the n-th child of its parent, counting from the last one
 * E:nth-of-type(n)		an E element, the n-th sibling of its type
 * E:nth-last-of-type(n)		an E element, the n-th sibling of its type, counting from the last one
 * E:first-child			an E element, first child of its parent
 * E:last-child			an E element, last child of its parent
 * E:first-of-type			an E element, first sibling of its type
 * E:last-of-type			an E element, last sibling of its type
 * E:only-child			an E element, only child of its parent
 * E:only-of-type			an E element, only sibling of its type
 * E:empty				an E element that has no children (including text nodes)
 * E:link				an E element being the source anchor of a hyperlink of which the target is not yet visited (:link) or already visited (:visited)
 * E:visited			an E element during certain user actions
 * E:active			an E element during certain user actions
 * E:hover				an E element during certain user actions
 * E:focus				an E element during certain user actions
 * E:target			an E element being the target of the referring URI
 * E:lang(fr)			an element of type E in language "fr" (the document language specifies how language is determined)
 * E:enabled			a user interface element E which is enabled
 * E:disabled			a user interface element E which is disabled
 * E:checked			a user interface element E which is checked (for instance a radio-button or checkbox)
 * E::first-line			the first formatted line of an E element
 * E::first-letter			the first formatted letter of an E element
 * E::before			generated content before an E element
 * E::after			generated content after an E element
 * E.warning			an E element whose class is "warning" (the document language specifies how class is determined).
 * E#myid				an E element with ID equal to "myid".
 * E:not(s)			an E element that does not match simple selector s
 * E F				an F element descendant of an E element
 * E > F				an F element child of an E element
 * E + F				an F element immediately preceded by an E element
 * E ~ F				an F element preceded by an E element 
 * </pre>
 */
aframe.dom.select=function(cssSelector, context){
	(function(that){
	
	var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
		done = 0,
		toString = Object.prototype.toString,
		hasDuplicate = false;
	
	var Sizzle = function(selector, context, results, seed) {
		results = results || [];
		var origContext = context = context || document;
	
		if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
			return [];
		}
		
		if ( !selector || typeof selector !== "string" ) {
			return results;
		}
	
		var parts = [], m, set, checkSet, check, mode, extra, prune = true, contextXML = isXML(context);
		
		// Reset the position of the chunker regexp (start from head)
		chunker.lastIndex = 0;
		
		while ( (m = chunker.exec(selector)) !== null ) {
			parts.push( m[1] );
			
			if ( m[2] ) {
				extra = RegExp.rightContext;
				break;
			}
		}
	
		if ( parts.length > 1 && origPOS.exec( selector ) ) {
			if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
				set = posProcess( parts[0] + parts[1], context );
			} else {
				set = Expr.relative[ parts[0] ] ?
					[ context ] :
					Sizzle( parts.shift(), context );
	
				while ( parts.length ) {
					selector = parts.shift();
	
					if ( Expr.relative[ selector ] )
						selector += parts.shift();
	
					set = posProcess( selector, set );
				}
			}
		} else {
			// Take a shortcut and set the context if the root selector is an ID
			// (but not if it'll be faster if the inner selector is an ID)
			if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
					Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
				var ret = Sizzle.find( parts.shift(), context, contextXML );
				context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
			}
	
			if ( context ) {
				var ret = seed ?
					{ expr: parts.pop(), set: makeArray(seed) } :
					Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
				set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;
	
				if ( parts.length > 0 ) {
					checkSet = makeArray(set);
				} else {
					prune = false;
				}
	
				while ( parts.length ) {
					var cur = parts.pop(), pop = cur;
	
					if ( !Expr.relative[ cur ] ) {
						cur = "";
					} else {
						pop = parts.pop();
					}
	
					if ( pop == null ) {
						pop = context;
					}
	
					Expr.relative[ cur ]( checkSet, pop, contextXML );
				}
			} else {
				checkSet = parts = [];
			}
		}
	
		if ( !checkSet ) {
			checkSet = set;
		}
	
		if ( !checkSet ) {
			throw "Syntax error, unrecognized expression: " + (cur || selector);
		}
	
		if ( toString.call(checkSet) === "[object Array]" ) {
			if ( !prune ) {
				results.push.apply( results, checkSet );
			} else if ( context && context.nodeType === 1 ) {
				for ( var i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
						results.push( set[i] );
					}
				}
			} else {
				for ( var i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
						results.push( set[i] );
					}
				}
			}
		} else {
			makeArray( checkSet, results );
		}
	
		if ( extra ) {
			Sizzle( extra, origContext, results, seed );
			Sizzle.uniqueSort( results );
		}
	
		return results;
	};
	
	Sizzle.uniqueSort = function(results){
		if ( sortOrder ) {
			hasDuplicate = false;
			results.sort(sortOrder);
	
			if ( hasDuplicate ) {
				for ( var i = 1; i < results.length; i++ ) {
					if ( results[i] === results[i-1] ) {
						results.splice(i--, 1);
					}
				}
			}
		}
	};
	
	Sizzle.matches = function(expr, set){
		return Sizzle(expr, null, null, set);
	};
	
	Sizzle.find = function(expr, context, isXML){
		var set, match;
	
		if ( !expr ) {
			return [];
		}
	
		for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
			var type = Expr.order[i], match;
			
			if ( (match = Expr.match[ type ].exec( expr )) ) {
				var left = RegExp.leftContext;
	
				if ( left.substr( left.length - 1 ) !== "\\" ) {
					match[1] = (match[1] || "").replace(/\\/g, "");
					set = Expr.find[ type ]( match, context, isXML );
					if ( set != null ) {
						expr = expr.replace( Expr.match[ type ], "" );
						break;
					}
				}
			}
		}
	
		if ( !set ) {
			set = context.getElementsByTagName("*");
		}
	
		return {set: set, expr: expr};
	};
	
	Sizzle.filter = function(expr, set, inplace, not){
		var old = expr, result = [], curLoop = set, match, anyFound,
			isXMLFilter = set && set[0] && isXML(set[0]);
	
		while ( expr && set.length ) {
			for ( var type in Expr.filter ) {
				if ( (match = Expr.match[ type ].exec( expr )) != null ) {
					var filter = Expr.filter[ type ], found, item;
					anyFound = false;
	
					if ( curLoop == result ) {
						result = [];
					}
	
					if ( Expr.preFilter[ type ] ) {
						match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );
	
						if ( !match ) {
							anyFound = found = true;
						} else if ( match === true ) {
							continue;
						}
					}
	
					if ( match ) {
						for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
							if ( item ) {
								found = filter( item, match, i, curLoop );
								var pass = not ^ !!found;
	
								if ( inplace && found != null ) {
									if ( pass ) {
										anyFound = true;
									} else {
										curLoop[i] = false;
									}
								} else if ( pass ) {
									result.push( item );
									anyFound = true;
								}
							}
						}
					}
	
					if ( found !== undefined ) {
						if ( !inplace ) {
							curLoop = result;
						}
	
						expr = expr.replace( Expr.match[ type ], "" );
	
						if ( !anyFound ) {
							return [];
						}
	
						break;
					}
				}
			}
	
			// Improper expression
			if ( expr == old ) {
				if ( anyFound == null ) {
					throw "Syntax error, unrecognized expression: " + expr;
				} else {
					break;
				}
			}
	
			old = expr;
		}
	
		return curLoop;
	};
	
	var Expr = Sizzle.selectors = {
		order: [ "ID", "NAME", "TAG" ],
		match: {
			ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
			CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
			NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
			ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
			TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
			CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
			POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
			PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
		},
		attrMap: {
			"class": "className",
			"for": "htmlFor"
		},
		attrHandle: {
			href: function(elem){
				return elem.getAttribute("href");
			}
		},
		relative: {
			"+": function(checkSet, part, isXML){
				var isPartStr = typeof part === "string",
					isTag = isPartStr && !/\W/.test(part),
					isPartStrNotTag = isPartStr && !isTag;
	
				if ( isTag && !isXML ) {
					part = part.toUpperCase();
				}
	
				for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
					if ( (elem = checkSet[i]) ) {
						while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}
	
						checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ?
							elem || false :
							elem === part;
					}
				}
	
				if ( isPartStrNotTag ) {
					Sizzle.filter( part, checkSet, true );
				}
			},
			">": function(checkSet, part, isXML){
				var isPartStr = typeof part === "string";
	
				if ( isPartStr && !/\W/.test(part) ) {
					part = isXML ? part : part.toUpperCase();
	
					for ( var i = 0, l = checkSet.length; i < l; i++ ) {
						var elem = checkSet[i];
						if ( elem ) {
							var parent = elem.parentNode;
							checkSet[i] = parent.nodeName === part ? parent : false;
						}
					}
				} else {
					for ( var i = 0, l = checkSet.length; i < l; i++ ) {
						var elem = checkSet[i];
						if ( elem ) {
							checkSet[i] = isPartStr ?
								elem.parentNode :
								elem.parentNode === part;
						}
					}
	
					if ( isPartStr ) {
						Sizzle.filter( part, checkSet, true );
					}
				}
			},
			"": function(checkSet, part, isXML){
				var doneName = done++, checkFn = dirCheck;
	
				if ( !part.match(/\W/) ) {
					var nodeCheck = part = isXML ? part : part.toUpperCase();
					checkFn = dirNodeCheck;
				}
	
				checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
			},
			"~": function(checkSet, part, isXML){
				var doneName = done++, checkFn = dirCheck;
	
				if ( typeof part === "string" && !part.match(/\W/) ) {
					var nodeCheck = part = isXML ? part : part.toUpperCase();
					checkFn = dirNodeCheck;
				}
	
				checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
			}
		},
		find: {
			ID: function(match, context, isXML){
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);
					return m ? [m] : [];
				}
			},
			NAME: function(match, context, isXML){
				if ( typeof context.getElementsByName !== "undefined" ) {
					var ret = [], results = context.getElementsByName(match[1]);
	
					for ( var i = 0, l = results.length; i < l; i++ ) {
						if ( results[i].getAttribute("name") === match[1] ) {
							ret.push( results[i] );
						}
					}
	
					return ret.length === 0 ? null : ret;
				}
			},
			TAG: function(match, context){
				return context.getElementsByTagName(match[1]);
			}
		},
		preFilter: {
			CLASS: function(match, curLoop, inplace, result, not, isXML){
				match = " " + match[1].replace(/\\/g, "") + " ";
	
				if ( isXML ) {
					return match;
				}
	
				for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
					if ( elem ) {
						if ( not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0) ) {
							if ( !inplace )
								result.push( elem );
						} else if ( inplace ) {
							curLoop[i] = false;
						}
					}
				}
	
				return false;
			},
			ID: function(match){
				return match[1].replace(/\\/g, "");
			},
			TAG: function(match, curLoop){
				for ( var i = 0; curLoop[i] === false; i++ ){}
				return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
			},
			CHILD: function(match){
				if ( match[1] == "nth" ) {
					// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
					var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
						match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
						!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);
	
					// calculate the numbers (first)n+(last) including if they are negative
					match[2] = (test[1] + (test[2] || 1)) - 0;
					match[3] = test[3] - 0;
				}
	
				// TODO: Move to normal caching system
				match[0] = done++;
	
				return match;
			},
			ATTR: function(match, curLoop, inplace, result, not, isXML){
				var name = match[1].replace(/\\/g, "");
				
				if ( !isXML && Expr.attrMap[name] ) {
					match[1] = Expr.attrMap[name];
				}
	
				if ( match[2] === "~=" ) {
					match[4] = " " + match[4] + " ";
				}
	
				return match;
			},
			PSEUDO: function(match, curLoop, inplace, result, not){
				if ( match[1] === "not" ) {
					// If we're dealing with a complex expression, or a simple one
					if ( match[3].match(chunker).length > 1 || /^\w/.test(match[3]) ) {
						match[3] = Sizzle(match[3], null, null, curLoop);
					} else {
						var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
						if ( !inplace ) {
							result.push.apply( result, ret );
						}
						return false;
					}
				} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
					return true;
				}
				
				return match;
			},
			POS: function(match){
				match.unshift( true );
				return match;
			}
		},
		filters: {
			enabled: function(elem){
				return elem.disabled === false && elem.type !== "hidden";
			},
			disabled: function(elem){
				return elem.disabled === true;
			},
			checked: function(elem){
				return elem.checked === true;
			},
			selected: function(elem){
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				elem.parentNode.selectedIndex;
				return elem.selected === true;
			},
			parent: function(elem){
				return !!elem.firstChild;
			},
			empty: function(elem){
				return !elem.firstChild;
			},
			has: function(elem, i, match){
				return !!Sizzle( match[3], elem ).length;
			},
			header: function(elem){
				return /h\d/i.test( elem.nodeName );
			},
			text: function(elem){
				return "text" === elem.type;
			},
			radio: function(elem){
				return "radio" === elem.type;
			},
			checkbox: function(elem){
				return "checkbox" === elem.type;
			},
			file: function(elem){
				return "file" === elem.type;
			},
			password: function(elem){
				return "password" === elem.type;
			},
			submit: function(elem){
				return "submit" === elem.type;
			},
			image: function(elem){
				return "image" === elem.type;
			},
			reset: function(elem){
				return "reset" === elem.type;
			},
			button: function(elem){
				return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
			},
			input: function(elem){
				return /input|select|textarea|button/i.test(elem.nodeName);
			}
		},
		setFilters: {
			first: function(elem, i){
				return i === 0;
			},
			last: function(elem, i, match, array){
				return i === array.length - 1;
			},
			even: function(elem, i){
				return i % 2 === 0;
			},
			odd: function(elem, i){
				return i % 2 === 1;
			},
			lt: function(elem, i, match){
				return i < match[3] - 0;
			},
			gt: function(elem, i, match){
				return i > match[3] - 0;
			},
			nth: function(elem, i, match){
				return match[3] - 0 == i;
			},
			eq: function(elem, i, match){
				return match[3] - 0 == i;
			}
		},
		filter: {
			PSEUDO: function(elem, match, i, array){
				var name = match[1], filter = Expr.filters[ name ];
	
				if ( filter ) {
					return filter( elem, i, match, array );
				} else if ( name === "contains" ) {
					return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
				} else if ( name === "not" ) {
					var not = match[3];
	
					for ( var i = 0, l = not.length; i < l; i++ ) {
						if ( not[i] === elem ) {
							return false;
						}
					}
	
					return true;
				}
			},
			CHILD: function(elem, match){
				var type = match[1], node = elem;
				switch (type) {
					case 'only':
					case 'first':
						while (node = node.previousSibling)  {
							if ( node.nodeType === 1 ) return false;
						}
						if ( type == 'first') return true;
						node = elem;
					case 'last':
						while (node = node.nextSibling)  {
							if ( node.nodeType === 1 ) return false;
						}
						return true;
					case 'nth':
						var first = match[2], last = match[3];
	
						if ( first == 1 && last == 0 ) {
							return true;
						}
						
						var doneName = match[0],
							parent = elem.parentNode;
		
						if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
							var count = 0;
							for ( node = parent.firstChild; node; node = node.nextSibling ) {
								if ( node.nodeType === 1 ) {
									node.nodeIndex = ++count;
								}
							} 
							parent.sizcache = doneName;
						}
						
						var diff = elem.nodeIndex - last;
						if ( first == 0 ) {
							return diff == 0;
						} else {
							return ( diff % first == 0 && diff / first >= 0 );
						}
				}
			},
			ID: function(elem, match){
				return elem.nodeType === 1 && elem.getAttribute("id") === match;
			},
			TAG: function(elem, match){
				return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
			},
			CLASS: function(elem, match){
				return (" " + (elem.className || elem.getAttribute("class")) + " ")
					.indexOf( match ) > -1;
			},
			ATTR: function(elem, match){
				var name = match[1],
					result = Expr.attrHandle[ name ] ?
						Expr.attrHandle[ name ]( elem ) :
						elem[ name ] != null ?
							elem[ name ] :
							elem.getAttribute( name ),
					value = result + "",
					type = match[2],
					check = match[4];
	
				return result == null ?
					type === "!=" :
					type === "=" ?
					value === check :
					type === "*=" ?
					value.indexOf(check) >= 0 :
					type === "~=" ?
					(" " + value + " ").indexOf(check) >= 0 :
					!check ?
					value && result !== false :
					type === "!=" ?
					value != check :
					type === "^=" ?
					value.indexOf(check) === 0 :
					type === "$=" ?
					value.substr(value.length - check.length) === check :
					type === "|=" ?
					value === check || value.substr(0, check.length + 1) === check + "-" :
					false;
			},
			POS: function(elem, match, i, array){
				var name = match[2], filter = Expr.setFilters[ name ];
	
				if ( filter ) {
					return filter( elem, i, match, array );
				}
			}
		}
	};
	
	var origPOS = Expr.match.POS;
	
	for ( var type in Expr.match ) {
		Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	}
	
	var makeArray = function(array, results) {
		array = Array.prototype.slice.call( array );
	
		if ( results ) {
			results.push.apply( results, array );
			return results;
		}
		
		return array;
	};
	
	// Perform a simple check to determine if the browser is capable of
	// converting a NodeList to an array using builtin methods.
	try {
		Array.prototype.slice.call( document.documentElement.childNodes );
	
	// Provide a fallback method if it does not work
	} catch(e){
		makeArray = function(array, results) {
			var ret = results || [];
	
			if ( toString.call(array) === "[object Array]" ) {
				Array.prototype.push.apply( ret, array );
			} else {
				if ( typeof array.length === "number" ) {
					for ( var i = 0, l = array.length; i < l; i++ ) {
						ret.push( array[i] );
					}
				} else {
					for ( var i = 0; array[i]; i++ ) {
						ret.push( array[i] );
					}
				}
			}
	
			return ret;
		};
	}
	
	var sortOrder;
	
	if ( document.documentElement.compareDocumentPosition ) {
		sortOrder = function( a, b ) {
			var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
			if ( ret === 0 ) {
				hasDuplicate = true;
			}
			return ret;
		};
	} else if ( "sourceIndex" in document.documentElement ) {
		sortOrder = function( a, b ) {
			var ret = a.sourceIndex - b.sourceIndex;
			if ( ret === 0 ) {
				hasDuplicate = true;
			}
			return ret;
		};
	} else if ( document.createRange ) {
		sortOrder = function( a, b ) {
			var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
			aRange.selectNode(a);
			aRange.collapse(true);
			bRange.selectNode(b);
			bRange.collapse(true);
			var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
			if ( ret === 0 ) {
				hasDuplicate = true;
			}
			return ret;
		};
	}
	
	// Check to see if the browser returns elements by name when
	// querying by getElementById (and provide a workaround)
	(function(){
		// We're going to inject a fake input element with a specified name
		var form = document.createElement("div"),
			id = "script" + (new Date).getTime();
		form.innerHTML = "<a name='" + id + "'/>";
	
		// Inject it into the root element, check its status, and remove it quickly
		var root = document.documentElement;
		root.insertBefore( form, root.firstChild );
	
		// The workaround has to do additional checks after a getElementById
		// Which slows things down for other browsers (hence the branching)
		if ( !!document.getElementById( id ) ) {
			Expr.find.ID = function(match, context, isXML){
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);
					return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
				}
			};
	
			Expr.filter.ID = function(elem, match){
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return elem.nodeType === 1 && node && node.nodeValue === match;
			};
		}
	
		root.removeChild( form );
	})();
	
	(function(){
		// Check to see if the browser returns only elements
		// when doing getElementsByTagName("*")
	
		// Create a fake element
		var div = document.createElement("div");
		div.appendChild( document.createComment("") );
	
		// Make sure no comments are found
		if ( div.getElementsByTagName("*").length > 0 ) {
			Expr.find.TAG = function(match, context){
				var results = context.getElementsByTagName(match[1]);
	
				// Filter out possible comments
				if ( match[1] === "*" ) {
					var tmp = [];
	
					for ( var i = 0; results[i]; i++ ) {
						if ( results[i].nodeType === 1 ) {
							tmp.push( results[i] );
						}
					}
	
					results = tmp;
				}
	
				return results;
			};
		}
	
		// Check to see if an attribute returns normalized href attributes
		div.innerHTML = "<a href='#'></a>";
		if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
				div.firstChild.getAttribute("href") !== "#" ) {
			Expr.attrHandle.href = function(elem){
				return elem.getAttribute("href", 2);
			};
		}
	})();
	
	if ( document.querySelectorAll ) (function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";
	
		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
		
		Sizzle = function(query, context, extra, seed){
			context = context || document;
	
			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && context.nodeType === 9 && !isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}
			
			return oldSizzle(query, context, extra, seed);
		};
	
		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}
	})();
	
	if ( document.getElementsByClassName && document.documentElement.getElementsByClassName ) (function(){
		var div = document.createElement("div");
		div.innerHTML = "<div class='test e'></div><div class='test'></div>";
	
		// Opera can't find a second classname (in 9.6)
		if ( div.getElementsByClassName("e").length === 0 )
			return;
	
		// Safari caches class attributes, doesn't catch changes (in 3.2)
		div.lastChild.className = "e";
	
		if ( div.getElementsByClassName("e").length === 1 )
			return;
	
		Expr.order.splice(1, 0, "CLASS");
		Expr.find.CLASS = function(match, context, isXML) {
			if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
				return context.getElementsByClassName(match[1]);
			}
		};
	})();
	
	function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		var sibDir = dir == "previousSibling" && !isXML;
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];
			if ( elem ) {
				if ( sibDir && elem.nodeType === 1 ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}
				elem = elem[dir];
				var match = false;
	
				while ( elem ) {
					if ( elem.sizcache === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}
	
					if ( elem.nodeType === 1 && !isXML ){
						elem.sizcache = doneName;
						elem.sizset = i;
					}
	
					if ( elem.nodeName === cur ) {
						match = elem;
						break;
					}
	
					elem = elem[dir];
				}
	
				checkSet[i] = match;
			}
		}
	}
	
	function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		var sibDir = dir == "previousSibling" && !isXML;
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];
			if ( elem ) {
				if ( sibDir && elem.nodeType === 1 ) {
					elem.sizcache = doneName;
					elem.sizset = i;
				}
				elem = elem[dir];
				var match = false;
	
				while ( elem ) {
					if ( elem.sizcache === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}
	
					if ( elem.nodeType === 1 ) {
						if ( !isXML ) {
							elem.sizcache = doneName;
							elem.sizset = i;
						}
						if ( typeof cur !== "string" ) {
							if ( elem === cur ) {
								match = true;
								break;
							}
	
						} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
							match = elem;
							break;
						}
					}
	
					elem = elem[dir];
				}
	
				checkSet[i] = match;
			}
		}
	}
	
	var contains = document.compareDocumentPosition ?  function(a, b){
		return a.compareDocumentPosition(b) & 16;
	} : function(a, b){
		return a !== b && (a.contains ? a.contains(b) : true);
	};
	
	var isXML = function(elem){
		return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
			!!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
	};
	
	var posProcess = function(selector, context){
		var tmpSet = [], later = "", match,
			root = context.nodeType ? [context] : context;
	
		// Position selectors must be done after the filter
		// And so must :not(positional) so we move all PSEUDOs to the end
		while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
			later += match[0];
			selector = selector.replace( Expr.match.PSEUDO, "" );
		}
	
		selector = Expr.relative[selector] ? selector + "*" : selector;
	
		for ( var i = 0, l = root.length; i < l; i++ ) {
			Sizzle( selector, root[i], tmpSet );
		}
	
		return Sizzle.filter( later, tmpSet );
	};
	
	// EXPOSE
	
	aframe.dom.select = function(a,b){
		var ret=Sizzle(a,b);
		aframe.dom.extend(ret);
		return ret;
	}
	
	})(this);
}
