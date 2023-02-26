/**
 * @license Event
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Contains properties and methods shared by all events for use with {@link core.EventDispatcher}.
 * Note that Event objects are often reused, so you should never
 * rely on an event object's state outside of the call stack it was received in.
 *
 * @memberof core
 * @example
 * const evt = new Event("myEvent");
 * const dispatcher = new EventDispatcher();
 * dispatcher.on("myEvent", event => console.log(event.type));
 * dispatcher.dispatchEvent(evt); // logs "myEvent"
 *
 * @param {string} type The event type.
 * @param {boolean} [bubbles=false] Indicates whether the event will bubble through the display list.
 * @param {boolean} [cancelable=false] Indicates whether the default behaviour of this event can be cancelled.
 */
class Event {

    constructor(type, bubbles = false, cancelable = false) {
        /**
         * The type of event.
         * @type string
         */
        this.type = type;

        /**
         * The object that generated an event.
         *
         * @type Object
         * @default null
         * @readonly
         */
        this.target = null;

        /**
         * The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
         * always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
         * is generated from childObj, then a listener on parentObj would receive the event with
         * target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
         *
         * @type Object
         * @default null
         * @readonly
         */
        this.currentTarget = null;

        /**
         * For bubbling events, this indicates the current event phase:
         * <OL>
         * 	<LI> capture phase: starting from the top parent to the target</LI>
         * 	<LI> at target phase: currently being dispatched from the target</LI>
         * 	<LI> bubbling phase: from the target to the top parent</LI>
         * </OL>
         *
         * @type number
         * @default 0
         * @readonly
         */
        this.eventPhase = 0;

        /**
         * Indicates whether the event will bubble through the display list.
         *
         * @type boolean
         * @readonly
         */
        this.bubbles = bubbles;

        /**
         * Indicates whether the default behaviour of this event can be cancelled via {@link core.Event#preventDefault}.
         *
         * @type boolean
         * @readonly
         */
        this.cancelable = cancelable;

        /**
         * The epoch time at which this event was created.
         *
         * @type number
         * @readonly
         */
        this.timeStamp = new Date().getTime();

        /**
         * Indicates if {@link core.Event#preventDefault} has been called on this event.
         *
         * @type boolean
         * @default false
         * @readonly
         */
        this.defaultPrevented = false;

        /**
         * Indicates if {@link core.Event#stopPropagation} or {@link core.Event#stopImmediatePropagation} has been called on this event.
         *
         * @type boolean
         * @default false
         * @readonly
         */
        this.propagationStopped = false;

        /**
         * Indicates if {@link core.Event#stopImmediatePropagation} has been called on this event.
         *
         * @type boolean
         * @default false
         * @readonly
         */
        this.immediatePropagationStopped = false;

        /**
         * Indicates if {@link core.Event#remove} has been called on this event.
         *
         * @type boolean
         * @default false
         * @readonly
         */
        this.removed = false;
    }

    /**
     * Sets {@link core.Event#defaultPrevented} to true if the event is cancelable.
     * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
     * cancel the default behaviour associated with the event.
     * @return {core.Event} this, chainable
     */
    preventDefault() {
        this.defaultPrevented = this.cancelable;
        return this;
    }

    /**
     * Sets {@link core.Event#propagationStopped} to true.
     * Mirrors the DOM event standard.
     * @return {core.Event} this, chainable
     */
    stopPropagation() {
        this.propagationStopped = true;
        return this;
    }

    /**
     * Sets {@link core.Event#propagationStopped} and {@link core.Event#immediatePropagationStopped} to true.
     * Mirrors the DOM event standard.
     * @return {core.Event} this, chainable
     */
    stopImmediatePropagation() {
        this.immediatePropagationStopped = this.propagationStopped = true;
        return this;
    }

    /**
     * Causes the active listener to be removed via removeEventListener();
     *
     * @example
     * myBtn.addEventListener("click", event => {
     *   event.remove(); // removes this listener.
     * });
     *
     * @return {core.Event} this, chainable
     */
    remove() {
        this.removed = true;
        return this;
    }

    /**
     * Returns a clone of the Event instance.
     *
     * @return {core.Event} a clone of the Event instance.
     */
    clone() {
        const event = new Event(this.type, this.bubbles, this.cancelable);
        for (let n in this) {
            if (this.hasOwnProperty(n)) {
                event[n] = this[n];
            }
        }
        return event;
    }

    /**
     * Provides a return {core.Event} this, chainable shortcut method for setting a number of properties on the instance.
     *
     * @param {Object} props A generic object containing properties to copy to the instance.
     * @return {core.Event} this, chainable
     */
    set(props) {
        for (let n in props) { this[n] = props[n]; }
        return this;
    }

    /**
     * Returns a string representation of this object.
     *
     * @return {string} A string representation of the instance.
     */
    toString() {
        return `[${this.constructor.name} (type=${this.type})]`;
    }

}

/**
 * @license EventDispatcher
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * EventDispatcher provides methods for managing queues of event listeners and dispatching events.
 *
 * You can either extend EventDispatcher or mix its methods into an existing prototype or instance by using the
 * EventDispatcher {@link core.EventDispatcher.initialize} method.
 *
 * Together with the CreateJS Event class, EventDispatcher provides an extended event model that is based on the
 * DOM Level 2 event model, including addEventListener, removeEventListener, and dispatchEvent. It supports
 * bubbling / capture, preventDefault, stopPropagation, stopImmediatePropagation, and handleEvent.
 *
 * EventDispatcher also exposes a {@link core.EventDispatcher#on} method, which makes it easier
 * to create scoped listeners, listeners that only run once, and listeners with associated arbitrary data. The
 * {@link core.EventDispatcher#off} method is merely an alias to {@link core.EventDispatcher#removeEventListener}.
 *
 * Another addition to the DOM Level 2 model is the {@link core.EventDispatcher#removeAllEventListeners}
 * method, which can be used to listeners for all events, or listeners for a specific event. The Event object also
 * includes a {@link core.Event#remove} method which removes the active listener.
 *
 * @memberof core
 * @example
 * // add EventDispatcher capabilities to the "MyClass" class.
 * EventDispatcher.initialize(MyClass.prototype);
 *
 * // Add an event.
 * instance.addEventListener("eventName", event => console.log(event.target + " was clicked."));
 *
 * // scope ("this") can be be a challenge with events.
 * // using the {@link core.EventDispatcher#on} method to subscribe to events simplifies this.
 * instance.addEventListener("click", event => console.log(instance === this)); // false, scope is ambiguous.
 * instance.on("click", event => console.log(instance === this)); // true, `on` uses dispatcher scope by default.
 */
class EventDispatcher {

	/**
	 * Static initializer to mix EventDispatcher methods into a target object or prototype.
	 *
	 * @static
	 * @example
	 * EventDispatcher.initialize(MyClass.prototype); // add to the prototype of the class
	 * EventDispatcher.initialize(myInstance); // add to a specific instance
	 *
	 * @param {Object} target The target object to inject EventDispatcher methods into.
	 */
	static initialize (target) {
		const p = EventDispatcher.prototype;
		target.addEventListener = p.addEventListener;
		target.on = p.on;
		target.removeEventListener = target.off = p.removeEventListener;
		target.removeAllEventListeners = p.removeAllEventListeners;
		target.hasEventListener = p.hasEventListener;
		target.dispatchEvent = p.dispatchEvent;
		target._dispatchEvent = p._dispatchEvent;
		target.willTrigger = p.willTrigger;
	}

	constructor () {
		/**
		 * @private
		 * @default null
		 * @type Object
		 */
		this._listeners = null;

		/**
		 * @private
		 * @default null
		 * @type Object
		 */
		this._captureListeners = null;
	}

	/**
	 * Adds the specified event listener. Note that adding multiple listeners to the same function will result in
	 * multiple callbacks getting fired.
	 *
	 * @example
	 * displayObject.addEventListener("click", event => console.log('clicked', event));
	 *
	 * @param {string} type The string type of the event.
	 * @param {Function|Object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched.
	 * @param {boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 * @return {Function|Object} Returns the listener for chaining or assignment.
	 */
	addEventListener (type, listener, useCapture = false) {
		let listeners;
		if (useCapture) {
			listeners = this._captureListeners = this._captureListeners || {};
		} else {
			listeners = this._listeners = this._listeners || {};
		}
		let arr = listeners[type];
		if (arr) {
			this.removeEventListener(type, listener, useCapture);
			arr = listeners[type]; // remove may have deleted the array
		}
		if (arr) { arr.push(listener);  }
		else { listeners[type] = [listener]; }
		return listener;
	}

	/**
	 * A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
	 * only run once, associate arbitrary data with the listener, and remove the listener.
	 *
	 * This method works by creating an anonymous wrapper function and subscribing it with `addEventListener`.
	 * The wrapper function is returned for use with `removeEventListener` (or `off`).
	 *
	 * To remove a listener added with `on`, you must pass in the returned wrapper function as the listener, or use
	 * {@link core.Event#remove}. Likewise, each time you call `on` a NEW wrapper function is subscribed, so multiple calls
	 * to `on` with the same params will create multiple listeners.
	 *
	 * @example
	 * const listener = myBtn.on("click", handleClick, null, false, { count: 3 });
	 * function handleClick (evt, data) {
	 *   data.count -= 1;
	 *   console.log(this == myBtn); // true - scope defaults to the dispatcher
	 *   if (data.count == 0) {
	 *     alert("clicked 3 times!");
	 *     myBtn.off("click", listener);
	 *     // alternately: evt.remove();
	 *   }
	 * }
	 *
	 * @param {string} type The string type of the event.
	 * @param {Function|Object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched.
	 * @param {Object} [scope=null] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
	 * @param {boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
	 * @param {*} [data={}] Arbitrary data that will be included as the second parameter when the listener is called.
	 * @param {boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 * @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
	 */
	on (type, listener, scope = null, once = false, data = {}, useCapture = false) {
		if (listener.handleEvent) {
			scope = scope || listener;
			listener = listener.handleEvent;
		}
		scope = scope || this;
		return this.addEventListener(type, evt => {
			listener.call(scope, evt, data);
			once && evt.remove();
		}, useCapture);
	}

	/**
	 * Removes the specified event listener.
	 *
	 * You must pass the exact function reference used when the event was added. If a proxy
	 * function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
	 * closure will not work.
	 *
	 * @example
	 * displayObject.removeEventListener("click", handleClick);
	 *
	 * @param {string} type The string type of the event.
	 * @param {Function|Object} listener The listener function or object.
	 * @param {boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 */
	removeEventListener (type, listener, useCapture = false) {
		const listeners = useCapture ? this._captureListeners : this._listeners;
		if (!listeners) { return; }
		const arr = listeners[type];
		if (!arr) { return; }
		const l = arr.length;
		for (let i = 0; i < l; i++) {
			if (arr[i] === listener) {
				if (l === 1) { delete(listeners[type]); } // allows for faster checks.
				else { arr.splice(i, 1); }
				break;
			}
		}
	}

	/**
	 * A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
	 * `on` method.
	 *
	 * To remove a listener added with `on`, you must pass in the returned wrapper function as the listener. See
	 * {@link core.EventDispatcher#on} for an example.
	 *
	 * @param {string} type The string type of the event.
	 * @param {Function|Object} listener The listener function or object.
	 * @param {boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 */
	off (type, listener, useCapture = false) {
		this.removeEventListener(type, listener, useCapture);
	}

