import { ipcMain } from 'electron';
import dbService from '../database';

export async function addDummyuser() {
  const insert = dbService.getConnection().prepare(` 
    INSERT INTO users (id, name, email, mobile, website, address, pharmacyName, LicenseNumber, GstNumber, RegistrationNumber, EstablishedYear, timings, PharmacistName, PharmacistLicense, PanNumber, BankName, AccountNumber, IfscCode, LastInspection, NextInspection) 
    VALUES (1, 'John Doe', 'john.doe@example.com', '123-456-7890', 'https://johndoepharmacy.com', '123 Elm Street, Springfield', 
    'John Pharmacy', 'PH123456', 'GSTIN123456789', 'REG12345', 2000, 
    '9:00 AM - 6:00 PM', 'Dr. John Doe', 'PH-12345', 'ABCDE1234F', 'ABC Bank', '1234567890', 
    'ABC1234567', '2024-12-01', '2025-12-01');
  `);

  insert.run();
}

// addDummyuser();
// --------------------------- get user details

ipcMain.handle('get-profile', async () => {
  try {
    // Access the low-level better-sqlite3 connection

    const knex = dbService.getKnexConnection();
    const userDetails = await knex('users').select('*').where('id', 1);
    // return recentBills;
    // console.log(userDetails[0]);

    return userDetails[0];
  } catch (error) {
    console.log('error getting profile data ', error);
    return false;
  }
});

//  --------------------------update user
ipcMain.handle('update-profile', async (_event, profileData) => {
  try {
    console.log('made a call to update profile');
    const knex = dbService.getKnexConnection();
    const mappedData = {
      name: profileData.pharmacyName, // Assuming you don't have 'name' in the frontend, set it as empty or map accordingly
      email: profileData.email,
      mobile: profileData.mobile, // Assuming a string, if an array of mobiles is needed, handle accordingly
      website: profileData.website,
      address: profileData.address,

      // Business Details
      pharmacyName: profileData.pharmacyName,
      LicenseNumber: profileData.licenseNumber,
      GstNumber: profileData.gstNumber,
      RegistrationNumber: profileData.registrationNumber,
      EstablishedYear: parseInt(profileData.establishedYear), // Ensure it's an integer
      timings: profileData.weekdayHours, // Assuming all timings are stored as a single field
      PharmacistName: profileData.pharmacistName,
      PharmacistLicense: profileData.pharmacistLicense,
      PanNumber: profileData.panNumber,
      BankName: profileData.bankName,
      AccountNumber: profileData.accountNumber,
      IfscCode: profileData.ifscCode,
      LastInspection: profileData.lastInspectionDate, // Assuming 'YYYY-MM-DD' format
      NextInspection: profileData.nextInspectionDue, // Assuming 'YYYY-MM-DD' format
    };

    const resp = await knex('users').insert(mappedData);

    // update.run('newemail@example.com', '456 Oak Street, Springfield', 1);
    console.log(resp);
    return true;
  } catch (error) {
    console.log('error updating profile ', error);
    return false;
  }
});
