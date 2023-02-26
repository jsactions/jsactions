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


import Event from "../../createjs/Event";

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

export default GenericEvent;