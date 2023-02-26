import  BindingUtils  from '../src/jsactions/utils/BindingUtils';
import EventDispatcher from '../src/createjs/EventDispatcher';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';



class TestModel extends EventDispatcher {
    constructor() {
        super();
        this.valueSrc = 10;
        this.valueDest = 20;
    }

    setSrcValue(_val = 0) {
        this.valueSrc = _val;
        this.dispatchEvent("srcchange", this);
    }

    getSrcValue() {
        return this.valueSrc;
    }

    setDestValue(_val = 0) {
        this.valueDest = _val;
        this.dispatchEvent("destchange", this);
    }

    getDestValue() {
        return this.valueDest;
    }
}

export default TestModel;

describe('BindingUtils', () => {
    before(function() {
        return JSDOM.fromFile('./test/indextest.html')
          .then((dom) => {
            global.window = dom.window;
            global.document = window.document;
          });
      })

    let myTestModel = new TestModel();
    it('check addBinding with two javascript objects ', function () {
        BindingUtils.addBinding(myTestModel, "getSrcValue", "srcchange", myTestModel, "setDestValue", false);
        myTestModel.setSrcValue(30);
        let srcvalue = myTestModel.getSrcValue();
        BindingUtils.removeBinding(myTestModel, "getSrcValue", "srcchange", myTestModel, "setDestValue", false);
        expect(myTestModel.getDestValue()).to.equal(srcvalue);
    });

    it('check removeBinding with two javascript objects ', function () {
        BindingUtils.addBinding(myTestModel, "getSrcValue", "srcchange", myTestModel, "setDestValue", false);
        myTestModel.setSrcValue(40);
        BindingUtils.removeBinding(myTestModel, "getSrcValue", "srcchange", myTestModel, "setDestValue", false);
        myTestModel.setSrcValue(50);
        let srcvalue1 = myTestModel.getSrcValue();
        expect(myTestModel.getDestValue()).to.not.equal(srcvalue1);
    });


    it('check addBinding with input DOM element and Javascript Object ', function () {
        let srcInputEl = document.querySelector("#srcinput");
        BindingUtils.addBinding(srcInputEl, "value", "change", myTestModel, "setDestValue", false);
        srcInputEl.value = 60;
        const event = new window.Event('change');  
        srcInputEl.dispatchEvent(event);
        let srcvalue2 = srcInputEl.value;
        expect(myTestModel.getDestValue()).to.equal(srcvalue2);
        BindingUtils.removeBinding(srcInputEl, "value", "change", myTestModel, "setDestValue", false);
    });

    it('check chain binding with 2 input DOM element and Javascript Object ', function () {
        let srcInputEl = document.querySelector("#srcinput");
        let destInputEl = document.querySelector("#destinput");
        
        BindingUtils.addBinding(srcInputEl, "value", "change", myTestModel, "setDestValue", false);
        BindingUtils.addBinding(myTestModel, "getDestValue", "destchange", destInputEl, "value", false);
        srcInputEl.value = 70;
        let srcvalue3 = srcInputEl.value;
        const event1 = new window.Event('change');  
        srcInputEl.dispatchEvent(event1);
        expect(destInputEl.value).to.equal(srcvalue3);
        BindingUtils.removeBinding(srcInputEl, "value", "change", myTestModel, "setDestValue", false);
        BindingUtils.removeBinding(myTestModel, "getDestValue", "destchange", destInputEl, "value", false);
        
    });


    it('check chain removebinding with 2 input DOM element and Javascript Object ', function () {
        let srcInputEl = document.querySelector("#srcinput");
        let destInputEl = document.querySelector("#destinput");
        
        BindingUtils.addBinding(srcInputEl, "value", "change", myTestModel, "setDestValue", false);
        BindingUtils.addBinding(myTestModel, "getDestValue", "destchange", destInputEl, "value", false);
        srcInputEl.value = 70;
        let srcvalue3 = srcInputEl.value;
        const event1 = new window.Event('change');  
        srcInputEl.dispatchEvent(event1);
        expect(destInputEl.value).to.equal(srcvalue3);
        BindingUtils.removeBinding(srcInputEl, "value", "change", myTestModel, "setDestValue", false);
        BindingUtils.removeBinding(myTestModel, "getDestValue", "destchange", destInputEl, "value", false);
        srcInputEl.value = 80;
        let srcvalue4 = srcInputEl.value;
        const event2 = new window.Event('change');  
        srcInputEl.dispatchEvent(event2);
        expect(destInputEl.value).to.not.equal(srcvalue4);
    });

    it('check two-way binding with 2 input DOM element', function () {
        let srcInputEl = document.querySelector("#srcinput");
        let destInputEl = document.querySelector("#destinput");
        
        BindingUtils.addBinding(srcInputEl, "value", "change", destInputEl, "value", true);
        srcInputEl.value = 100;
        const event1 = new window.Event('change');  
        srcInputEl.dispatchEvent(event1);
        expect(destInputEl.value).to.equal(srcInputEl.value);
        destInputEl.value = 200;
        const event3 = new window.Event('change'); 
        destInputEl.dispatchEvent(event3); 
        expect(srcInputEl.value).to.equal(destInputEl.value);
        BindingUtils.removeBinding(srcInputEl, "value");
        BindingUtils.removeBinding(destInputEl, "value");

    });

    

});