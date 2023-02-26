import  ElementState  from '../src/jsactions/utils/ElementState';
import { expect } from 'chai';


describe('ElementState', () => {
    it('should check loading state ', function () {
        expect(ElementState.LOADING).to.equal('loading');
    });

    it('should check loaded state ', function () {
        expect(ElementState.LOADED).to.equal('loaded');
    });

    it('should check default state ', function () {
        expect(ElementState.DEFAULT).to.equal('default');
    });
    it('should check enabled state ', function () {
        expect(ElementState.ENABLED).to.equal('enabled');
    });

    it('should check disabled state ', function () {
        expect(ElementState.DISABLED).to.equal('disabled');
    });

    it('should check readonly state ', function () {
        expect(ElementState.READONLY).to.equal('readonly');
    });

    it('should check error state ', function () {
        expect(ElementState.ERROR).to.equal('error');
    });

    it('should check success state ', function () {
        expect(ElementState.SUCCESS).to.equal('success');
    });

    it('should check warning state ', function () {
        expect(ElementState.WARNING).to.equal('warning');
    });

});