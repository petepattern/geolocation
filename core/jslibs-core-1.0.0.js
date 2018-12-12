//initialize namespace
LV = window.LV || {};
LV.JsLibs = window.LV.JsLibs || {};
LV.JsLibs.Core = {};

//base object used to extension and mixins
LV.JsLibs.Core.BaseObject = (function (){
	'use strict';

	var BaseObject = {
		create: function create() {
		   var instance = Object.create(this);
		   instance._construct.apply(instance, arguments);
		   return instance;
		},

		extend: function extend(properties, propertyDescriptors) {
			propertyDescriptors = propertyDescriptors || {};

			if(properties){
				var simpleProperties = Object.getOwnPropertyNames(properties);
				for (var i = 0, len = simpleProperties.length; i < len; i += 1) {
					var propertyName = simpleProperties[i];
					
					if(propertyDescriptors.hasOwnProperty(propertyName)) {
						continue;
					}

					propertyDescriptors[propertyName] =
						Object.getOwnPropertyDescriptor(properties, propertyName);
				}
			}

			return Object.create(this, propertyDescriptors);
		},
		
		mixin: function mixin() {
			var receiver = this;
			var args = Array.prototype.slice.call(arguments, 0);
			
			args.forEach(function(supplier) {
				if (typeof supplier != 'object') {
					return;
				}
				
				Object.keys(supplier).forEach(function(property) {
					if (receiver.hasOwnProperty(property)) {
						return;
					}
					
					Object.defineProperty(receiver, property, Object.getOwnPropertyDescriptor(supplier, property));
				});				
			});
			
			return receiver;
		},

		_construct: function _construct() {
			//implement
		},

		_super: function _super(definedOn, methodName, args) {
			if (typeof methodName !== "string") {
				args = methodName;
				methodName = "_construct";
			}

			return Object.getPrototypeOf(definedOn)[methodName].apply(this, args);
		}
	};

	return BaseObject;
})();

//event target adds event capabilities when mixed with another object
LV.JsLibs.Core.EventTarget = (function (){
	'use strict';

	var EventTarget = {
		_eventsRegistry: null,
		
		_events: null,
		
		_eventsCache: null,
		
		_getEventsRegistry: function _getEventsRegistry() {
			this._eventsRegistry = this._eventsRegistry || {};
			return this._eventsRegistry;
		},

		_isValidEvent: function _isValidEvent(eventName) {	
			if (!this._eventsCache) {
				this._eventsCache = {};
				var parentObject = this;
				
				while (parentObject) {
					var parentEvents = parentObject._events || [];
					
					for (var i=0; i < parentEvents.length; i++) {
						this._eventsCache[parentEvents[i]] = true;
					}

					parentObject = Object.getPrototypeOf(parentObject);
				}
			}
			
			return this._eventsCache[eventName] === true;
		},
		
		on: function on(eventName, handler) {
        	if (typeof eventName != 'string' || !eventName.length) {
        		console.error("event-target > on: '" + eventName + "' is not a valid name for an event!");
        		return false;
        	}
        	
        	if (!this._isValidEvent(eventName)) {
        		console.error("event-target > on: '" + eventName + "' is not defined");
        		return false;
        	}
        	
        	if (typeof handler != 'function') {
        		console.error("event-target > on: '" + eventName + "' event handler must be a function");
        		return false;
        	}
			
			var eventsRegistry = this._getEventsRegistry();
            eventsRegistry[eventName] = eventsRegistry[eventName] || [];
            eventsRegistry[eventName].push(handler);
            
            return true;
		},

		off: function off(eventName, handler) {
        	if (typeof eventName != 'string' || !eventName.length) {
        		console.error("event-target > off: '" + eventName + "' is not a valid name for an event!");
        		return false;
        	}
        	
            if (typeof handler != 'function') {
                console.error("event-target > off: '" + eventName + "' event handler must be a function");
                return false;
            }
            
			if (!this._isValidEvent(eventName)) {
        		console.error("event-target > off: '" + eventName + "' is not defined");
        		return false;
        	}
			
			var eventsRegistry = this._getEventsRegistry();
            var eventHandlers = eventsRegistry[eventName] || [];
            
            eventsRegistry[eventName] = eventHandlers.filter(function(eventHandler){
        		return (eventHandler !== handler);
        	});
            
            return true;
		},
		
		notify: function notify(eventName, params) {
        	params = params || {};
        	
        	if (typeof eventName != 'string' || !eventName.length) {
        		console.error("event-target > notify: '" + eventName + "' is not a valid name for an event!");
        		return false;
        	}
			
			if (!this._isValidEvent(eventName)) {
        		console.error("event-target > notify: '" + eventName + "' is not defined");
        		return false;
        	}
        	
			var eventsRegistry = this._getEventsRegistry();
        	var eventHandlers = eventsRegistry[eventName] || [];
            
            eventHandlers.forEach(function eventDispatcher(eventHandler){
	            try {
	            	eventHandler.call(null, params);
	            } catch (ex) {
	            	//try to get the stack trace, for sure it will not work on IE :(
	            	var stack = ex.stack || 'stack trace is not available';
	            	console.error("core > notify: error trying to fire event '" + eventName + "' : " + ex + " > " + stack);
	            }
            });
		}
	};

	return EventTarget;
})();

//base library is an object exposing events and with a initialize method
LV.JsLibs.Core.BaseLibrary = (function (){
	'use strict';

	var bo = LV.JsLibs.Core.BaseObject;
	var et = LV.JsLibs.Core.EventTarget;
	
	var BaseLibrary = bo.extend({
		_class: 'BaseLibrary',
		
		init: function init() {
			console.warn('base-library: init must be overriden in library class: ' + this._class);
		}
	});

	BaseLibrary.mixin(et);
	
	return BaseLibrary;
})();
