const menus = {
 user: [['My activity', [['Identification history','history'],['Saved articles','articles'],['Activity','activity']]],['Account', [['Profile','profile'],['Security','security'],['Notifications','notifications']]]],
 admin: [['Workspace', [['Overview','dashboard'],['Prediction reviews','predictions'],['Contact tickets','contact-tickets']]],['Management', [['Users','users'],['Medical officers','medical-officers'],['Articles','articles']]],['Account', [['Audit logs','audit-logs'],['Notifications','notifications'],['Profile','profile']]]],
 medical: [['Workspace', [['Overview','dashboard'],['Prediction reviews','predictions'],['Consultations','chat'],['Articles','articles']]],['Account', [['Activity','activity-log'],['Notifications','notifications'],['Profile','profile']]]],
};
const roots = {user:'/dashboard',admin:'/admin',medical:'/medical-officer'};

export const roles = {
 user: { root: roots.user, label:'Personal workspace', login:'/login', logout:'logout', identityRoles:['user'], tokenKey:'userToken', navigation:menus.user, home:'profile' },
 admin: { root: roots.admin, label:'Admin workspace', login:'/admin/login', logout:'adminLogout', identityRoles:['admin'], tokenKey:'adminToken', navigation:menus.admin, home:'dashboard' },
 medical: { root: roots.medical, label:'Medical workspace', login:'/medical-officer/login', logout:'medicalOfficerLogout', identityRoles:['medicalOfficer','medical-officer'], tokenKey:'medicalOfficerToken', navigation:menus.medical, home:'dashboard', conversations:'/medical-officer/chat/conversations' },
};
export function getRole(key) {
 const role = roles[key];
 if (!role) throw new Error(`Unknown workspace role: ${key}`);
 return role;
}