	/**
	 * Removes all listeners for the specified type, or all listeners of all types.
	 *
	 * @example
	 * // remove all listeners
	 * displayObject.removeAllEventListeners();
	 *
	 * // remove all click listeners
	 * displayObject.removeAllEventListeners("click");
	 *
	 * @param {string} [type=null] The string type of the event. If omitted, all listeners for all types will be removed.
	 */
	removeAllEventListeners (type = null) {
		if (type) {
			if (this._listeners) { delete(this._listeners[type]); }
			if (this._captureListeners) { delete(this._captureListeners[type]); }
		} else {
			this._listeners = this._captureListeners = null;
		}
	}

	/**
	 * Dispatches the specified event to all listeners.
	 *
	 * @example
	 * // use a string event
	 * this.dispatchEvent("complete")
	 *
	 * // use an Event instance
	 * const event = new createjs.Event("progress");
	 * this.dispatchEvent(event);
	 *
	 * @param {Object|Event|string} eventObj An object with a "type" property, or a string type.
	 * While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
	 * dispatchEvent will construct an Event instance if necessary with the specified type. This latter approach can
	 * be used to avoid event object instantiation for non-bubbling events that may not have any listeners.
	 * @param {boolean} [bubbles=false] Specifies the `bubbles` value when a string was passed to eventObj.
	 * @param {boolean} [cancelable=false] Specifies the `cancelable` value when a string was passed to eventObj.
	 * @return {boolean} Returns false if `preventDefault()` was called on a cancelable event, true otherwise.
	 */
	dispatchEvent (eventObj, bubbles = false, cancelable = false) {
		if (typeof eventObj === "string") {
			// skip everything if there's no listeners and it doesn't bubble:
			const listeners = this._listeners;
			if (!bubbles && (!listeners || !listeners[eventObj])) { return true; }
			eventObj = new Event(eventObj, bubbles, cancelable);
		} else if (eventObj.target && eventObj.clone) {
			// redispatching an active event object, so clone it:
			eventObj = eventObj.clone();
		}

		// TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
		try { eventObj.target = this; } catch (e) {} // try/catch allows redispatching of native events

		if (!eventObj.bubbles || !this.parent) {
			this._dispatchEvent(eventObj, 2);
		} else {
			let top = this;
			const list = [top];
			while (top.parent) { list.push(top = top.parent); }
			const l = list.length;
			let i;

			// capture & atTarget
			for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
				list[i]._dispatchEvent(eventObj, 1+(i==0));
			}
			// bubbling
			for (i = 1; i < l && !eventObj.propagationStopped; i++) {
				list[i]._dispatchEvent(eventObj, 3);
			}
		}
		return !eventObj.defaultPrevented;
	}

	/**
	 * Indicates whether there is at least one listener for the specified event type.
	 *
	 * @param {string} type The string type of the event.
	 * @return {boolean} Returns true if there is at least one listener for the specified event.
	 */
	hasEventListener (type) {
		const listeners = this._listeners, captureListeners = this._captureListeners;
		return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
	}

	/**
	 * Indicates whether there is at least one listener for the specified event type on this object or any of its
	 * ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
	 * specified type is dispatched from this object, it will trigger at least one listener.
	 *
	 * This is similar to {@link core.EventDispatcher#hasEventListener}, but it searches the entire
	 * event flow for a listener, not just this object.
	 *
	 * @param {string} type The string type of the event.
	 * @return {boolean} Returns `true` if there is at least one listener for the specified event.
	 */
	willTrigger (type) {
		let o = this;
		while (o) {
			if (o.hasEventListener(type)) { return true; }
			o = o.parent;
		}
		return false;
	}

	/**
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name + this.name ? ` ${this.name}` : ""}]`;
	}

	/**
	 * @private
	 * @param {Object|Event|string} eventObj
	 * @param {Object} eventPhase
	 */
	_dispatchEvent (eventObj, eventPhase) {
		const listeners = eventPhase === 1 ? this._captureListeners : this._listeners;
		if (eventObj && listeners) {
			let arr = listeners[eventObj.type];
			let l;
			if (!arr || (l = arr.length) === 0) { return; }
			try { eventObj.currentTarget = this; } catch (e) {}
			try { eventObj.eventPhase = eventPhase; } catch (e) {}
			eventObj.removed = false;

			arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
			for (let i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
				let o = arr[i];
				if (o.handleEvent) { o.handleEvent(eventObj); }
				else { o(eventObj); }
				if (eventObj.removed) {
					this.off(eventObj.type, o, eventPhase === 1);
					eventObj.removed = false;
				}
			}
		}
	}

}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * EventRouter holds and manages array of event routes.
 * Event Routes are used by ViewNavigator to find associated View and Viewstack
 * 
 * Viewnavigator find View and ViewStack based on Routes info set in EventRouter Object see Example
 * 
 */

 class EventRouter {


    /**
     * @example Sample Event Router Object is in "SimpleNavigator" class (subclass of ViewNavigator) 
     
        initEventRoutes() {
            let evtRoutes = [

               { navEvent: " Login_NavEvent ", viewstackId: “LoginStack", viewId: “loginView", path: "/login" },
               { navEvent: " Register_NavEvent ", viewstackId: “LoginStack", viewId: “registerView", path: "/login" },
               { navEvent: " ForgotPwd_NavEvent", viewstackId: “LoginStack", viewId: “forgotpwdView", path: "/login" }

            ]
            this.eventRouter = new EventRouter(evtRoutes);
        }

        Here "navEvent" is Event Name, "viewstackId" is ViewStack Id, "viewId" is ViewId and "path" is routeID by which ViewNavigator associated.

     * 
     * @param {array} [_routes=[]] - Events routes array
     * @memberof EventRouter
     */
    constructor(_routes = []) {
        this.routes = _routes;
    }


    /**
     *
     * @description Adds new Event Route
     * @param {string} _navEvent - Navigation Event Name
     * @param {string} _viewstackId - ViewStack ID
     * @param {string} _viewId -  View ID
     * @param {string} _path -  Navigator Route path associted 
     * @memberof EventRouter
     */
    addRoute(_navEvent, _viewstackId, _viewId, _path) {
        let route = {};
        route.navEvent = _navEvent;
        route.viewstackId = _viewstackId;
        route.viewId = _viewId;
        route.path = _path;
        this.routes.push(route);
    }


    /**
     *
     * @description find Event Route using Naviagtion EventName
     * @param {string} _navEvent
     * @returns {Object} Event Route Object
     * @memberof EventRouter
     */
    findRoute(_navEvent) {
        let tmpRoute = [];
        for (let x = 0; x < this.routes.length; x++) {
            if (this.routes[x].navEvent == _navEvent)
                tmpRoute[x] = this.routes[x];
        }
        return tmpRoute;
    }


    /**
     *
     * @description finds associated view by Navigation EventName and Path
     * @param {string} _navEvent
     * @param {string} _path
     * @returns {string} - ViewID 
     * @memberof EventRouter
     */
    findViewId(_navEvent, _path) {
        let tmpViewId = [];
        for (let i = 0; i < this.routes.length; i++) {
            if ((this.routes[i].navEvent == _navEvent) && (this.routes[i].path == _path))
                tmpViewId = this.routes[i].viewId;
        }
        return tmpViewId;
    }


    /**
     *
     * @description finds associated viewstack by Navigation EventName and Path
     * @param {string} _navEvent
     * @param {string} _path
     * @returns {string} - ViewStackID
     * @memberof EventRouter
     */
    findViewStackId(_navEvent, _path) {
        let tmpViewStackId = null;
        for (let j = 0; j < this.routes.length; j++) {
            if ((this.routes[j].navEvent == _navEvent) && (this.routes[j].path == _path))
                tmpViewStackId = this.routes[j].viewstackId;
        }
        return tmpViewStackId;
    }


    /**
     *
     * @description Remove and Resets existing event routes
     * @memberof EventRouter
     */
    reset() {
        this.routes = [];
    }


    /**
     *
     * @description prints Event Routes
     * @memberof EventRouter
     */
    printRoutes() {
        if (this.routes.length > 0) {
            for (let i = 0; i < this.routes.length; i++) {
                console.log("navEvent:" + this.routes[i].navEvent + " viewstackId:" + this.routes[i].viewstackId + " viewId:" + this.routes[i].viewId);
            }
        } else {
            console.log("No Routes Found");
        }
    }

}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 *
 * Router holds and manages array of Path routes
 * Path Routes are used by ViewManager to find associated Navigator and Viewstack
 * Viewmanager find Viewnavigator based on Routes info set in Router Object
 * see Example
 */
class Router {

    /**
     *  @example Sample Router Object is to be implement in "AppViewManager" class (subclass of ViewManager) 
     
        initRoutes() {
            let tmpRoutes = [
                { path: "/login", navigatorId: " LoginNavigator",parentId: "root" },
                { path: "/file", navigatorId: " FileNavigator",parentId: "root" },
                { path: "/logout", navigatorId: "ExitNavigator",parentId: "root" },
            ]
            this.routes = new Router(tmpRoutes);
        }

      Here "path" is routeID, "navigatorId" is viewNavigatorId, "parentId" is DOM Element Id or ViewId or ContainerId.
      By Default Main DOM Element have id="root"

     * 
     * @param {array} [_routes=[]] - Path routes array
     * @memberof Router
     */
    constructor(_routes = []) {
        this.routes = _routes;
    }


    /**
     *
     * @description Adds new Path Route
     * @param {string} _path - Path Name
     * @param {string} _navigatorId -  Navigator ID
     * @param {string} _parentId -  Parent Object / Element ID
     * @memberof Router
     */
    addRoute(_path, _navigatorId, _parentId) {
        let route = {};
        route.path = _path;
        route.navigatorId = _navigatorId;
        route.parentId = _parentId;
        this.routes.push(route);
    }


    /**
     *
     * @description finds associated Navigator by Path route Name
     * @param {string} _route
     * @returns {Array} - NavigatorID Array
     * @memberof Router
     */
    findNavigator(_route) {
        let tmpNavigatorIds = [];
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].path === _route)
                tmpNavigatorIds.push(this.routes[i].navigatorId);
        }
        return tmpNavigatorIds;
    }

    findRouteNavigators(_route){
        //let path = "/rootpath/path9/path8"
        let tmpNewRouteArray = _route.split("/");
        let tmpNavigatorIds = [];
        tmpNewRouteArray.shift();
        let length =  tmpNewRouteArray.length;
        let routesArray = [];
        for (let x = 0; x < tmpNewRouteArray.length; x++) {
            let tmppathStr = "";
            for (let y = 0; y <= x; y++){
                tmppathStr += "/" + tmpNewRouteArray[y];
            }
            routesArray.push(tmppathStr);
            //["/rootpath", "/rootpath/path9", "/rootpath/path9/path8"]
        
        }
        for (let z = 0; z < routesArray.length; z++) {
            let tmpRouteArr = this.findNavigator(routesArray[z]);
            tmpNavigatorIds[z] = tmpRouteArr[0];
        }
        return tmpNavigatorIds;
    }


    /**
     *
     * @description finds associated Navigator Parent by navigator ID
     * @param {string} _navigatorId
     * @returns {string} - Parent ID
     * @memberof Router
     */
    findNavigatorParent(_navigatorId) {
        let tmpParentId = "root";
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].navigatorId === _navigatorId)
                tmpParentId = this.routes[i].parentId;
        }
        return tmpParentId;
    }


    /**
     *
     * @description finds associated ViewStack  by Path route Name
     * @param {string} _route
     * @returns {string} - ViewStack ID
     * @memberof Router
     */
    findViewStack(_route) {
        let tmpViewStackId = null;
        for (let j = 0; j < this.routes.length; j++) {
            if (this.routes[j].path == _route)
                tmpViewStackId = this.routes[j].viewstackId;
        }
        return tmpViewStackId;
    }

    /**
     *
     * @description Remove and Resets existing path routes
     * @memberof Router
     */
    reset() {
        this.routes = [];
    }

    /**
     *
     * @description prints path Routes
     * @memberof Router
     */
    printRoutes() {
        if (this.routes.length > 0) {
            for (let i = 0; i < this.routes.length; i++) {
                console.log("path:" + this.routes[i].path + " navigatorId:" + this.routes[i].navigatorId);
            }
        } else {
            console.log("No Routes Found");
        }
    }

}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 *
 *
 * EventUtils is static class and provides common Event Constants.
 */
