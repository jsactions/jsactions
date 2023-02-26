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
            let tartmpval;
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

export default BindingUtils;