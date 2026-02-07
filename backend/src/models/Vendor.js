const db = require('../config/database');
const crypto = require('crypto');

class Vendor {
  static async create(data) {
    const {
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      businessName,
      businessType,
      website,
      taxId,
      address,
      city,
      postalCode,
      country,
      productCategories,
      monthlyVolume,
      verificationToken
    } = data;

    const uuid = crypto.randomUUID();
    
    const [result] = await db.execute(
      `INSERT INTO vendors (
        uuid, first_name, last_name, email, phone, password_hash,
        business_name, business_type, website, tax_id, address, city,
        postal_code, country, product_categories, monthly_volume,
        verification_token, accepted_terms, accepted_vendor_agreement
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
      [
        uuid, firstName, lastName, email, phone, passwordHash,
        businessName, businessType, website, taxId, address, city,
        postalCode, country || 'France',
        JSON.stringify(productCategories),
        monthlyVolume,
        verificationToken
      ]
    );
    
    return { id: result.insertId, uuid };
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM vendors WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findByUUID(uuid) {
    const [rows] = await db.execute(
      'SELECT * FROM vendors WHERE uuid = ?',
      [uuid]
    );
    return rows[0];
  }

  static async verifyVendorEmail(email) {
    await db.execute(
      'UPDATE vendors SET email_verified = TRUE, verification_token = NULL WHERE email = ?',
      [email]
    );
  }

  static async updateVendorStatus(email, status) {
    await db.execute(
      'UPDATE vendors SET status = ? WHERE email = ?',
      [status, email]
    );
  }
}

module.exports = Vendor;