class EventUtils {
    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get FORGOTPWD_NAV_EVENT() {
        return "Forgotpwd_Nav_Event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get REGISTER_NAV_EVENT() {
        return "Register_Nav_Event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get BACK_NAV_EVENT() {
        return "Back_Nav_Event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get NAV_CHANGE_EVENT() {
        return "navigation_change_event";
    }

    //View,Navigator Specific Events

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get INITIALIZE_EVENT() {
        return "initialize_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get ATTACHED_EVENT() {
        return "attached_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get DETACHED_EVENT() {
        return "detached_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get ACTIVATE_EVENT() {
        return "activate_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get DEACTIVATE_EVENT() {
        return "deactivate_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get CHANGE() {
        return "change";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get CLICK() {
        return "click";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get VIEW_EVENT(){
        return "view_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get MODEL_EVENT(){
        return "model_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get COMPONENT_EVENT(){
        return "component_event";
    }


}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Eventchannel use to Publish event to Channel subscribers. 
 * 
 * Event dispatch using event channel with help of Event Broadcaster
 * 
 * It also known as PubSub
 */
class EventChannel extends EventDispatcher {

    /**
     *
     * @example 
       //create Navigation Event
       let helloNavEvent = new NavigationEvent(EventUtils.NAV_CHANGE_EVENT, "Hello_NavEvent", "Message :: Hello World !!!", "/hello");

       // Dispatch Navigation Event on Navigation Event Channel
       EventBroadCaster.navEventChannel.dispatchEvent(navEvent);

     * @param {String} _id - EventChannel ID
     * @memberof EventChannel
     */
    constructor(_id) {
        super();
        this.id = _id;
    }
}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * 
 * EventBroadCaster is Centralize Singleton Static Class use to Broadcast Events in Application on Application Channel or Navigation Channel from Publisher to Subscribers Objects such View, ViewNavigator, ViewManager, Component etc.  
 * 
 * Supports Event Communication with One to One , One to Many pattern
 */
class EventBroadCasters {


    /**
     * @example Publish using Navigation Channel
       //create Navigation Event
       let helloNavEvent = new NavigationEvent(EventUtils.NAV_CHANGE_EVENT, "Hello_NavEvent", "Message :: Hello World !!!", "/hello");

       // Dispatch Navigation Event on Navigation Event Channel
       EventBroadCaster.navEventChannel.dispatchEvent(navEvent);

       @example Subscribe using Navigation Channel to Receive Navigation Event
       
       EventBroadCaster.navEventChannel.addEventListener(EventUtils.NAV_CHANGE_EVENT, event => { this.handleNavChangeEvent(event); });


     * @memberof EventBroadCaster
     */
    constructor() {
        if (!EventBroadCasters.instance) {
            EventBroadCasters.instance = this;
            this.appEvtChannel = new EventChannel("APPLICATIONEVENT");
            this.navEvtChannel = new EventChannel("NAVIGATIONEVENT");
        }
        return EventBroadCasters.instance;

    }


    /**
     * @description Returns Application Event Channel Instance
     * @returns {Object}
     * @readonly
     * @memberof EventBroadCaster
     */
    get appEventChannel() {
        return this.appEvtChannel;
    }


    /**
     * @description Returns Navigation Event Channel Instance
     * @returns {Object} 
     * @readonly
     * @memberof EventBroadCaster
     */
    get navEventChannel() {
        return this.navEvtChannel;
    }



}

const EventBroadCaster = new EventBroadCasters();
// prevents new properties from being added to the object
Object.freeze(EventBroadCaster);

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 *
 * Navigation Generates Event with Navigation Type . Useful to dispatched Event with EventName, Params, Event Type, Route
 * 
 * It support loosely connected View and ViewNavigator.
 */
class NavigationEvent extends Event {

    /**
      *  @example 
       //create Navigation Event
       let helloNavEvent = new NavigationEvent(EventUtils.NAV_CHANGE_EVENT, "Hello_NavEvent", "Message :: Hello World !!!", "/hello");

       // Dispatch Navigation Event on Navigation Event Channel
       EventBroadCaster.navEventChannel.dispatchEvent(navEvent);
       
     * @param {string} _type
     * @param {string} _eventName
     * @param {Object} _params
     * @param {string} _route
     * @param {*} _bubbles
     * @param {Boolean} _cancelable
     * @memberof NavigationEvent
     */
    constructor(_type, _eventName, _params, _route, _bubbles, _cancelable, ) {
        super(_type, _bubbles, _cancelable);
        this.type = _type;
        this.eventName = _eventName;
        this.params = _params;
        this.route = _route;
    }


    /**
     *
     *
     * @returns {Object} - creates and return NavigationEvent Instance
     * @memberof NavigationEvent
     */
    clone() {
        return new NavigationEvent(this.type, this.eventName, this.params, this.route, this.bubbles, this.cancelable);
    }
}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 *
 * Generates Unique Instance ID
 * @class InstanceId
 */
class InstanceIds {

    constructor() {
        if (!InstanceIds.instance) {
            InstanceIds.instance = this;
            this.counter = 1;
        }
        return InstanceIds.instance;

    }


    /**
     *
     * Returns Unique Instance ID
     * @readonly
     * @memberof InstanceId
     */
    get generate() {
        return this.counter++;
    }

}

const InstanceId = new InstanceIds();

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 *
 * ElementUtils creates DOM wrapper for JSactions core Objects such as View, ViewNavigator, ViewStack, Component, Container
 * 
 * JSactions core object ->  HTML DOM wrapper
 * 
   ViewNavigator HTML DOM wrapper:
       &lt; div class="jsact-viewnavigator ${navigatorId}" &gt;

   ViewStack HTML DOM wrapper:
        &lt; div class="jsact-viewstack ${viewstackId}" &gt;

   View HTML DOM wrapper:
         &lt; div class="jsact-view ${viewId}" &gt;

   Container HTML DOM wrapper:
         &lt; div class="jsact-container ${containerId}" &gt;

   Component HTML DOM wrapper:
        &lt; div class="jsact-component ${componentId}" &gt;
 * 
 * 

 */
class ElementUtils {
    
    /**
     *
     * Find  Component DOM Element by ComponentID
     * @example
        let tmpViewId = this.id; 
        let buttonEl = ElementUtils.component("buttonComp",tmpViewId);

     * @static
     * @param {string} _componentId
     * @param {string} _viewId
     * @returns {string} Component DOM Element with ".jsact-component" css class
     * @memberof ElementUtils
     */
    static component(_componentId,_viewId) {
        let viewEl = ElementUtils.view(_viewId);
        return viewEl.querySelector(".jsact-component." + _componentId);
    }


    /**
     *
     * Find  Container DOM Element by ContainerID
     * @example 
        let tmpViewId = this.id; 
        let buttonContEl = ElementUtils.container("helloContainer",tmpViewId);
     *
     * @static
     * @param {string} _containerId
     * @param {string} _viewId
     * @returns {string} Container DOM Element with ".jsact-container" css class
     * @memberof ElementUtils
     */
    static container(_containerId,_viewId) {
        let viewEl = ElementUtils.view(_viewId);
        return viewEl.querySelector(".jsact-container." + _containerId);
    }


    /**
     *
     * Find  View DOM Element by ViewID
     * @example 
        let tmpViewId = this.id; 
        let viewEl = ElementUtils.view(tmpViewId);

     * @static
     * @param {string} _viewId
     * @returns {string} View DOM Element with ".jsact-view" css class
     * @memberof ElementUtils
     */
    static view(_viewId) {
        return document.querySelector(".jsact-view." + _viewId);    }


    /**
     *
     * Find  ViewStack DOM Element by ViewStackID
     * @example 
        let tmpViewstackId = this.id; 
        let viewEl = ElementUtils.viewStack(tmpViewstackId);
     * @static
     * @param {string} _viewStackId
     * @returns {string} ViewStack DOM Element with ".jsact-viewstack" css class
     * @memberof ElementUtils
     */
    static viewStack(_viewStackId) {
        return document.querySelector(".jsact-viewstack." + _viewStackId);    }


    /**
     *
     * Find  ViewNavigator DOM Element by ViewNavigatorID
     * @example 
        let tmpNavigatorId = this.id; 
        let viewEl = ElementUtils.viewNavigator(tmpNavigatorId);
     * @static
     * @param {string} _viewNavId
     * @returns {string} ViewNavigator DOM Element with ".jsact-viewnavigator" css class
     * @memberof ElementUtils
     */
    static viewNavigator(_viewNavId) {
        return document.querySelector(".jsact-viewnavigator." + _viewNavId);    }


    /**
     *
     * Creates  Component Base DOM Element by ComponentID
     * @static
     * @param {string} _componentId
     * @returns {string} Component DOM Element with ".jsact-component" css class
     * @memberof ElementUtils
     */
    static constructComponentBaseElement(_componentId) {
        return `<div class="jsact-component ${_componentId}"></div>`;
    }


    /**
     *
     * Creates  Container Base DOM Element by ContainerID
     * @static
     * @param {string} _containerId
     * @returns {string} Container DOM Element with ".jsact-container" css class
     * @memberof ElementUtils
     */
    static constructContainerBaseElement(_containerId) {
        return `<div class="jsact-container ${_containerId}"></div>`;
    }

    /**
     *
     * Creates  View Base DOM Element by ViewID
     * @static
     * @param {string} _viewId
     * @returns {string} View DOM Element with ".jsact-view" css class
     * @memberof ElementUtils
     */
    static constructViewBaseElement(_viewId) {
        return `<div class="jsact-view ${_viewId}"></div>`;
    }


    /**
     *
     * Creates  ViewStack Base DOM Element by ViewStackID
     * @static
     * @param {string} _viewStackId
     * @returns {string} ViewStack DOM Element with ".jsact-viewstack" css class
     * @memberof ElementUtils
     */
    static constructViewStackBaseElement(_viewStackId) {
        return `<div class="jsact-viewstack ${_viewStackId}"></div>`;
    }


    /**
     *
     * Creates  ViewNavigator Base DOM Element by ViewNavigatorID
     * @static
     * @param {string} _navigatorId
     * @returns {string} ViewNavigator DOM Element with ".jsact-viewnavigator" css class
     * @memberof ElementUtils
     */
    static constructNavigatorBaseElement(_navigatorId) {
        return `<div class="jsact-viewnavigator ${_navigatorId}"></div>`;
    }


    /**
     *
     * Hide DOM Element
     * @static
     * @param {string} _el - DOM Element
     * @memberof ElementUtils
     */
    static hideElement(_el) {
        _el.style.display = 'none';
    }


    /**
     *
     * Show DOM Element
     * @static
     * @param {string} _el -  DOM Element
     * @memberof ElementUtils
     */
    static showElement(_el) {
        _el.style.display = 'block';
    }


    /**
     *
     * Check if DOM Element is visible
     * @static
     * @param {string} _el - DOM Element
     * @returns {Boolean} 
     * @memberof ElementUtils
     */
    static isVisible(_el){
        return (_el.style.display == "block") ? true :false;
    }


    /**
     *
     * Generate Unique Component Instance ID
     * @static
     * @returns {string} 
     * @memberof ElementUtils
     */
    static generateComponentId(){
        return "component"+InstanceId.generate;
    }


    /**
     *
     * Generate Unique Container Instance ID
     * @static
     * @returns {string}
     * @memberof ElementUtils
     */
    static generateContainerId(){
        return "container"+InstanceId.generate;
    }
}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * View consider as single UI screen. 
 * 
 * View contains Contents consist of "Containers" and "Components" and Model.
 * 
 * View can be use with Core HTML Components also.
 * 
 * View manages View Template or DOM Content such behaviour, event listners etc.
 * 
 * View created and manage by ViewNavigator.
 * 
 * View HTML DOM wrapper:
         &lt; div class="vjs-view ${viewId}" &gt;
 *
 * View LifeCycle methods executes in given order :
 *
 *  1) Creation : constructor, attachView, activateView
 *
 *  2) Destruction : deActivateView, detachView, destroy
 *
 *  Following methods overrides and implement by View subclass executes in given order :
 * 
 *  1) Creation : constructor, initView, createViewContent, addViewHandler, bindView
 * 
 *  2) Destruction : unBindView, removeViewHandler, destroy
 * 
 */
