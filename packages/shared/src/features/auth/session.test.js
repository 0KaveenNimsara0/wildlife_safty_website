import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveSession} from './session.js';
const storage = values => ({getItem:key=>values[key] ?? null});
test('main session ignores stale admin identity and token',()=>{
 assert.equal(resolveSession(storage({adminData:JSON.stringify({_id:'admin'}),adminToken:'token'}),null,''),null);
});
test('workspace path explicitly selects user or medical credentials',()=>{
 const values=storage({medicalOfficerData:JSON.stringify({_id:'m',name:'Medic'}),medicalOfficerToken:'m-token',mongoUser:JSON.stringify({uid:'u'}),userToken:'u-token'});
 assert.equal(resolveSession(values,null,'','/dashboard').uid,'u');
 assert.equal(resolveSession(values,null,'','/medical-officer/chat').uid,'m');
});
test('corrupt and credential-less cached profiles cannot restore medical session',()=>{
 assert.equal(resolveSession(storage({medicalOfficerData:'broken'}),null,'','/medical-officer/chat'),null);
 assert.equal(resolveSession(storage({medicalOfficerData:'{"_id":"m"}'}),null,'','/medical-officer/chat'),null);
});
