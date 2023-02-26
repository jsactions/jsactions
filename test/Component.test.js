import  Component  from '../src/jsactions/core/Component';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('Component', () => {
    let cmpButton1 = null;
    before(function() {
        return JSDOM.fromFile('./test/indextest.html')
          .then((dom) => {
            global.window = dom.window;
            global.document = window.document;

            cmpButton1 = new Component("usrButton","rootview","RootViewPanel",false);
            cmpButton1.init();
            cmpButton1.attach();
            cmpButton1.enabled = true;
            cmpButton1.readOnly = true;
            cmpButton1.visible = true;
            cmpButton1.required = false;
          });
      })

    

    
    it('should check Component isEnabled', function () {
        expect(cmpButton1.enabled).to.equal(true);
    });

    it('should check Component isReadOnly', function () {
        expect(cmpButton1.readOnly).to.equal(true);
    });

    it('should check Component isRequired', function () {
        expect(cmpButton1.required).to.equal(false);
    });

    it('should check Component visible', function () {
        expect(cmpButton1.visible).to.equal(true);
    });

    it('should get ParentView', function () {
        expect(cmpButton1.parentView).to.equal("rootview");
    });

    it('should get ParentContainer', function () {
        expect(cmpButton1.parentContainer).to.equal("RootViewPanel");
    });

});