class View extends EventDispatcher {


    /**
     * @param {String} _id - View Id
     * @param {String} _route - View Route
     * @param {String} _navevent - View Navigation Event Name
     * @param {String} _navparams - Parameters pass to View 
     * @param {String} _parentViewStackId - Parent Viewstack Id 
     * @memberof View
     */
    constructor(_id, _route,_navevent, _navparams, _parentViewStackId) {
        super();
        this.id = _id;
        this.route = _route;
        this.navEvent = _navevent;
        this.navParams = _navparams;
        this.parentViewStackId = _parentViewStackId;
        this.navigatorContainerId = null; // Use when View is ParentNavigator
        this.isAttached = false;
        this.isActive = false;
        this.initView();
    }

    /**
     *
     *
      @param {Event} event - Back Navigation Event dispatch by view component or method
     * @memberof View
     */
    dispatchNavBackEvent(event) {
        event.preventDefault();
        let navEvent = new NavigationEvent(EventUtils.NAV_CHANGE_EVENT, EventUtils.BACK_NAV_EVENT, null, this.route);
        EventBroadCaster.navEventChannel.dispatchEvent(navEvent);
    }

    /**
     *
     * @override
     * @description Call by View Constructor
     * @public
     * @memberof View
     */
    initView() {}

    /**
     * @override
     * @description Create View Contents and Internal Components
     * @public
     * @memberof View
     */
    createViewContent() {

    }

    /**
     * @override
     * @description Add Event Handlers for view Internal Components
     * @public
     * @memberof View
     */
    addViewHandler() {

    }

    /**
     * @override
     * @description Remove Event Handlers for view Internal Components
     * @memberof View
     */
    removeViewHandler() {

    }

    /**
     * @override
     * @description Bind View Component Properties with Model or other view Components
     * @public
     * @memberof View
     */
    bindView() {}

    /**
     * @override
     * @description Remove Bind View Component Properties with Model or other view Components
     * @public
     * @memberof View
     */
    unBindView() {}

    /**
     * @override
     * @description Destroy Method used to cleanup view resources
     * Call by ViewNavigator to destroy view
     * Remove Event Handlers, Make Properties null, 
     * Remove View Components and its reference.
     * @public
     * @memberof View
     **/
    destroy() {
    }

    /**
     * @description
     * View Lifecycle Method,
     * Call by ViewNavigator,
     * 
     * attachView Responsible to render view content, listners etc,
     * 
     * Dispatch "ATTACHED_EVENT" when view got attached / rendered,
     * 
     * Following methods call by attachView :
     * createViewContent
     * addViewHandler
     * bindView
     * @param {String} _parentEl 
     */
    attachView(_parentEl = null) {
        if (!this.isAttached) {
            let parentEl = _parentEl;
            if (parentEl == null)
                parentEl = ElementUtils.viewStack(this.parentViewStackId);
            parentEl.insertAdjacentHTML('beforeend', ElementUtils.constructViewBaseElement(this.id));
            this.isAttached = true;
            let tmpEle = this.getViewElement();
            ElementUtils.hideElement(tmpEle);
            //Create View Contents and Internal Components
            this.createViewContent();
            //Add Event Handlers for view Internal Components
            this.addViewHandler();
            //Bind View Component Properties with Model or other view Components
            this.bindView();
            this.dispatchEvent(EventUtils.ATTACHED_EVENT);
        }
    }

    /**
     * @description 
     * View Lifecycle Method
     * 
     * Call by ViewNavigator
     * 
     * attached View visible
     * @public
     * @memberof View
     */
    activateView() {
        if (!this.isActive) {
            let tmpViewEl = this.getViewElement();
            ElementUtils.showElement(tmpViewEl);
            this.isActive = true;
        }
    }

    /**
     * @description
     * View Lifecycle Method
     * 
     * Call by ViewNavigator
     * 
     * attached View if visible (active) then will become nonvisible
     * @public
     * @memberof View
     */
    deActivateView() {
        if (this.isActive) {
            let tmpViewEl = this.getViewElement();
            ElementUtils.hideElement(tmpViewEl);
            this.isActive = false;
        }
    }

    /**
     * @description
     * View Lifecycle Method
     * 
     * Call by ViewNavigator
     * 
     * View will be remove if View is attached 
     * @public
     * @memberof View  
    */
    detachView() {
        if (this.isAttached) {
            this.unBindView();
            this.removeViewHandler();
            let tmpViewEle = this.getViewElement();
            tmpViewEle.parentNode.removeChild(tmpViewEle);
            this.isAttached = false;
            this.dispatchEvent(EventUtils.DETACHED_EVENT);
        }
    }

    /**
     * @description RefreshView method reset View properties or data
     * @override
     * @memberof View
    */
    refreshView() {

    }

    /**
     *
     * @description Returns View DOM Element
     * @returns {string} 
     * @memberof View
     */
    getViewElement() {
        let tmpViewEl = null;
        if (this.isAttached) {
            tmpViewEl = ElementUtils.view(this.id);
        }

        return tmpViewEl;
    }

    getNavContainerId(_navId=null){
        return this.navigatorContainerId;
    }


    /**
     *
     * @description Add Content DOM ELement to View DOM Element
     * @param {string} _tmpViewContentEl - Content DOM Element
     * @memberof View
     */
    addToViewElement(_tmpViewContentEl){
        let tmpViewElement = this.getViewElement();
        tmpViewElement.insertAdjacentHTML('beforeend', _tmpViewContentEl);
    }

}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 *
 *
 * ElementState is static class and provies common states of Element as Constants.
 */
