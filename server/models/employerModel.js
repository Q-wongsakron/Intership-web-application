const db = require("../util/dbSQL");

module.exports = class Employer {
  constructor(
    id,
    username,
    password,
    company_name,
    address,
    subdistrict,
    district,
    province,
    country,
    pcode,
    contact_name,
    contact_email,
    contact_tel,
    company_pic,
    status,
    role
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.company_name = company_name;
    this.address = address;
    this.subdistrict = subdistrict;
    this.district = district;
    this.province = province;
    this.country = country;
    this.pcode = pcode;
    this.contact_name = contact_name;
    this.contact_email = contact_email;
    this.contact_tel = contact_tel;
    this.company_pic = company_pic;
    this.status = status;
    this.role = role;
  }

  static searchEmployerByName(username) {
    return db.execute(
      "SELECT COUNT(*) AS count FROM employer WHERE username = ?",
      [username]
    );
  }

  static getEmployerByName(username) {
    return db.execute("SELECT * FROM employer WHERE username = ?", [username]);
  }

  static listEmployer() {
    return db.execute(
      "SELECT id,username,company_name,address,subdistrict,district,province,country,pcode,contact_name,contact_email,contact_tel,company_pic,status,role FROM employer"
    );
  }
  static verifyEmployer(id, status) {
    return db.execute("UPDATE employer SET `status`=? WHERE `id`=?", [
      status,
      id,
    ]);
  }
  static createEmployer(
    username,
    hashpassword,
    company_name,
    address,
    subdistrict,
    district,
    province,
    country,
    pcode,
    contact_name,
    contact_email,
    contact_tel,
    company_pic
  ) {
    // Check for undefined values and replace with null
    const parameters = [
      username,
      hashpassword,
      company_name,
      address,
      subdistrict,
      district,
      province,
      country,
      pcode,
      contact_name,
      contact_email,
      contact_tel,
      company_pic,
    ].map((value) => (value !== undefined ? value : null));

    const query =
      "INSERT INTO employer (`id`, `username`, `password`, `company_name`, `address`, `subdistrict`, `district`, `province`, `country`, `pcode`, `contact_name`, `contact_email`, `contact_tel`, `company_pic`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    return db.execute(query, parameters);
  }
};
