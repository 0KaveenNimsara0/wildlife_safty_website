import { test } from 'node:test';
import assert from 'node:assert/strict';
import { axiosTarget, isApiUrl } from './apiScope.js';
const base = 'https://api.example.test/api';
test('API credential boundary rejects other origins, sibling paths and traversal', () => {
 for (const target of ['https://evil.test/api/users','https://api.example.test/api-other/users','https://api.example.test/api/../private','http://api.example.test/api/users']) {
  assert.equal(isApiUrl(target,base),false,target);
 }
 assert.equal(isApiUrl(base,base),true);
 assert.equal(isApiUrl(base+'/users',base),true);
});
test('Axios protocol-relative URLs and base overrides cannot disguise destinations', () => {
 assert.equal(axiosTarget('/users',base),base+'/users');
 assert.equal(isApiUrl(axiosTarget('//evil.test/api/users',base),base),false);
 assert.equal(isApiUrl(axiosTarget('/users','https://evil.test/api'),base),false);
 assert.equal(isApiUrl(axiosTarget('../private',base),base),false);
 assert.equal(isApiUrl(axiosTarget('https://api.example.test/api/users',base),base),true);
});