class ElementState {


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get LOADING() {
        return "loading";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get LOADED() {
        return "loaded";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get SUCCESS() {
        return "success";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get ERROR() {
        return "error";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get WARNING() {
        return "warning";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get READONLY() {
        return "readonly";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get ENABLED() {
        return "enabled";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get DISABLED() {
        return "disabled";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get DEFAULT() {
        return "default";
    }

}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 *
 * The Component class is the base class for all visual components. 
 * 
 * When setting "_createDOMElement=false" while creating instance of Component, Component class skip render DOM element part, assuming Component DOM Element already available and it take DOM element reference by componentId during Component creation.  
 *
 *
 * Component HTML DOM wrapper:
        &lt; div class="vjs-component ${componentId}" &gt;
 *
 * Component Class provides lifecycle methods as follows to manage DOM Elements and Standard Form Controls.
 *
 * 1) Creation & Initialization : constructor, init, attach
 *
 * 2) Update : refresh
 *
 * 3) Destruction : detach, destroy
 *

 * Create custom component by extending base Component Class and overrides and implement following methods which will executes in below given order
 *

 * 1) Creation & Initialization : constructor, init, initComponent, createDOMContent, addEventHandler,  bind

 *
 * 2) Update : changeComponentState, refresh, setComponentRequired, setComponentReadOnly, setComponentEnabled
 *
 * 3) Destruction : removeEventHandler, unBind, destroy
 *
 */
class Component extends EventDispatcher {
    
    /**
     * Creates an instance of Component.
     * @example Create an instance of Component in View Class in "createViewContent" method
    
        createViewContent() {
        let tmpViewContentEl = this.createViewHTML();
        this.addToViewElement(tmpViewContentEl);

        this.cmpButton1 = new MyButton("cmpBtn",this.id,"helloContainer",true);
        this.cmpButton1.init("My Component");
        this.cmpButton1.attach();
        this.cmpButton1.enabled = true;
        }

     *
     * @param {string} [_id=null] - ComponentID
     * @param {string} [_parentViewId=null] - Component Parent View ID
     * @param {string} [_parentContainerId=null] - Component Parent Container ID
     * @param {boolean} [_createDOMElement=true] - True if Component DOM element create from Template , False if taken from DOM.
     * @memberof Component
     */
    constructor(_id = null, _parentViewId = null,_parentContainerId=null, _createDOMElement = true) {
        super();
        this.isEnabled= true;
        this.isAttached = false;
        this.elState = ElementState.DEFAULT;
        this.isRequired = false;
        this.isReadOnly = false;
        this.createDOMElement = _createDOMElement;
        this.id = _id;
        this.formId = "defaultform";
        if((_id == null)|| (_id == ""))
            this.id = ElementUtils.generateComponentId();
        this.parentViewId = _parentViewId;
        this.parentContainerId = _parentContainerId;
    }

    /**
     *
     * Initialise Component properties and model
     * Call by View or Parent
     * @memberof Component
     */
    init() {
		this.initComponent();
	}
    
    /**
     * @override
     * @description call by init method
     * @memberof Component
     */
    initComponent(){}
 
    /**
     * creates DOM Contents of Component
     * Overrides by SubClass
     * Call by attach Method
     */
    createDOMContent() {}

    /**
     *
     * Add Component Content DOM Element to Component
     * @param {string} _tmpCompContentEl - DOMElement 
     * @memberof Component
     */
    addToComponentElement(_tmpCompContentEl){
        let tmpCompElement = this.componentElement;
        tmpCompElement.insertAdjacentHTML('beforeend', _tmpCompContentEl);
    }

    /**
     *
     * 
     * @description Add Event Handlers for Component DOM Elements and Model
     * Call by attach & set domElement Method
     * @override
     * @memberof Component
     */
    addEventHandler() {}

    /**
     * @override
     * @description Remove Event Handlers for Component DOM Elements and Model
     * call by destroy method
     * @memberof Component
     */
    removeEventHandler() {}

    /**
     * Overrides by SubClass
     * Bind Component Properties with Model or other Components
     * call by attach & view
     */ 
    bind() {}

    /**
     * Overrides by SubClass
     * Remove Bind on Component Properties with Model or other Components
     */
    unBind() {}

    /**
     * returns Component DOM Element
     */
    get componentElement() {
        let tmpComponentEl = null;
        if (this.isAttached) {
            tmpComponentEl = ElementUtils.component(this.id,this.parentViewId);
        }
        return tmpComponentEl;
    }
    
    /**
     * returns ParentViewID
     */
    get parentView(){
        return this.parentViewId;
    }

    /**
     * returns Parent Container ID
     */
    get parentContainer(){
        return this.parentContainerId;
    }

    /**
     * returns Component current state
     */
    get currentState() {
        return this.elState;
    }

    /**
     * change Component State
     */
    changeState(_state = "default"){
        this.elState = _state;
        this.changeComponentState();
    }

    /**
     * change Component State
     * Overrides by Subclass
     */
    changeComponentState(){}

    /**
     * returns True if Component is Required
     */
    get required(){
        return this.isRequired;
    }

    set required(_isRequired = false){
        this.isRequired = _isRequired;
        this.setComponentRequired();
    }

    /**
     * Overrides by Subclass
     */
    setComponentRequired(){}

    /**
     * returns True if Component is ResdyOnly
     */
    get readOnly(){
        return this.isReadOnly;
    }

    set readOnly(_isReadOnly = false){
        this.isReadOnly = _isReadOnly;
        if(this.isReadOnly == true){
            this.changeState(ElementState.READONLY);
        }else{
            this.changeState(ElementState.DEFAULT);
        }
        this.setComponentReadOnly();
    }  
    
    /**
     * Overrides by Subclass
     */
    setComponentReadOnly(){}


    /**
     * Boolean Property , returns True if Component is Enabled
     */
    get enabled() {
        return this.isEnabled;
    }

    set enabled(_isenabled = false){
        this.isEnabled = _isenabled;
        this.setComponentEnabled();
    }

    /**
     * Overrides by Subclass
     */
    setComponentEnabled(){}

    /**
     * Boolean Property , returns True if Component is Visible
     */
    get visible(){
        let tmpComponentEl = this.componentElement;
        return ElementUtils.isVisible(tmpComponentEl);
    }

    set visible(_visible){
        let tmpComponentEl = this.componentElement;
        if(_visible)
            ElementUtils.showElement(tmpComponentEl);
        else 
            ElementUtils.hideElement(tmpComponentEl);

    }

     /**
     * Component Lifecycle Method
     * Call by View or call manually 
     * attach Responsible to render component content, listners etc
     * Dispatch "ATTACHED_EVENT" when view got attached / rendered 
     * Following methods call by attach method
     * createDOMContent
     * addViewHandler
     * bind
     *  
     */
     attach() {
        if (!this.isAttached) {   
            this.isAttached = true;
            if(this.createDOMElement == true){
                let parentEl = ElementUtils.container(this.parentContainerId,this.parentViewId);
                parentEl.insertAdjacentHTML('beforeend', ElementUtils.constructComponentBaseElement(this.id));
                let tmpEle = this.componentElement;
                ElementUtils.hideElement(tmpEle);
                //Create  Contents and Internal Components
                this.createDOMContent();
            }
            
            //Add Event Handlers for view Internal Components
            this.addEventHandler();
            //Bind  Component Properties with Model or other  Components
            this.bind();
            this.enabled = true;
            this.visible = true;
            this.dispatchEvent(EventUtils.ATTACHED_EVENT);
        }
    }

    /**
     * Component Lifecycle Method
     * Call by View or call manually 
     * Component will be remove if Component is attached
    */
    detach() {
        if (this.isAttached) {
            this.unBind();
            this.removeEventHandler();
            let tmpComponentEle = this.componentElement;
            tmpComponentEle.parentNode.removeChild(tmpComponentEle);
            this.isAttached = false;
            this.dispatchEvent(EventUtils.DETACHED_EVENT);
        }
    }

    /**
     * Refresh Component data and model and event listners
     * Overrides by SubClass
     */
    refresh() {}

    /**
     * Overrides by SubClass
     * Destroy Method used to cleanup component resources
     * Call by View or call manually to destroy view
     * Remove Event Handlers, Make Properties null, 
     * Remove DOM Element contents and its reference.
     **/
    destroy() {}

}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 *
 * Container contains jsaction Components. Create custom container by extending base Container Class.
 * 
 * Container HTML DOM wrapper:
         &lt; div class="vjs-container ${containerId}" &gt;
 * 
 */
class Container extends EventDispatcher {

    /**
     * 
     * @param {string} [_id=null]
     * @param {string} [_parentViewId=null]
     * @param {boolean} [_createDOMElement=true]
     * @memberof Container
     */
    constructor(_id = null, _parentViewId = null, _createDOMElement = true) {
        super();
        this.isEnabled= false;
        this.createDOMElement = _createDOMElement;
        this.isAttached = false;
        this.id = _id;
        if((_id == null)|| (_id == ""))
            this.id = ElementUtils.generateContainerId();
        this.parentViewId = _parentViewId;
    }
    
    /**
     *
     * @override
     * @memberof Container
     */
    initContainer(){
        
    }
    
    /**
     *
     * @description Call by View or Parent
     * @public
     * @memberof Container
     */
    init() {
		this.initContainer();
	}

    /**
     * @description Call by attach Method
     * @override
     * @memberof Container
     */
    createDOMContent() {

    }

    /**
     *
     * @description Get Container HTML Content
     * @readonly
     * @memberof Container
     */
    get containerElement() {
        let tmpContainerEl = null;
        console.log("containerElement: "+this.isAttached);
        if (this.isAttached) {
            tmpContainerEl = ElementUtils.container(this.id,this.parentViewId);
        }
        return tmpContainerEl;
    }
   

    /**
     *
     * @description Returns Parent ViewID
     * @readonly
     * @memberof Container
     */
    get parent(){
        return this.parentViewId;
    }


    /**
     * @description Returns true if Container is enabled
     * @returns {Boolean} 
     * @readonly 
     * @memberof Container
     */
    get enabled() {
        return this.isEnabled;
    }


    set enabled(_isenabled = false){
        this.isEnabled = _isenabled;
    }

    /**
     * Boolean Property , returns True if Component is Visible
     * @returns {Boolean} true if Container is visible
     * @memberof Container
     */
    get visible(){
        let tmpContainerEl = this.containerElement;
        return ElementUtils.isVisible(tmpContainerEl);
    }


    set visible(_visible){
        let tmpContainerEl = this.containerElement;
        if(_visible)
            ElementUtils.showElement(tmpContainerEl);
        else 
            ElementUtils.hideElement(tmpContainerEl);

    }

     // 

     /**
      * @description
      * Container Lifecycle Method,
      * Call by View or manually 
      * 
      * attachView Responsible to render view content, listners etc,
      * 
      * Dispatch "ATTACHED_EVENT" when view got attached / rendered
      * @memberof Container
      */
     attach() {
        let parentEl = null;
        
        if (this.isAttached == false) {
            this.isAttached = true;
                parentEl = ElementUtils.view(this._parentViewId);
               
            if(this.createDOMElement == true){
                parentEl.insertAdjacentHTML('beforeend', ElementUtils.constructContainerBaseElement(this.id));
                let tmpEle = this.element;
                
                ElementUtils.hideElement(tmpEle);
                
                //Create  Contents and Internal Components
                this.createDOMContent();
            }
            this.enabled = true;
            this.visible = true;
            this.dispatchEvent(EventUtils.ATTACHED_EVENT);
        }
    }


    /**
     * @description
     * Container Lifecycle Method
     * 
     * Call by View or Manually
     * 
     * Container will be remove if View is attached 
     * @public
     * @memberof Container  
    */
    detach() {
        if (this.isAttached) {
            let tmpContainerEl = this.componentElement;
            tmpContainerEl.parentNode.removeChild(tmpContainerEl);
            this.isAttached = false;
            this.dispatchEvent(EventUtils.DETACHED_EVENT);
        }
    }

    /**
     *
     * @description Call by View
     * @override
     * @memberof Container
     */
    refresh() {

    }

    /**
     *
     * @description Call by View
     * @override
     * @memberof Container
     */
    destroy() {
        //TODO
    }

    

}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * ViewStack maintains history of Views.
 * 
 * ViewStack HTML DOM wrapper:
        &lt; div class="vjs-viewstack ${viewstackId}" &gt;
 *
 */
class ViewStack extends EventDispatcher {


    /**
     * 
     * @param {string} _id - ViewStack ID
     * @param {string} _route - Path Route Name
     * @param {string} _parentId - ViewStack ParentID
     * @memberof ViewStack
     */
    constructor(_id, _route, _parentId) {
        super();
        this.id = _id;
        this.route = _route;
        this.parentId = _parentId;
        this.viewStack = [];
        this.isRendered = false;
        this.initViewStack();
    }


    /**
     *
     * @description Initialize ViewStack , Implement by Subclass
     * @override
     * @memberof ViewStack
     */
    initViewStack() {

    }


    /**
     *
     * @description Push View in Viewstack
     * @param {string} _viewId
     * @param {array} _views
     * @memberof ViewStack
     */
    pushViewElement(_viewId, _views) {

        for (let viewObj in _views) {
            let tmpview = _views[viewObj];
            if (tmpview.isActive) {
                tmpview.deActivateView();
            }
        }
        this.viewStack.push(_viewId);

    }


    /**
     * @description 
     * Navigator will call view destroy method which will remove 
     * View DOM Element, EventListners reference to DOM Element,
     * Properties, Finally Object null to make garbage collected
     * @memberof ViewStack
     */
    popViewElement() {
        this.viewStack.pop();
    }


    /**
     *
     * @description Returns Active View Id 
     * @returns {string} ViewID
     * @memberof ViewStack
     */
    getActiveViewId() {
        if (this.viewStack.length > 0)
            return this.viewStack[this.viewStack.length - 1];
    }


    /**
     *
     * @description Returns Viewstack DOMElement
     * @public
     * @returns {string} DOM ELement
     * @memberof ViewStack
     */
    getViewStackElement() {
        let el = null;
        if (this.isRendered) {
            el = this.getViewStackRootElement();
        }
        return el;
    }

    
    /**
     *  
     * @description Returns Viewstack Root DOMElement
     * @override
     * @private 
     * @returns {string} DOM Element
     * @memberof ViewStack
     */
    getViewStackRootElement() {
        return ElementUtils.viewStack(this.id);
    }


    /**
     *
     * @description Render ViewStack DOMElement contents
     * @public
     * @memberof ViewStack
     */
    render() {
        if (!this.isRendered) {
            this.renderViewStack();
            this.renderViewStackContent();
            this.isRendered = true;
        }
    }


    /**
     *
     * @description Render ViewStack DOMElement 
     * Called by Render method
     * @private
     * @memberof ViewStack
     */
    renderViewStack() {
        let tmpParentNavigatorEl = ElementUtils.viewNavigator(this.parentId);
        let tmpViewStackEl = ElementUtils.constructViewStackBaseElement(this.id);
        tmpParentNavigatorEl.insertAdjacentHTML('beforeend', tmpViewStackEl);
    }

    /**
     *
     * @override
     * @memberof ViewStack
     */
    renderViewStackContent() {}

    
    /**
     * 
     * @description 
     * Destroy Method used to cleanup viewstack resources
     * Call by ViewNavigator to destroy view
     * Remove Event Handlers, Make Properties null, 
     * Remove View Components and its reference.
     * @override
     * @public
     * @memberof ViewStack
     */
    destroy() {
        this.route = null;
        this.viewStack = [];
        this.isRendered = false;
        let tmpParentNavigatorEl = ElementUtils.viewNavigator(this.parentId);
        let tmpViewStackEl = ElementUtils.viewStack(this.id);
        tmpParentNavigatorEl.removeChild(tmpViewStackEl);
        this.parentId = null;
        this.id = null;
    }


}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * 
 * 
 * UI navigation  manages by ViewNavigator. 
 * 
 * ViewNavigator is base class which have simple view navigation functionality.
 * 
 * It manages set of view using stack-based history mechanism which also called as ViewStack.
 * 
 * Each Viewstack represent its own view history stack.Having multiple Viewstacks ViewNavigator can manage multiple history stacks.
 * 
 * ViewNavigator also Manages LifeCycle of View.
 * 
 * ViewNavigator HTML DOM wrapper:
       &lt; div class="vjs-viewnavigator ${navigatorId}" &gt;
 *
 * ViewNavigator LifeCycle methods executes in given order :
 *
 *  1) Creation : constructor, initNavigator, render
 *
 *  2) Destruction : destroy
 *
 *  Following methods overrides and implement by ViewNavigator subclass executes in given order :
 * 
 *  1) Creation : constructor, initNavigator, renderNavigatorContent, createView, createViewStack, initEventRoutes
 * 
 *  2) Destruction : destroy
 * 
 */
class ViewNavigator extends EventDispatcher {

