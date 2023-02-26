import  ViewStack  from '../src/jsactions/core/ViewStack';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('ViewStack', () => {
    before(function() {
        return JSDOM.fromFile('./test/indextest.html')
          .then((dom) => {
            global.window = dom.window;
            global.document = window.document;
          });
      })

    it('should check ViewStack created and activate', function () {
        let tmpViewStack = new ViewStack("RootViewStack1", "/rootpath", "rootNavigator");
        tmpViewStack.render();
        let tmpViewStackEl = document.querySelector(".RootViewStack1");
        expect(tmpViewStackEl.outerHTML).to.equal('<div class="jsact-viewstack RootViewStack1"></div>');
    });

});