// scripts/createTestUsers.js
const admin = require('../src/config/firebaseAdmin');
const db = require('../src/models');
const User = db.User;

const testUsers = [
  { email: 'swesuzy@gmail.com', password: 'Password123!', displayName: 'Suzyy24' },
  { email: 'suzannesschouest@gmail.com', password: 'Password123!', displayName: 'ssuzyy19' },
  { email: 'schouestschool@gmail.com', password: 'Admin123!', displayName: 'Admin1' }
];

async function createTestUsers() {
  try {
    console.log('Starting to create test users...');
    
    for (const userData of testUsers) {
      try {
        // Check if user already exists in Firebase
        try {
          const userRecord = await admin.auth().getUserByEmail(userData.email);
          console.log(`User ${userData.email} already exists in Firebase with UID: ${userRecord.uid}`);
          
          // Look up in database
          const dbUser = await User.findOne({ where: { email: userData.email } });
          if (dbUser) {
            console.log(`User ${userData.email} already exists in database with ID: ${dbUser.userID}`);
            
            // Update Firebase UID if it's not set
            if (!dbUser.firebaseUid) {
              dbUser.firebaseUid = userRecord.uid;
              await dbUser.save();
              console.log(`Updated Firebase UID for user ${userData.email}`);
            }
          } else {
            // Create in database if not exists
            const newDbUser = await User.create({
              email: userData.email,
              firebaseUid: userRecord.uid,
              joinDate: new Date(),
              userRating: 0
            });
            console.log(`Created user ${userData.email} in database with ID: ${newDbUser.userID}`);
          }
          
          continue; // Skip to next user
        } catch (error) {
          // If error is not about user not found, rethrow
          if (error.code !== 'auth/user-not-found') {
            throw error;
          }
          // Otherwise continue to create user
        }
        
        // Create user in Firebase
        const userRecord = await admin.auth().createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: true
        });
        
        console.log(`Created user ${userData.email} in Firebase with UID: ${userRecord.uid}`);
        
        // Create user in database
        const dbUser = await User.create({
          email: userData.email,
          firebaseUid: userRecord.uid,
          joinDate: new Date(),
          userRating: 0
        });
        
        console.log(`Created user ${userData.email} in database with ID: ${dbUser.userID}`);
        
        // For admin user, set custom claims
        if (userData.email === 'admin@example.com') {
          await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
          console.log(`Set admin claims for user ${userData.email}`);
        }
      } catch (userError) {
        console.error(`Error creating user ${userData.email}:`, userError);
      }
    }
    
    console.log('Finished creating test users');
    process.exit(0);
  } catch (error) {
    console.error('Error in createTestUsers:', error);
    process.exit(1);
  }
}

// Execute the function
createTestUsers();