    /**
     * @description
     * UI navigation  manages by ViewNavigator. 
     * 
     * ViewNavigator" is base class which have simple view navigation functionality.
     * 
     * ViewNavigator manages set of view using stack-based history mechanism which also called as ViewStack.
     * 
     * Each Viewstack represent its own view history stack. So vyanjs supports multiple history stack too.
     * 
     * ViewNavigator also Manages LifeCycle of View.
     *
     * @param {String} _id - ViewNavigator ID
     * @param {String} _parentId - Parent ID View or "root" DOM Element
     * @param {String} _parentContainerId - Parent Container ID
     * @memberof ViewNavigator
     */
    constructor(_id, _parentId = null,_parentContainerId = null) {
        super();
        this.id = _id;
        // HTML ID attribute only 
        this.parentId = _parentId;
        this.parentContId = _parentContainerId;
        this.activeViewId = null;
        this.activeViewStackId = null;
        this.activeRoute = null;
        this.views = {};
        this.viewstacks = {};
        this.eventRoute = new EventRouter();
        this.isRendered = false;
        this.navigationHistory = true;
        this.initNavigator();
    }

    /**
     * @description Implemented by Subclass 
     * Call by ViewNavigator Constructor
     * @override
     * @memberof ViewNavigator
     */
    initNavigator() {

    }

    /**
     * Sets Navigation History 
     * Boolean Property , returns True if Component is Enabled
     */
    get history() {
        return this.navigationHistory;
    }

    set history(_navigationHistory = true){
        this.navigationHistory = _navigationHistory;
    }

    get parentContainer() {
        return this.parentContId;
    }

    /**
     * @description Set EventRouter for ViewNavigator, EventRouter is useful for EventBased Navigation and for navigation of single view or multiple views.
     * @param {Object} _router - EventRouter
     * @memberof ViewNavigator
     */
    set eventRouter(_router) {
        if (!_router instanceof EventRouter) {
            throw new Error("ViewNavigator : Wrong Type of Router");
        }
        this.eventRoute = _router;
    }

    /**
     * @description Returns EventRouter instance of ViewNavigator
     * @returns {object} - EventRouter Instance
     * @readonly
     * @memberof ViewNavigator
     */
    get eventRouter() {
        return this.eventRoute;
    }

    /**
     * 
     * @description 
     * By Default View class will be created
     * When Overrides by Subclass , custom Views will be created
     * @override
     * @param {String} _viewId - View ID
     * @param {String} _route - Navigation Route / Path 
     * @param {String} _navparams - Navigation Parameters pass to View
     * @param {String} _viewStackId - Parent Viewstack ID of View
     * @returns {Object} - View Instance
     * @memberof ViewNavigator
     */
    createView(_viewId, _route, _navparams, _viewStackId) {
        return new View(_viewId, _route, _navparams, _viewStackId);
    }

    /**
     * @description 
     * By Default ViewStack class will be created
     * When Overrides by Subclass , custom Viewstack will be created 
     * @override
     * @param {String} _viewStackId - ViewStack ID
     * @param {String} _route - Navigation Route / Path 
     * @param {String} _parentId - Parent ViewNavigator ID
     * @returns {Object} - ViewStack Instance
     * @memberof ViewNavigator
     */
    createViewStack(_viewStackId, _route, _parentId) {
        return new ViewStack(_viewStackId, _route, _parentId);
    }

    /**
     * @description 
     * Call by ViewManager
     * Navigation Route and Navigation EventRoute Combination must be unique
     * @param {String} _route - Navigation Route
     * @param {String} _navevent - Navigation Event Route 
     * @param {String} _navparams - Parameters pass to View
     * @memberof ViewNavigator
     */
    navigate(_route, _navevent, _navparams) {
        let tmpviewStackId = null;
        if (this.navigationHistory == false) {
            this.navigateBack(_route);
        }

        tmpviewStackId = this.eventRoute.findViewStackId(_navevent, _route);
        let tmpViewStack = this.getViewStack(tmpviewStackId);
        if (tmpViewStack == null)
            tmpViewStack = this.createViewStack(tmpviewStackId, _route, this.id);

        // Viewstack have _parentId

        tmpViewStack.render(); // will construct Element and add it to DOM parent
        this.activeViewStackId = tmpviewStackId;
        this.viewstacks[tmpviewStackId] = tmpViewStack;

        let tmpviewId = this.eventRoute.findViewId(_navevent, _route);
        let tmpView = this.getView(tmpviewId);
        if (tmpView == null)
            tmpView = this.createView(tmpviewId, _route, _navevent, _navparams, tmpviewStackId);
        this.removeActiveMenuElement();
        let tmpViewStackEl = tmpViewStack.getViewStackElement();
        this.activeViewId = tmpviewId;
        this.views[tmpviewId] = tmpView;
        this.activeRoute = _route;
        tmpView.attachView(tmpViewStackEl); // will construct Element and add it to DOM parent
        tmpViewStack.pushViewElement(tmpviewId, this.views);
        tmpView.activateView();
        this.setActiveMenuElement(_navevent);
    }

    /**
     * @description 
     * Call by ViewManager or ViewNavigator internally
     * Navigate back to previous View if history set to true
     * @param {String} _route
     * @memberof ViewNavigator 
     */
    navigateBack(_route) {
        if (_route == this.activeRoute) {
            let tmpViewStack = this.getViewStack(this.activeViewStackId);
            tmpViewStack.popViewElement();
            let tmpView = this.views[this.activeViewId];
            tmpView.deActivateView();
            tmpView.detachView();
            tmpView.destroy();
            this.removeActiveMenuElement();
            tmpView = null; // make garbage collected
            this.views[this.activeViewId] = null;
            delete this.views[this.activeViewId];
            if (this.navigationHistory == true) {
                this.activeViewId = tmpViewStack.getActiveViewId();
                let tmpViewBack = this.views[this.activeViewId];
                tmpViewBack.activateView();
                let tmpNavEvent = this.views[this.activeViewId].navEvent;
                this.setActiveMenuElement(tmpNavEvent);
                this.activeRoute = this.views[this.activeViewId].route;
            }
        }
    }

    /**
     * @description Navigate Back to Specific View
     * @param {String} _viewId - View ID
     * @todo To be Implemented
     * @memberof ViewNavigator
     */
    navigateBackToView(_viewId) {

    }

    /**
     * @description Navigate to Specific View
     * @param {String} _viewId - View ID
     * @todo To be Implemented
     * @memberof ViewNavigator
     */
    navigateToView(_viewId) {

    }


    /**
     *
     * @description This method will be implemented by Subclass
     * @memberof ViewNavigator
     */
    removeActiveMenuElement(){

    }

    /**
     *
     * @description This method will be implemented by Subclass
     * @param {string} _navEvent - Navigation Event Name
     * @memberof ViewNavigator
     */
    setActiveMenuElement(_navEvent){

    }

    /**
     * @description Get ViewStack Object by ViewStackId
     * @param {String} _viewStackId - ViewStackID
     * @returns {Object} - ViewStack Instance
     * @memberof ViewNavigator
     */
    getViewStack(_viewStackId) {
        let tmpVstack = null;
        tmpVstack = this.viewstacks[_viewStackId];
        return tmpVstack;
    }

    /**
     * @description Get ViewObject by ViewId
     * @param {string} _viewId - ViewID
     * @returns {Object} - View Instance
     * @memberof ViewNavigator
     */
    getView(_viewId) {
        let tmpV = null;
        tmpV = this.views[_viewId];
        return tmpV;
    }

    /**
     * @description 
     * ViewNavigator Lifecycle Method,
     * Call by ViewManager,
     * Render ViewNavigator DOM Content
     * @public
     * @memberof ViewNavigator
     */
    render() {
        if (!this.isRendered) {
            this.renderNavigator();
            this.renderNavigatorContent();
        }
    }

    /**
     *
     * @description Renders, ViewNavigator DOM Element , it call by Render Method 
     * @private
     * @memberof ViewNavigator
     */
    renderNavigator() {
        let tmpParentId = this.parentId;
        let tmpParentElement = null;
        if (this.parentId != "root") {
            tmpParentElement = ElementUtils.container(this.parentContainer,this.parentId);
        } else {
            tmpParentElement = document.getElementById(tmpParentId);
        }
        if (tmpParentElement != null) {
            let tmpNavigatorEl = ElementUtils.constructNavigatorBaseElement(this.id);
            tmpParentElement.insertAdjacentHTML('beforeend', tmpNavigatorEl);
            this.isRendered = true;
        } else {
            throw new Error("ViewNavigator : No Parent Element found for Navigator");
        }

    }

    
    /**
     * @description Render Navigator Subclass DOM Element content
     * @private
     * @override
     * @memberof ViewNavigator
     */
    renderNavigatorContent() {}


    /**
     * 
     * @description 
     * ViewNavigator Lifecycle Method,
     * 
     * Call by ViewManager to destroy ViewNavigator,
     * 
     * Remove Event Handlers, Make Properties null, 
     * 
     * Remove Views and Viewstack objects.
     * 
     * Remove ViewNavigator DOM Element and Its Contents
     * 
     * Remove EventRoute Object
     * 
     * @public
     * @memberof ViewNavigator
     */
    destroy() {
        for (let viewObj in this.views) {
            let tmpview = this.views[viewObj];
            tmpview.destroy();
        }
        for (let viewStkObj in this.viewstacks) {
            let tmpviewstk = this.viewstacks[viewStkObj];
            tmpviewstk.destroy();
        }


        let tmpNavigatorEl = ElementUtils.viewNavigator(this.id);
        tmpNavigatorEl.parentNode.removeChild(tmpNavigatorEl);

        this.views = null;
        this.viewstacks = null;
        this.parentId = null;
        this.id = null;
        this.parentId = null;
        this.parentContId = null;
        this.activeViewId = null;
        this.activeViewStackId = null;
        this.activeRoute = null;
        this.eventRoute = null;
        this.isRendered = false;

    }

}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 *
 * ViewManager manages ViewNavigator.
 * 
 * It Subscribe to EventBroadcaster's Navigation channel to receive navigation change events.
 * 
 * ViewManager find ViewNavigator based on Path Routes data and it match route info received in navigation change event.
 * 
 * Following methods overrides and implement by ViewManager subclass executes in given order :
 * 
 *  1) initialize
 * 
 *  2) createNavigator
 * 
 *  3) initRoutes
 * 
 * 
 */
class ViewManager extends EventDispatcher {


    /**
     * @description ViewManager manages ViewNavigator.It Subscribe to EventBroadcaster's Navigation channel to receive navigation change events.
     * ViewManager find ViewNavigator based on Path Routes data and it match route info received in navigation change event.
     * 
     * @memberof ViewManager
     */
    constructor() {
        super();
        this.preinitialize();
        this.initialize();
    }


    /**
     * @description preinitialize navigators,router etc.
     * @private
     * @memberof ViewManager
     */
    preinitialize() {
        
        this.router = new Router();
        this.rootId = "root";

        this.navigators = {};
        this.currentRouteNavArray = [];
        this.currentRoute = null;

        EventBroadCaster.navEventChannel.addEventListener(EventUtils.NAV_CHANGE_EVENT, event => { this.handleNavChangeEvent(event); });
    }

    /**
     * @description Implement by subclass to initialise 
     * @example initialize method is to be override in "AppViewManager" class (subclass of ViewManager) 
     
       initialize() {
        super.initialize();
        this.initRoutes();
        }
     * 
     * @override
     * @public
     * @memberof ViewManager
     */
    initialize() {

    }

