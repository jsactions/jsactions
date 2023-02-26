import  InstanceId  from '../src/jsactions/utils/InstanceId';
import { expect } from 'chai';

describe('InstanceId', () => {

    it('should return Instance ID', function () {
        expect(InstanceId.generate).to.equal(3);
    });

});
