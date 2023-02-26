import  ElementUtils  from '../src/jsactions/utils/ElementUtils';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('ElementUtils', () => {

    before(function() {
        return JSDOM.fromFile('./test/indextest.html')
          .then((dom) => {
            global.window = dom.window;
            global.document = window.document;
          });
      })

    it('should return Component Base Element ', function () {
        expect(ElementUtils.constructComponentBaseElement("testComponent")).to.equal('<div class="jsact-component testComponent"></div>');
    });

    it('should return Container Base Element', function () {
        expect(ElementUtils.constructContainerBaseElement("testContainer")).to.equal('<div class="jsact-container testContainer"></div>');
    });

    it('should return View Base Element', function () {
        expect(ElementUtils.constructViewBaseElement("testView")).to.equal('<div class="jsact-view testView"></div>');
    });

    it('should return View Stack Base Element', function () {
        expect(ElementUtils.constructViewStackBaseElement("testViewStack")).to.equal('<div class="jsact-viewstack testViewStack"></div>');
    });

    it('should return Navigator Base Element', function () {
        expect(ElementUtils.constructNavigatorBaseElement("testViewNavigator")).to.equal('<div class="jsact-viewnavigator testViewNavigator"></div>');
    });

    it('should add hide style to element', function () {
        const mydivel = document.createElement("div");
        ElementUtils.hideElement(mydivel);
        const myelestr = mydivel.outerHTML;
        //console.log(myelestr);
        expect(myelestr).to.equal('<div style="display: none;"></div>');
    });

    it('should add show style to element', function () {
        const mydivel = document.createElement("div");
        ElementUtils.showElement(mydivel);
        const myelestr = mydivel.outerHTML;
        //console.log(myelestr);
        expect(myelestr).to.equal('<div style="display: block;"></div>');
    });

    it('should check if element visible', function () {
        const mydivel = document.createElement("div");
        ElementUtils.showElement(mydivel);
        const myelestr = mydivel.outerHTML;
        //console.log(myelestr);
        expect(ElementUtils.isVisible(mydivel)).to.equal(true);
    });

    it('should check generate componentid', function () {
        const compid = ElementUtils.generateComponentId();
        //console.log(compid);
        expect(compid).to.equal("component1");
    });

    it('should check generate containerid', function () {
        const contid = ElementUtils.generateContainerId();
        //console.log(compid);
        expect(contid).to.equal("container2");
    });

});