    /**
     * @description 
     * Viewmanager find Viewnavigator based on Routes info set in Router Object
     * 
     @example Sample Router Object is to be implement in "AppViewManager" class (subclass of ViewManager) 
     
        initRoutes() {
            let tmpRoutes = [
                { path: "/login", navigatorId: " LoginNavigator",parentId: "root" },
                { path: "/file", navigatorId: " FileNavigator",parentId: "root" },
                { path: "/logout", navigatorId: "ExitNavigator",parentId: "root" },
            ]
            this.routes = new Router(tmpRoutes);
        }

      Here "path" is routeID, "navigatorId" is viewNavigatorId, "parentId" is DOM Element Id or ViewId or ContainerId.
      By Default Main DOM Element have id="root"

     * 
     * @description Here path is routeID, navigatorID is viewNavigatorId, 
     * parentId is DOM Element Id or ViewId in case of Nested View Navigators
     * By Default Main DOM Element have id="root"
     * 
     * @memberof ViewManager
     */

    set routes(_router) {
        if (!_router instanceof Router) {
            throw new Error("ViewManager: Wrong Type of Router");
        }
        this.router = _router;
    }


    get routes() {
        return this.router;
    }

    /**
     * @description ViewManager calls createNavigator method when ViewNavigator is not created yet. 
     * 
     * @example createNavigator method is to be override in "AppViewManager" class (subclass of ViewManager) 
       
       createNavigator(_navigatorId, _parentId,_parentContainerId) {
        let tmpNavigator = null;
        switch (_navigatorId) {
            case "simpleNavigator":
                tmpNavigator = new SimpleNavigator(_navigatorId, _parentId,_parentContainerId);
            break;

            default:
                tmpNavigator = new ViewNavigator(_navigatorId, _parentId,_parentContainerId);

        }
        return tmpNavigator;
    }
     * 
     * @param {string} _navigatorId - ViewNavigatorId
     * @param {string} _parentId - ParentId is DOM Element id or ViewID
     * @param {string} _parentConId - ParentContainerID used in case of NestedNavigator
     * @returns {Object} - New Instance of ViewNavigator
     * @memberof ViewManager
     */
    createNavigator(_navigatorId, _parentId,_parentConId) {
        return new ViewNavigator(_navigatorId, _parentId,_parentConId);
    }

    /**
     * @description ViewManager maintains navigators object in Key, Value form.
     * Where key is viewNavigatorID and value is ViewNavigator Object Instance
     * @param {Object} _navigator - ViewNavigator
     * @param {string} _navigatorId - ViewNavigatorID
     * @memberof ViewManager
     */
    addNavigator(_navigator, _navigatorId) {
        this.navigators[_navigatorId] = _navigator;
        //this.currentNavigatorIds.push(_navigatorId);
    }


    addNavIdRoute(_route, _navigatorId) {
        //let newNavRoute = {route:"/path2",navId:"Navigator2"};
        let newNavRoute = {route:_route,navId:_navigatorId};
        this.currentRouteNavArray.push(newNavRoute);
    }

    /**
     * @returns {Object} - ViewNavigator Object Instance by ViewNavigatorId.
     * @param {string} _navigatorId - ViewNavigatorID
     * @memberof ViewManager
     */
    getNavigator(_navigatorId) {
        let tmpnavNav = null;
        if (this.navigators[_navigatorId] != null)
            tmpnavNav = this.navigators[_navigatorId];
        return tmpnavNav;
    }

    /**
     * @returns {Array} - NavigatorID Array 
     * @param {string} _route - Path Route Name
     * @memberof ViewManager 
     */
    findRouteNavigator(_route) {
        let tmpNavigatorIds = this.router.findNavigator(_route);
        return tmpNavigatorIds;
    }

    /**
     * @returns {string} - ParentID of ViewNavigator 
     * @param {string} _navigatorId - ViewNavigatorID
     * @memberof ViewManager
     */
    getNavigatorParent(_navigatorId) {
        let tmpNavParentId = this.router.findNavigatorParent(_navigatorId);
        return tmpNavParentId;
    }

    /**
     * @returns {string} - Parent Container ID of ViewNavigator 
     * @param {string} _route - Path Route Name
     * @param {string} _navParentViewId - Parent ViewID
     * @memberof ViewManager
     */
    getParentNavContainer(_route,_navParentViewId,_tmpNavId) {
        // { path: "/path9/path8", navigatorId: "Navigator4",parentId: "p9view1" },
        let tmpParentNavContrEl = this.rootId;
        if(_navParentViewId != this.rootId){
            let tmpNewRouteArray = _route.split("/");
            tmpNewRouteArray.shift();
            tmpNewRouteArray.splice(tmpNewRouteArray.length-1, 1);

            let tmpParentRouteId = "";
            for(let y=0;y < tmpNewRouteArray.length;y++){
                tmpParentRouteId += "/"+tmpNewRouteArray[y];
            }
            //let tmpParentRouteId = tmpparentRouteArray.toString();
            let tmpParentNavId = null;
                    for(let z= 0; z < this.currentRouteNavArray.length;z++){
                        let tmpRouteId = this.currentRouteNavArray[z].route;
                        if(tmpRouteId == tmpParentRouteId){
                            tmpParentNavId = this.currentRouteNavArray[z].navId;
                        }
                    }
            let tmpParentNav = this.navigators[tmpParentNavId];
            let tmpParentNavView = tmpParentNav.getView(_navParentViewId);
            tmpParentNavContrEl = tmpParentNavView.getNavContainerId(_tmpNavId);
        }
        return tmpParentNavContrEl;
    }

    handleNavChangeEvent(e) {
        let tmpRoute = e.route;
        let tmpNavEvtName = e.eventName;
        let tmpNavparams = e.params;
        this.changeNavigation(tmpRoute,tmpNavEvtName,tmpNavparams);    
    }

    /**
     * @description 
     * changeNavigation method called when ViewManager Receive Forward Navigation Event
     * @private
     * @param {String} _route - Navigation Route / Path 
     * @param {Event} _naveventname - Navigation EventName
     * @param {Object} _navparams - Navigation Parameters pass to ViewNavigator
     * @memberof ViewManager
     */
    changeNavigation(_route, _naveventname, _navparams) {
        let newRoute = _route;
        let navigatorIds = this.findRouteNavigator(_route);
        if (_naveventname == EventUtils.BACK_NAV_EVENT) {
            // No Need to destroy / hide navigator assuming its same navigator
            this.changeBackNavigation(navigatorIds, _route);
        } else {

            // 1) FirstTime load /path1
            if((this.currentRoute == null)&&(this.currentRouteNavArray.length == 0)){
                this.currentRoute = newRoute;
                this.changeForwardNavigation(navigatorIds, newRoute, _naveventname, _navparams);
            } else{
                let tmpResultArray = this.chkNewRouteHaveCurrentRoute(newRoute);
                if((this.currentRoute != newRoute)&& (tmpResultArray.length == 0)){
                    let unusedNavIds = [];
                    let tmpRouteAryLength = this.currentRouteNavArray.length -1;
                    for(let i=tmpRouteAryLength; i >= 0 ;i--){
                        unusedNavIds.push(this.currentRouteNavArray[i].navId);
                    }
                    this.destroyUnusedNavigators(unusedNavIds);
                    this.currentRouteNavArray = [];
                    this.currentRoute = newRoute;
                    this.changeForwardNavigation(navigatorIds, newRoute, _naveventname, _navparams);
                    
                } else {
                    //((this.currentRoute != newRoute)&& (tmpResultArray.length > 0))
                    //((this.currentRoute == newRoute)&& (tmpResultArray.length > 0))
                    //this.chkAndDestroyNestedNavs(this.currentRoute);
                    this.chkAndDestroyNestedNavs(newRoute);
                    this.currentRoute = newRoute;
                        this.changeForwardNavigation(navigatorIds, newRoute, _naveventname, _navparams);
                }
            } 
        } 
    }

    
    chkNewRouteHaveCurrentRoute(_newRoute){
        let tmpNewRouteArray = _newRoute.split("/");
        tmpNewRouteArray.shift();
        let tmpCurrRouteArray = this.currentRoute.split("/");
        tmpCurrRouteArray.shift();
        let tmpResultArray = tmpCurrRouteArray.filter(x => tmpNewRouteArray.includes(x));
        return tmpResultArray;
    }

    /**
     * @description 
     * changeBackNavigation change from current view to one previous view of viewstack by calling navigateBack method of multiple ViewNavigators associated same path route.
     * @private
     * @param {Array} _navigatorIds - Array of ViewNavigators.
     * @param {String} _route - Path route
     * @memberof ViewManager
     */
    changeBackNavigation(_navigatorIds, _route) {
        if (_navigatorIds.length > 0) {
            for (let j = 0; j < _navigatorIds.length; j++) {
                let tmpNavId = _navigatorIds[j];
                let tmpNavigator = this.getNavigator(tmpNavId);
                if(tmpNavigator.history == true){
                    tmpNavigator.navigateBack(_route);
                }
            }
        }

    }

    /**
     * @description 
     * changeForwardNavigation method called when ViewManager Receive Forward Navigation Event
     * @private
     * @param {Array} _navigatorIds - NavigatorId Array
     * @param {String} _route - Navigation Route / Path 
     * @param {Event} _navevent - Navigation Event
     * @param {Object} _navparams - Navigation Parameters pass to ViewNavigator
     * @memberof ViewManager
     */
    changeForwardNavigation(_navigatorIds, _route, _navevent, _navparams) {
        //this.checkAndDestroyNavigators(_navigatorIds, _route);
        if (_navigatorIds.length > 0) {
            for (let k = 0; k < _navigatorIds.length; k++) {
                let tmpNavid = _navigatorIds[k];
                let tmpNavigator = this.getNavigator(tmpNavid);
                if (tmpNavigator == null) {
                    // Add code here to find parent of Navigator.
                    let tmpNavParentId = this.getNavigatorParent(tmpNavid);
                    let tmpNavParentConId = this.getParentNavContainer(_route,tmpNavParentId,tmpNavid);
                    tmpNavigator = this.createNavigator(tmpNavid, tmpNavParentId,tmpNavParentConId);
                    this.addNavigator(tmpNavigator, tmpNavid);
                    this.addNavIdRoute(_route,tmpNavid);
                    tmpNavigator.render();
                    /* createNavigator will call internally addNavigator to save created navigator */
                    // tmpNavigator.addEventListner("changeNavEvent",onNavChangeEvent); 
                }
                tmpNavigator.navigate(_route, _navevent, _navparams);
            }
        }

    }

    chkAndDestroyNestedNavs(_route) {
        // Find Navigators Ids with current active route
        let tmpCurrNavIds = this.findRouteNavigator(_route);
        //let tmpNavIds = this.router.findRouteNavigators(_route);
        //let tmpCurrentNavIds = this.router.findRouteNavigators(this.currentRoute);
        let tmpCurrViewIds = [];
        let tmpNestNavIds = [];

        // Chk Active route Navigators have history false
        // If History false then get its ViewId
        if (tmpCurrNavIds.length > 0) {
            for (let x = 0; x < tmpCurrNavIds.length; x++) {
                let tmpCurrNavId = tmpCurrNavIds[x];
                if(this.navigators[tmpCurrNavId] != null)  {
                    let tmpViewId = this.navigators[tmpCurrNavId].activeViewId;
                    if(this.navigators[tmpCurrNavId].history == false){
                        tmpCurrViewIds.push(tmpViewId);
                    }
                } 
            }
        }

        // Find Navigators who have Active ViewId as Parent
        if (tmpCurrViewIds.length > 0) {
            for (let y = 0; y < tmpCurrViewIds.length; y++) {
                let tmpViwId = tmpCurrViewIds[y];
                let tmpNestNavId = this.chkViewAsNavigatorParent(tmpViwId);
                if(tmpNestNavId != null){
                    tmpNestNavIds.push(tmpNestNavId);
                }
            }
        }

        // Destory Navigators who have Active ViewId as Parent
        if(tmpNestNavIds.length > 0){
            this.destroyUnusedNavigators(tmpNestNavIds);
            this.delNavFromCurrRouteArr(tmpNestNavIds);
        }

    }

