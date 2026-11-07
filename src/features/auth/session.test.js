import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveSession} from './session.js';
const storage = values => ({getItem:key=>values[key] ?? null});
test('corrupt admin record does not hide a valid medical session',()=>{
 const user=resolveSession(storage({adminData:'broken',medicalOfficerData:JSON.stringify({_id:'m',name:'Medic',photoURL:'/uploads/m.png'})}),null,'http://images');
 assert.equal(user.role,'medicalOfficer');assert.equal(user.uid,'m');assert.equal(user.photoURL,'http://images/uploads/m.png');
});
test('firebase and anonymous sessions preserve identity',()=>{
 assert.equal(resolveSession(storage({}),null,''),null);
 const user=resolveSession(storage({}),{uid:'u',email:'u@example.test',photoURL:'https://example.test/a'},'');
 assert.equal(user.role,'user');assert.equal(user.source,'firebase');assert.equal(user.photoURL,'https://example.test/a');
});
test('stored application user hydrates consistently',()=>{
 const user=resolveSession(storage({mongoUser:JSON.stringify({_id:'u',name:'User'})}),null,'');assert.equal(user.uid,'u');assert.equal(user.role,'user');
});
