# TODO: Fix Medical Officer Dashboard Chat Issues

## Backend Fixes
- [x] Update medicalOfficerChat.js to include 'uid' in user select query
- [x] Verify send route parameter consistency

## Frontend Fixes
- [x] Update MedicalOfficerDashboard.jsx send API to use user.uid instead of conversation._id
- [x] Update MedicalOfficerChatPage.jsx authentication to use proper token

## Testing
- [ ] Test conversation loading in dashboard
- [ ] Test sending messages from dashboard
- [ ] Test receiving messages