    delNavFromCurrRouteArr(_tmpNavIds){
        let p = _tmpNavIds.length;
        while(p >= 0){
            for(let n= 0; n < this.currentRouteNavArray.length;n++){
                let tmpRouteNavId = this.currentRouteNavArray[n].navId;
                if(tmpRouteNavId == _tmpNavIds[p]){
                    this.currentRouteNavArray.splice(n, 1); 
                }
            }
            p--;
        }

    }
    
    chkViewAsNavigatorParent(_viewId) {
        let tmpNavId = null;
        for( let nav in this.navigators){
            if(this.navigators[nav] != null){
                let tmpParentId = this.navigators[nav].parentId;
                if ((tmpParentId != null) && (tmpParentId == _viewId)){
                    tmpNavId = this.navigators[nav].id;
                } 
            } 
        }
        return tmpNavId;
    }

    /**
     * @description destroy unused Navigators
     * @private
     * @param {Array} _unusedNavigators 
     * @memberof ViewManager
     */
    destroyUnusedNavigators(_unusedNavigators) {
        if (_unusedNavigators.length > 0) {
            for (let p = 0; p < _unusedNavigators.length; p++) {
                let tmpNavid = _unusedNavigators[p];
                this.removeNavigator(tmpNavid);
            }
        }
    }

    /**
     * @description removes ViewNavigator object instance from navigators array.
     * @param {String} _navigatorId - NavigatorId
     * @memberof ViewManager
     */
    removeNavigator(_navigatorId) {
        let tmpnav = this.navigators[_navigatorId];
        tmpnav.destroy();
        tmpnav = null;
        this.navigators[_navigatorId] = null;
    };

    /**
     *
     * @todo Implment destroy method
     * @memberof ViewManager
     */
    destroyAll() {
        //TODO
    }
}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Generic Event is Useful to dispatch Custom Event with EventName, Params, Event Type
 * 
 * It support loosely connected View - View, View - Component Communication with One to One , One to Many pattern
 */
class GenericEvent extends Event {

    /**
     * @example 
       //create Generic Event
       let helloEvent = new GenericEvent(EventUtils.CHANGE, "HelloChangeEvent", "myParams");

       // Dispatch  Event on Application Event Channel
       EventBroadCaster.appEventChannel.dispatchEvent(helloEvent);
     * 
     * @param {string} _type
     * @param {string} _eventName
     * @param {Object} _params
     * @param {*} _bubbles
     * @param {Boolean} _cancelable
     * @memberof GenericEvent
     */
    constructor(_type, _eventName, _params, _bubbles, _cancelable ) {
        super(_type, _bubbles, _cancelable);
        this.type = _type;
        this.eventName = _eventName;
        this.params = _params;
    }


    /**
     *
     *
     * @returns {Object) - creates and return GenericEvent Instance
     * @memberof GenericEvent
     */
    clone() {
        return new GenericEvent(this.type, this.eventName, this.params, this.bubbles, this.cancelable);
    }
}

/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * BindingUtils provides One-way and Two-way binding with Just single statement.
 * Features:
 * 1. HTML Element to Html Element
 * 2. HTML Element to JavaScript Object
 * 3. JavaScript Object to JavaScript Object
 * 4. Support chain binding.
 *     Example: Input Element (binds to) -> Model Object (binds to) -> Label Element
 * 5. Custom property binding and event to trigger binding event.
 * 6. Model to View binding
 * 7. Built-in mechanism to prevent Memory Leak
 * 
 * BindingUtils is Singleton class. 
 * 
 */
class BindingUtil {

    /**
     * 
     * @example Add Binding:
     * 
    BindingUtils.addBinding(srcele, "value", "change", destele, "value", false);

 
        @example Remove Binding :

        BindingUtils.removeBinding(srcele, "value");
        
        @example Chain Binding : 
        DOM Element -> JavaScript Object (or DOM) ->  DOM Element (or Javascripg Object)

        1) DOM Element -> JavaScript Object :

        BindingUtils.addBinding(srcele, "value", "change", this.myCustomModel, "setValue", false);

        2) JavaScript Object ->  DOM Element :

        BindingUtils.addBinding(this.myCustomModel, "getValue", "change", destele, "value", false);
        
        @example Two-way Binding :

        BindingUtils.addBinding(srcele, "value", "change", destele, "value", true);
 
     * @memberof BindingUtil
     */
    constructor() {
        if (!BindingUtil.instance) {
            BindingUtil.instance = this;
            this.BindObjDictionary = {};
            this.objCounter = 0;
            this.bindObjIdPrefix = "bindobj";
        }
        return BindingUtil.instance;

    }



    /**
     *
     * @private
     * @param {object} _srcObj - Source DOM Element or Object
     * @param {string} _srcProp - Source Property
     * @param {string} _evtname - Source Object EventName on which Binding Trigger 
     * @param {object} _targObj - Target DOM Element or Object
     * @param {string} _targProp - Target Property
     * @memberof BindingUtil
     */
    Binds(_srcObj, _srcProp, _evtname, _targObj, _targProp) {
        let srcObject = new Object();
        let srcPropStr = _srcProp + "prop";
        let srcObjKey = null;
        this.objCounter++;
        let tmpId = this.bindObjIdPrefix+this.objCounter;
        if (_srcObj.nodeName) {
            
            srcObjKey = tmpId;//_srcObj.id;
            _srcObj.dataset.bindid = srcObjKey;
            this.addToBindDictionary(srcObjKey, _srcObj, _evtname);
            srcObject = this.BindObjDictionary[srcObjKey];
        } else {
            srcObjKey = tmpId;
            _srcObj.bindid = srcObjKey;
            this.addToBindDictionary(srcObjKey, _srcObj, _evtname);
            srcObject = this.BindObjDictionary[srcObjKey];
        }

        if (srcObject.srcPropArray == null) {
            srcObject.srcPropArray = [];
        }
        if (srcObject[srcPropStr] == null) {
            srcObject.srcPropArray.push(_srcProp);
            srcObject[srcPropStr] = new Object();
            if (typeof(_srcObj[_srcProp]) === 'function') {
                srcObject[srcPropStr].value = _srcObj[_srcProp]();
            } else {
                srcObject[srcPropStr].value = _srcObj[_srcProp];
            }

        }
        if (srcObject[srcPropStr].bindObjArray == null) {
            srcObject[srcPropStr].bindObjArray = [];
        }
        let targetObject = this.getTargetObject(_targObj, _targProp);
        srcObject[srcPropStr].bindObjArray.push(targetObject);
        this.BindObjDictionary[srcObjKey] = srcObject;
    }

    addToBindDictionary(key, Obj, _evtname) {
        if (this.BindObjDictionary[key] == null) {
            this.BindObjDictionary[key] = Obj;
        }
        Obj.addEventListener(_evtname, (e) => { this.synchronise(e); });
    }

    
    synchronise(event) {
        event.preventDefault();
        let srcObjfrmEvt = event.target;
        let eleid;
        //console.info(typeof srcObjfrmEvt);
        if (srcObjfrmEvt.bindid) {
            eleid = srcObjfrmEvt.bindid;
        } else {
            eleid = srcObjfrmEvt.dataset.bindid;
        }
        let srcObject = this.BindObjDictionary[eleid];
        let srcPropArrayLen = srcObject.srcPropArray.length;
        for (let i = 0; i < srcPropArrayLen; i++) {
            let tmpProp = srcObject.srcPropArray[i];
            let tmpPropStr = tmpProp + "prop";
            // compare
            let tmpval;
            if (typeof(srcObject[tmpProp]) === 'function') {
                tmpval = srcObject[tmpProp]();
            } else {
                tmpval = srcObject[tmpProp];
            }
                this.synchroniseTargetObj(srcObject, tmpPropStr, tmpProp);
                srcObject[tmpPropStr].value = srcObject[tmpProp];
        }
    }

    synchroniseTargetObj(srcObject, srcPropStr, srcProp) {
        let tarObjArray = srcObject[srcPropStr].bindObjArray;
        let tarObjArrayLen = tarObjArray.length;
        for (let j = 0; j < tarObjArrayLen; j++) {
            let tarObj = tarObjArray[j];
            let tmpval;
            if (typeof(srcObject[srcProp]) === 'function') {
                tmpval = srcObject[srcProp]();
            } else {
                tmpval = srcObject[srcProp];
            }
            if (tarObj.obj != null) {
                if (typeof(tarObj.obj[tarObj.prop]) === 'function') {
                    tarObj.obj[tarObj.prop](tmpval);
                } else {
                    tarObj.obj[tarObj.prop] = tmpval;
                }
            }
        }
    }

    getTargetObject(targObj, targProp) {
        let tarObject = new Object();
        tarObject.obj = targObj;
        tarObject.prop = targProp;
        return tarObject;
    }


    /**
     * @description - Add Binding method binds Source Object property with Target Object Property with Synchronize on SourceObject Event
     * @public
     * @param {object} srcObj - Source DOM Element or Object
     * @param {string} srcProp - Source Property
     * @param {string} evtname - Source Object EventName on which Binding Trigger 
     * @param {object} targObj - Target DOM Element or Object
     * @param {string} targProp - Target Property
     * @param {Boolean} twoway - True when Binding is Two-way
     * @example Add Binding :
 BindingUtils.addBinding(srcele, "value", "change", destele, "value", false);
     * @memberof BindingUtil
     */
    addBinding(srcObj, srcProp, evtname, targObj, targProp, twoway) {
        this.Binds(srcObj, srcProp, evtname, targObj, targProp);
        if (twoway) {
            this.Binds(targObj, targProp, evtname, srcObj, srcProp);
        }
    }


    /**
     * 
     * @description - Add Binding method binds Source Object property with Target Object Property with Synchronize on SourceObject Event
     * @public
     * @param {object} _srcObj - Source DOM Element or Object
     * @param {string} _evtname - Source Object EventName on which Binding Trigger 
     * @example Remove Binding :
 BindingUtils.removeBinding(srcele, "value");
     * @memberof BindingUtil
     */
    removeBinding(_srcObj, _evtname) {
        // determine is it dom element or plain object
        let srcObject;
        if (_srcObj == null)
            return;
        if (_srcObj.nodeName) {
            let eleid = _srcObj.dataset.bindid;
            if (this.BindObjDictionary[eleid] != null) {
                srcObject = this.BindObjDictionary[eleid];
                this.removeListeners(srcObject);
            } else {
                srcObject = this.BindObjDictionary[_srcObj.bindid];
                this.removeListeners(srcObject);
            }

        } else {
            if (this.BindObjDictionary[_srcObj.bindid] != null) {
                srcObject = this.BindObjDictionary[_srcObj.bindid];
                this.removeListeners(srcObject);
            }
        }

        if (srcObject.srcPropArray.length > 0) {

            let srcPropArrayLen = srcObject.srcPropArray.length;
            for (let j = 0; j < srcPropArrayLen; j++) {
                let srcProp = srcObject.srcPropArray[j];
                let srcPropStr = srcProp + "prop";
                srcObject[srcPropStr].bindObjArray = [];
            }
        }
    }

    removeListeners(sourceObj, evtname) {
        sourceObj.removeEventListener(evtname, (e) => { this.synchronise(e); });
    }

}

const BindingUtils = new BindingUtil();

export { BindingUtils, Component, Container, ElementState, ElementUtils, Event, EventBroadCaster, EventChannel, EventDispatcher, EventRouter, EventUtils, GenericEvent, InstanceId, NavigationEvent, Router, View, ViewManager, ViewNavigator, ViewStack };
//# sourceMappingURL=jsactions.js.map
