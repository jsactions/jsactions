import  View  from '../src/jsactions/core/View';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('View', () => {
    let tmpView = null;
    before(function() {
        return JSDOM.fromFile('./test/indextest.html')
          .then((dom) => {
            global.window = dom.window;
            global.document = window.document;
          });
      })

    it('should check View created and activate', function () {
        tmpView = new View("rootview", "/rootpath", "Root_Nav_Event", "testusers", "RootViewStack");
        let tmpViewStackEl = document.querySelector(".RootViewStack")
        tmpView.attachView(tmpViewStackEl);
        tmpView.activateView();
        expect(tmpView.isActive).to.equal(true);
    });

});