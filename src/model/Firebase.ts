import * as admin from 'firebase-admin';
var serviceAccount = require("../../key_firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;