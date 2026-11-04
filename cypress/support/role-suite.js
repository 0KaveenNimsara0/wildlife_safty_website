// All API requests are stubbed: this suite never modifies real accounts or sends email.
const email = 'qa@example.test';
const password = 'Test-only-password!9';
const fill = () => { cy.get('input[type=email]').type(email); cy.get('input[type=password]').type(password); };
const submit = () => cy.get('form').first().find('button[type=submit]');
const noOverflow = () => cy.document().should(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth + 1));

export function roleSuite(role) {
  describe(`${role.name}: 100 regression cases`, () => {
    for (const [width, height] of [[390,844],[768,1024],[1440,900]]) {
      describe(`authentication at ${width}px`, () => {
        beforeEach(() => {
          cy.viewport(width,height);
          cy.intercept('**/api/**', { statusCode: 503, body: { success:false, message:'Service unavailable for test' } });
          cy.visit(role.login);
        });
        const reject = (status=401, message='Invalid credentials') => cy.intercept('POST', role.endpoint, {statusCode:status,body:{success:false,message}}).as('login');
        const otp = () => { cy.intercept('POST',role.endpoint,{body:{success:true,requiresOtp:true,email}}).as('login');fill();submit().click();cy.wait('@login'); };
        it('renders the role login title',()=>cy.get('h1').should('contain.text',role.title));
        it('keeps the login layout within the viewport',noOverflow);
        it('requires an email address',()=>cy.get('input[type=email]').should('have.prop','required',true));
        it('requires a password',()=>cy.get('input[type=password]').should('have.prop','required',true));
        it('rejects malformed email through browser validation',()=>{cy.get('input[type=email]').type('invalid');cy.get('input[type=email]').should($e=>expect($e[0].validity.typeMismatch).to.eq(true));});
        it('blocks an empty form without sending credentials',()=>{let calls=0;cy.intercept('POST',role.endpoint,()=>{calls++;});submit().click();cy.get('input[type=email]').should($e=>expect($e[0].validity.valueMissing).to.eq(true));cy.then(()=>expect(calls).to.eq(0));});
        it('masks the password by default',()=>cy.get('input[type=password]').should('be.visible'));
        it('toggles password visibility without changing its value',()=>{cy.get('input[type=password]').type(password).parent().find('button').click();cy.get('input').filter((i,e)=>e.value===password).should('have.attr','type','text').parent().find('button').click();cy.get('input[type=password]').should('have.value',password);});
        it('provides a usable recovery route',()=>{cy.get(`a[href="${role.recovery}"]`).click();cy.location('pathname').should('eq',role.recovery);});
        it('provides a registration route',()=>{cy.get(`a[href="${role.register}"]`).click();cy.location('pathname').should('eq',role.register);});
        it('sends only the expected initial credentials',()=>{reject();fill();submit().click();cy.wait('@login').its('request.body').should('deep.equal',{email,password});});
        it('shows invalid credential errors',()=>{reject();fill();submit().click();cy.contains('Invalid credentials').should('be.visible');});
        it('shows server errors and re-enables submit',()=>{reject(500,'Authentication service unavailable');fill();submit().click();cy.contains('Authentication service unavailable').should('be.visible');submit().should('not.be.disabled');});
        it('shows rate-limit errors',()=>{reject(429,'Too many attempts');fill();submit().click();cy.contains('Too many attempts').should('be.visible');});
        it('disables submit during a pending request',()=>{cy.intercept('POST',role.endpoint,{delay:1500,statusCode:401,body:{message:'Invalid credentials'}}).as('login');fill();submit().click().should('be.disabled');cy.wait('@login');submit().should('not.be.disabled');});
        it('handles a lost network connection',()=>{cy.intercept('POST',role.endpoint,{forceNetworkError:true}).as('login');fill();submit().click();cy.wait('@login');submit().should('not.be.disabled');cy.location('pathname').should('eq',role.login);});
        it('allows retry after a rejected login',()=>{reject();fill();submit().click();cy.wait('@login');submit().click();cy.wait('@login');submit().should('not.be.disabled');});
        it('does not persist a token after rejected credentials',()=>{reject();fill();submit().click();cy.wait('@login');cy.window().should(win=>expect(win.localStorage.getItem(role.token)).to.eq(null));});
        it('opens six OTP inputs when verification is required',()=>{otp();cy.get('input[maxlength="1"]').should('have.length',6).first().should('be.visible');});
        it('does not authenticate before OTP verification',()=>{otp();cy.location('pathname').should('eq',role.login);cy.window().should(win=>expect(win.localStorage.getItem(role.token)).to.eq(null));});
      });
    }
    // 10 routes × 4 checks: real rendering with API outage, not successful-data mocks.
    for (const route of role.routes) {
      describe(`${route} during API outage`,()=>{
        beforeEach(()=>{
          cy.intercept('**/api/**',{statusCode:503,body:{success:false,message:'Service unavailable for test'}});
          cy.visit(route,{onBeforeLoad(win){
            win.localStorage.setItem(role.token,'test-token-not-valid-on-server');
            win.localStorage.setItem(role.storage,JSON.stringify({_id:'507f1f77bcf86cd799439011',uid:'507f1f77bcf86cd799439011',name:'QA Tester',displayName:'QA Tester',email,role:role.id,emailVerified:true}));
          }});
        });
        it('retains the requested route',()=>cy.location('pathname').should('eq',route));
        it('keeps navigation visible at desktop width',()=>cy.get('nav').first().should('be.visible'));
        it('renders content instead of a blank root',()=>cy.get('#root').should($root=>expect($root.text().trim().length).to.be.greaterThan(30)));
        it('avoids horizontal page overflow',noOverflow);
      });
    }
  });
}
