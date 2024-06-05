const db = require("../db/index");
const { student, employer, confirm, setup_courtesy,employee_tu, gen_document, edit_courtesy, self_enroll,gen_document_self} = db;
db.sequelize.sync();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require('path');
const {findYear} = require("./authController")
const nodemailer = require('nodemailer');

async function sendRequestSignDocHeadEmail(std_id , headTuData_email, name_title_th, displayname_th) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.SMTP_PASS, 
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: headTuData_email,
      subject: 'Request Sign Documentation',
      text: `ขอความกรุณาอนุมัติเอกสารให้กับ นักศึกษา เลขประจำตัว ${std_id} ชื่อ ${name_title_th}${displayname_th} `,
    };
   
  
    await transporter.sendMail(mailOptions);
  }

// use to convert to thai number
function convertToThaiNumber(arabicNumber) {
    const thaiNumbers = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

    if (typeof arabicNumber !== 'number' || arabicNumber < 0 || arabicNumber > 9) {
        return 'Invalid input. Please provide a number between 0 and 9.';
    }

    return thaiNumbers[arabicNumber];
}

// call convert to thai number
function convertStringToThaiNumber(inputString) {
    if (typeof inputString !== 'string') {
        return 'Invalid input. Please provide a string.';
    }

    let thaiString = '';

    for (let i = 0; i < inputString.length; i++) {
        const digit = parseInt(inputString[i], 10);
        const thaiDigit = convertToThaiNumber(digit);
        thaiString += thaiDigit;
    }

    return thaiString;
}
//create DOC setup (long time to use)
exports.setup_courtesy = async (req, res) => {
    try {
        console.log("Received setup request:", req.body);
        const { start_date_convert, end_date_convert, head_name,end_date_year } = req.body.formData;
        console.log("Extracted form data:", { start_date_convert, end_date_convert, head_name, end_date_year });
        // crate setup courtesy
        const setup = await setup_courtesy.create({
            
            start_date:start_date_convert,
            end_date:end_date_convert,
            end_date_year:end_date_year,
            head_name
            
        });

        console.log("Setup document created:", setup);

        res.status(200).json({
            message: "Success",
        
        });
    } catch (err) {
        console.error("Error during setup:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// data each courtasy that created ?
exports.showEditCourtasy = async (req, res) => {
    try{
        const { id, year } = req.params;
        // showEditCourtesy only in semester year
        const showEditCourtasy = await edit_courtesy.findOne({where: {std_id: id, academic_year : year}})
    
        res.status(200).send(showEditCourtasy)
    }catch(err){
        console.error(err)
        res.status(500).send("Internal Server Error");
    }
}

// All data in edit courtesy
exports.showAllEditCourtasy = async (req, res) => {
    try{
        const semesterYear = await findYear(req,res);
        // showEditCourtesy only in semester year
        const showAllEditCourtasy = await edit_courtesy.findAll({where: {academic_year : semesterYear}})
    
        res.status(200).send(showAllEditCourtasy)
    }catch(err){
        console.error(err)
        res.status(500).send("Internal Server Error");
    }
}

// cover year to พ.ศ.
function getdate(){
    const thaiNumerals = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
    const currentDate = new Date();
    // Convert the current year to Thai numerals and add 543
    const thaiYear = (currentDate.getFullYear() + 543).toString().replace(/\d/g, digit => thaiNumerals[digit]);
    return thaiYear.slice(-2);
}

// default data for gen DOC
function instantDataDoc() {
    const fontsize = 15
    const thisdate = getdate();
    const font = "./asset/THSarabunNew.ttf"
    const img_cover = "./asset/ตราครุฑ.png"
    

    const payload = {fontsize, thisdate,font,img_cover}
    return payload;
}
exports.preCreateCourtesyOld = async (req, res) => {
    
    try{
        
        const semesterYear = await findYear(req,res);
        // load data from client
        const {std_id, number_letter,number_courtesy, date_courtesy , date_letter, name_to } = req.body;
        // create new edit data 
        const stdData = await student.findOne({where: {std_id: std_id}})
        const headTuData = await employee_tu.findOne({where: { role : 'head'}});
       

        const saveEditGenDoc = await edit_courtesy.create({
                std_id: std_id,
                number_courtesy: number_courtesy,
                number_letter: number_letter,
                date_courtesy: date_courtesy,
                date_letter: date_letter,
                name_to: name_to,
                academic_year: semesterYear
                
        })
        
        await sendRequestSignDocHeadEmail(std_id,headTuData.email, stdData.name_title_th, stdData.displayname_th )

        res.status(200).json({message: "Created Pre Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
// create create new pre DOC
exports.preCreateCourtesy = async (req, res) => {
    
    try{
        const semesterYear = await findYear(req,res);
        // load data from client
        const {std_id, number_courtesy, date_courtesy, name_to } = req.body;
        const stdData = await student.findOne({where: {std_id: std_id}})
        const headTuData = await employee_tu.findOne({where: { role : 'head'}});
        
        // create new edit data 
        const saveEditGenDoc = await edit_courtesy.create({
                std_id: std_id,
                number_courtesy: number_courtesy,
                date_courtesy: date_courtesy,
                name_to: name_to,
                academic_year: semesterYear
        })
        
        await sendRequestSignDocHeadEmail(std_id, headTuData.email, stdData.name_title_th, stdData.displayname_th )
        res.status(200).json({message: "Created Pre Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// create create new pre DOC
exports.preCreateLetter = async (req, res) => {
    
    try{
        const semesterYear = await findYear(req,res);
        // load data from client
        const {std_id,number_letter, date_letter, name_to } = req.body;
        const stdData = await student.findOne({where: {std_id: std_id}})
        const headTuData = await employee_tu.findOne({where: { role : 'head'}});
        
        // create new edit data 
        const saveEditGenDoc = await edit_courtesy.update({
                number_letter:number_letter,
                date_letter: date_letter,
                name_to: name_to,
        },{where: {std_id : std_id, academic_year : semesterYear}});
        
        await sendRequestSignDocHeadEmail(std_id, headTuData.email, stdData.name_title_th, stdData.displayname_th )
        res.status(200).json({message: "Created Pre Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}


// edit pre DOC
exports.editPreCreateCourtesyOld = async (req, res) => {
    
    try{
        const semesterYear = await findYear(req,res);
        // load data from client
        const {std_id, number_courtesy, number_letter, date_courtesy, date_letter, name_to } = req.body;
        // update edit data only in semester year
        const saveEditGenDoc = await edit_courtesy.update({
                std_id: std_id,
                number_courtesy: number_courtesy,
                number_letter: number_letter,
                date_courtesy: date_courtesy,
                date_letter: date_letter,
                name_to: name_to,
                academic_year: semesterYear
        }, {where: {std_id : std_id, academic_year : semesterYear}})
        
        
        res.status(200).json({message: "Update Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// edit pre DOC Courtesy
exports.editPreCreateCourtesy = async (req, res) => {
    
    try{
        const semesterYear = await findYear(req,res);
        // load data from client
        const {std_id, number_courtesy, date_courtesy, name_to } = req.body;
        // update edit data only in semester year
        const saveEditGenDoc = await edit_courtesy.update({
                std_id: std_id,
                number_courtesy: number_courtesy, 
                date_courtesy: date_courtesy,
                name_to: name_to,
                academic_year: semesterYear
        }, {where: {std_id : std_id, academic_year : semesterYear}})
        
        
        res.status(200).json({message: "Update Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
// edit pre DOC Letter
exports.editPreCreateLetter = async (req, res) => {
    
    try{
        const semesterYear = await findYear(req,res);
        // load data from client
        const {std_id, number_letter, date_letter, name_to } = req.body;
        // update edit data only in semester year
        const saveEditGenDoc = await edit_courtesy.update({
                std_id: std_id,
                number_letter: number_letter, 
                date_letter: date_letter,
                name_to: name_to,
                academic_year: semesterYear
        }, {where: {std_id : std_id, academic_year : semesterYear}})
        
        
        res.status(200).json({message: "Update Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// create new DOC
exports.createCourtesy = async (req, res) => {
    
    try{
        // modify loop create many document in one time
        const semesterYear = await findYear(req,res);
        // load default data
        const setupD = instantDataDoc();;
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font
        const imagePath = setupD.img_cover;
        const currentDate = new Date();
        const utcOffset = 7 * 60; // UTC+7 in minutes
        currentDate.setMinutes(currentDate.getMinutes() + utcOffset);
        // Create a new PDF document with the Thai font
        const doc = new PDFDocument({ font: thaiFontPath });
        const doc2 = new PDFDocument({ font: thaiFontPath });
        const doc3 = new PDFDocument({ font: thaiFontPath });
        // const { id } = req.params;
        const {std_id,employer_id, number_courtesy, number_letter, date_courtesy, date_letter, name_to } = req.body;

        // confirm data only in semester year
        const data = await confirm.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
            include: {model : student}
        })

        const company = await confirm.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
            include: {model : employer}
        })

        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.student.std_id);

        // check if used to create only in semester year
        const findUser = await gen_document.findOne({
            where: {std_id: std_id,academic_year : semesterYear },   
        })

        // create a gen DOC
        if (!findUser){
            const saveGenDoc = await gen_document.create({
                std_id: std_id,
                employer_id: employer_id,
                doc_nonlicense: `${std_id}/doc_nonlicense_${std_id}.pdf`,
                courtesy_license: `${std_id}/courtesy_license_${std_id}.pdf`,
                intern_letter: `${std_id}/letter_license_${std_id}.pdf`,
                academic_year: semesterYear
            })
            // udate status in confirm database only in semester year
            const updateStatus = await confirm.update(
                {
                    status: "ดำเนินเอกสารเสร็จสิ้น",
                    date_gen_doc: currentDate
                  },
                  {
                    where: { std_id: std_id, academic_year : semesterYear },
                  }
            )
            const updateStatusStd = await student.update(
                {
                    status: "3",
                  },
                  {
                    where: { std_id: std_id },
                  }
            )

            // create new edit data 
            // const saveEditGenDoc = await edit_courtesy.create({
            //     std_id: std_id,
            //     number: number,
            //     date: date,
            //     name_to: name_to
            // })
        }
        

        // Create DOC
        docCreateWithLic(doc,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,setupD,semesterYear,company.employer.company_name)
        docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number_courtesy,number_letter,imagePath,date_courtesy,date_letter,name_to,data,thaiString,lastSetup,semesterYear,company.employer.company_name)
        docLetterCreateWithLic(doc3,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,setupD,semesterYear,company.employer.company_name)
        res.status(200).json({message: "Created Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// create new DOC Multiple
exports.createMultiCourtesy = async (req, res) => {
    try {
        const semesterYear = await findYear(req,res);
        // Load default data
        const setupD = instantDataDoc();
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font;
        const imagePath = setupD.img_cover;
        const currentDate = new Date();
        const utcOffset = 7 * 60; // UTC+7 in minutes
        currentDate.setMinutes(currentDate.getMinutes() + utcOffset);
        const Data = req.body.selectedItems;
        console.log("hello normal",Data)
        if (Data.length > 0) {
            await Promise.all(Data.map(async (item, index) => {
                console.log(item.std_id);

                // Create a new PDF document with the Thai font
                const doc = new PDFDocument({ font: thaiFontPath });
                const doc2 = new PDFDocument({ font: thaiFontPath });
                const doc3 = new PDFDocument({ font: thaiFontPath });
                // confirm data only in semester year
                const data = await confirm.findOne({
                    where: { std_id: item.std_id, academic_year : semesterYear },
                    include: { model: student }
                });

                const company = await confirm.findOne({
                    where: {std_id: std_id, academic_year : semesterYear },   
                    include: { model: employer }
                })

                const setup = await setup_courtesy.findAll();
                const lastSetup = setup[setup.length - 1];

                const thaiString = convertStringToThaiNumber(data.student.std_id);

                // find userd in gen doc only in semester year
                const findUser = await gen_document.findOne({
                    where: { std_id: item.std_id, academic_year : semesterYear },
                });

                if (!findUser) {
                    const saveGenDoc = await gen_document.create({
                        std_id: item.std_id,
                        employer_id: item.employer_id,
                        doc_nonlicense: `${item.std_id}/doc_nonlicense_${item.std_id}.pdf`,
                        courtesy_license: `${item.std_id}/courtesy_license_${item.std_id}.pdf`,
                        intern_letter: `${item.std_id}/letter_license_${item.std_id}.pdf`,
                        academic_year: semesterYear
                    });

                    //update status confirm only in semester year
                    const updateStatus = await confirm.update(
                        {
                            status: "ดำเนินเอกสารเสร็จสิ้น",
                            date_gen_doc: currentDate
                        },
                        {
                            where: { std_id: item.std_id,academic_year : semesterYear },
                        }
                    );
                    const updateStatusStd = await student.update(
                        {
                            status: "3",
                          },
                          {
                            where: { std_id: item.std_id },
                          }
                    )
                    // const saveEditGenDoc = await edit_courtesy.create({
                    //     std_id: item.std_id,
                    //     number: item.number,
                    //     date: item.date,
                    //     name_to: item.name_to
                    // });
                }

                docCreateWithLic(doc, item.std_id, fontsize, thisdate, item.number_courtesy, imagePath, item.date_courtesy, item.name_to, data, thaiString, lastSetup, setupD,semesterYear,company.employer.company_name);
                docCreateWithNonLic(doc2, item.std_id, fontsize, thisdate, item.number_courtesy,item.number_letter, imagePath, item.date_courtesy, item.date_letter, item.name_to, data, thaiString, lastSetup, semesterYear,company.employer.company_name);
                docLetterCreateWithLic(doc3,item.std_id,fontsize,thisdate,item.number_letter,imagePath,item.date_letter,item.name_to,data,thaiString,lastSetup,setupD,semesterYear,company.employer.company_name)
            }));
        } else {
            return res.status(400).json({ message: "Please Enter Data" });
        }

        return res.status(200).json({ message: "Created Pdf Successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
// create new DOC Multiple Self
exports.createMultiCourtesySelf = async (req, res) => {
    try {
        const semesterYear = await findYear(req,res);
        // Load default data
        const setupD = instantDataDoc();
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font;
        const imagePath = setupD.img_cover;
        
        const currentDate = new Date();
        const utcOffset = 7 * 60; // UTC+7 in minutes
        currentDate.setMinutes(currentDate.getMinutes() + utcOffset);
        const Data = req.body.selectedItemsSelf;
        console.log("hello",Data)
        if (Data.length > 0) {
            await Promise.all(Data.map(async (item, index) => {
                console.log(item.std_id);

                // Create a new PDF document with the Thai font
                const doc = new PDFDocument({ font: thaiFontPath });
                const doc2 = new PDFDocument({ font: thaiFontPath });
                const doc3 = new PDFDocument({ font: thaiFontPath });

                // edit courtesy only in semester year
                const data = await edit_courtesy.findOne({
                    where: { std_id: item.std_id,academic_year : semesterYear },
                    include: { model: student }
                });

                const company_self = await self_enroll.findOne({
                    where: {std_id: std_id, academic_year : semesterYear },   
                })

                const setup = await setup_courtesy.findAll();
                const lastSetup = setup[setup.length - 1];

                const thaiString = convertStringToThaiNumber(data.student.std_id);

                // gen doc self only in semester year
                const findUser = await gen_document_self.findOne({
                    where: { std_id: item.std_id,academic_year : semesterYear },
                });

                if (!findUser) {
                    const saveGenDoc = await gen_document_self.create({
                        std_id: item.std_id,
                        self_enroll_id: item.self_enroll_id,
                        doc_nonlicense: `${item.std_id}/doc_nonlicense_${item.std_id}.pdf`,
                        courtesy_license: `${item.std_id}/courtesy_license_${item.std_id}.pdf`,
                        intern_letter: `${item.std_id}/letter_license_${item.std_id}.pdf`,
                        academic_year: semesterYear
                    });
                    // update self_enroll only in semester year
                    const updateStatus = await self_enroll.update(
                        {
                            status: "ดำเนินเอกสารเสร็จสิ้น",
                            date_gen_doc: currentDate
                        },
                        {
                            where: { std_id: item.std_id,academic_year : semesterYear },
                        }
                    );
                    const updateStatusStd = await student.update(
                        {
                            status: "3",
                          },
                          {
                            where: { std_id: item.std_id },
                          }
                    )
                    // const saveEditGenDoc = await edit_courtesy.create({
                    //     std_id: item.std_id,
                    //     number: item.number,
                    //     date: item.date,
                    //     name_to: item.name_to
                    // });
                }

                docCreateWithLic(doc, item.std_id, fontsize, thisdate, item.number_courtesy, imagePath, item.date_courtesy, item.name_to, data, thaiString, lastSetup, setupD,semesterYear,company_self.company_name);
                docCreateWithNonLic(doc2, item.std_id, fontsize, thisdate, item.number_courtesy,item.number_letter, imagePath, item.date_courtesy, item.date_letter, item.name_to, data, thaiString, lastSetup,semesterYear,company_self.company_name);
                docLetterCreateWithLic(doc3,item.std_id,fontsize,thisdate,item.number_letter,imagePath,item.date_letter,item.name_to,data,thaiString,lastSetup,setupD,semesterYear,company_self.company_name)
            }));
        } else {
            return res.status(400).json({ message: "Please Enter Data" });
        }

        return res.status(200).json({ message: "Created Pdf Successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};

// edit Courtesy and Letter in system after created
exports.editCourtesyOld = async (req, res) => {
    try{
        const semesterYear = await findYear(req,res);
        // load default data
        const setupD = instantDataDoc();;
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font;
        const imagePath = setupD.img_cover;

        // Create a new PDF document with the Thai font
        const doc = new PDFDocument({ font: thaiFontPath });
        const doc2 = new PDFDocument({ font: thaiFontPath });
        const doc3 = new PDFDocument({ font: thaiFontPath });
        const {std_id, number_courtesy, number_letter, date_courtesy, date_letter, name_to, academic_year } = req.body;

        // edit only semester year
        const data = await edit_courtesy.findOne({
            where: {std_id: std_id, academic_year : academic_year },   
            include: {model : student}
        })

        const company = await confirm.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
            include: {model : employer}
        })
        
        let company_name = "null"
        if (company) {
           company_name = company.employer.company_name;
        }else{
            const company_self = await self_enroll.findOne({
                where: {std_id: std_id, academic_year : semesterYear },   
            })
            company_name = company_self.company_name;
        }

        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.student.std_id);

        // update data edit only in semester year
        const saveEditGenDoc = await edit_courtesy.update({
            number_courtesy: number_courtesy,
            number_letter: number_letter,
            date_courtesy: date_courtesy,
            date_letter: date_letter,
            name_to: name_to,
            academic_year: academic_year
        },{where: {std_id: std_id,academic_year : academic_year }}
        )
        
        // Re create DOC
        docCreateWithLic(doc,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,setupD,semesterYear,company_name)
        docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number_courtesy,number_letter,imagePath,date_courtesy,date_letter,name_to,data,thaiString,lastSetup,semesterYear,company_name)
        docLetterCreateWithLic(doc3,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,setupD,semesterYear,company_name)
        res.status(200).json({message: "Created Pdf Successfully"})

    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// edit Courtesy self after created
exports.editCourtesy = async (req, res) => {
    try{
        const semesterYear = await findYear(req,res);
        // load default data
        const setupD = instantDataDoc();;
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font;
        const imagePath = setupD.img_cover;

        // Create a new PDF document with the Thai font
        const doc = new PDFDocument({ font: thaiFontPath });
        const doc2 = new PDFDocument({ font: thaiFontPath });
        const doc3 = new PDFDocument({ font: thaiFontPath });
        const {std_id, number_courtesy, date_courtesy, name_to, academic_year } = req.body;

        // edit only semester year
        const data = await edit_courtesy.findOne({
            where: {std_id: std_id, academic_year : academic_year },   
            include: {model : student}
        })

        const company_self = await self_enroll.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
        })

        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.student.std_id);

        // update data edit only in semester year
        const saveEditGenDoc = await edit_courtesy.update({
            number_courtesy: number_courtesy,
            date_courtesy: date_courtesy,
            name_to: name_to,
            academic_year: academic_year
        },{where: {std_id: std_id,academic_year : academic_year }}
        )
        
        // Re create DOC
        docCreateWithLic(doc,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,setupD,semesterYear,company_self.company_name)
        docCreateCourtesyWithNonLic(doc2,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,semesterYear,company_self.company_name)
        //docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number_courtesy,number_letter,imagePath,date_courtesy,date_letter,name_to,data,thaiString,lastSetup,semesterYear)
        //docLetterCreateWithLic(doc3,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,setupD,semesterYear)
        res.status(200).json({message: "Created Pdf Successfully"})

    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// edit Letter self after created
exports.editLetter = async (req, res) => {
    try{
        const semesterYear = await findYear(req,res);
        // load default data
        const setupD = instantDataDoc();;
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font;
        const imagePath = setupD.img_cover;

        // Create a new PDF document with the Thai font
        const doc = new PDFDocument({ font: thaiFontPath });
        const doc2 = new PDFDocument({ font: thaiFontPath });
        const doc3 = new PDFDocument({ font: thaiFontPath });
        const {std_id, number_letter, date_letter, name_to, academic_year } = req.body;

        // edit only semester year
        const data = await edit_courtesy.findOne({
            where: {std_id: std_id, academic_year : academic_year },   
            include: {model : student}
        })

        const company_self = await self_enroll.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
        })

        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.student.std_id);

        // update data edit only in semester year
        const saveEditGenDoc = await edit_courtesy.update({
            number_letter: number_letter,
            date_letter: date_letter,
            name_to: name_to,
            academic_year: academic_year
        },{where: {std_id: std_id,academic_year : academic_year }}
        )
        
        // Re create DOC
        //docCreateWithLic(doc,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,setupD,semesterYear)
        docCreateLetterWithNonLic(doc,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,semesterYear,company_self.company_name)
        //docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number_courtesy,number_letter,imagePath,date_courtesy,date_letter,name_to,data,thaiString,lastSetup,semesterYear)
        docLetterCreateWithLic(doc3,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,setupD,semesterYear,company_self.company_name)
        res.status(200).json({message: "Created Pdf Successfully"})

    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
// create new DOC Self Courtesy
exports.genPdfSelfCourtesy = async (req, res) => {
    
    try{
        // modify loop create many document in one time
        const semesterYear = await findYear(req,res);
        // load default data
        const setupD = instantDataDoc();;
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font
        const imagePath = setupD.img_cover;
        const currentDate = new Date();
        const utcOffset = 7 * 60; // UTC+7 in minutes
        currentDate.setMinutes(currentDate.getMinutes() + utcOffset);
        // Create a new PDF document with the Thai font
        const doc = new PDFDocument({ font: thaiFontPath });
        const doc2 = new PDFDocument({ font: thaiFontPath });
        const doc3 = new PDFDocument({ font: thaiFontPath });
        // const { id } = req.params;
        const {std_id,self_enroll_id, number_courtesy, date_courtesy, name_to } = req.body;
        // self enroll data only in semester year
        const data = await self_enroll.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
            include: {model : student}
        })

        const company_self = await self_enroll.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
        })

        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.std_id);

        // check if used to create only in semester year
        const findUser = await gen_document_self.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
        })

        // create a gen DOC
        if (!findUser){
            const saveGenDoc = await gen_document_self.create({
                std_id: std_id,
                self_enroll_id: self_enroll_id,
                doc_nonlicense_courtesy: `${std_id}/doc_nonlicense_courtesy_${std_id}.pdf`,
                courtesy_license: `${std_id}/courtesy_license_${std_id}.pdf`,
                academic_year: semesterYear
            })
            // udate status in confirm database only in semester year
            const updateStatus = await self_enroll.update(
                {
                    status: "ยังไม่ได้สร้างหนังสือส่งตัว",
                    // status: "รอดำเนินเอกสาร",
                   
                    date_gen_doc: currentDate
                  },
                  {
                    where: { std_id: std_id ,academic_year : semesterYear},
                  }
            )
            // const updateStatusStd = await student.update(
            //     {
            //         status: "2",
            //       },
            //       {
            //         where: { std_id: std_id },
            //       }
            // )
            // create new edit data 
            // const saveEditGenDoc = await edit_courtesy.create({
            //     std_id: std_id,
            //     number: number,
            //     date: date,
            //     name_to: name_to
            // })
        }
        

        // Create DOC
        docCreateCourtesyWithNonLic(doc,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,semesterYear,company_self.company_name)
        docCreateWithLic(doc2,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,setupD,semesterYear,company_self.company_name)
        // docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number_courtesy,number_letter,imagePath,date_courtesy,date_letter,name_to,data,thaiString,lastSetup,semesterYear)
        // docLetterCreateWithLic(doc3,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,setupD,semesterYear)
        res.status(200).json({message: "Created Pdf Successfully"})

    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// create new DOC Self Letter
exports.genPdfSelfLetter = async (req, res) => {
    
    try{
        // modify loop create many document in one time
        const semesterYear = await findYear(req,res);
        // load default data
        const setupD = instantDataDoc();;
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font
        const imagePath = setupD.img_cover;
        const currentDate = new Date();
        const utcOffset = 7 * 60; // UTC+7 in minutes
        currentDate.setMinutes(currentDate.getMinutes() + utcOffset);
        // Create a new PDF document with the Thai font
        const doc = new PDFDocument({ font: thaiFontPath });
        const doc2 = new PDFDocument({ font: thaiFontPath });
        const doc3 = new PDFDocument({ font: thaiFontPath });
        // const { id } = req.params;
        const {std_id,self_enroll_id, number_letter, date_letter, name_to } = req.body;
        const dataEditCreateNonLic = await edit_courtesy.findOne({ std_id: std_id})
        const number_courtesy = dataEditCreateNonLic.number_courtesy
        const date_courtesy = dataEditCreateNonLic.date_courtesy
        // self enroll data only in semester year
        const data = await self_enroll.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
            include: {model : student}
        })

        const company_self = await self_enroll.findOne({
            where: {std_id: std_id, academic_year : semesterYear },   
        })

        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.std_id);

        // check if used to create only in semester year
        // const findUser = await gen_document_self.findOne({
        //     where: {std_id: std_id, academic_year : semesterYear },   
        // })

        // create a gen DOC

        const saveGenDoc = await gen_document_self.update({
                std_id: std_id,
                self_enroll_id: self_enroll_id,
                doc_nonlicense: `${std_id}/doc_nonlicense_${std_id}.pdf`,
                doc_nonlicense_letter: `${std_id}/doc_nonlicense_letter_${std_id}.pdf`,
                intern_letter: `${std_id}/letter_license_${std_id}.pdf`,
                academic_year: semesterYear
        },{where : { std_id: std_id, academic_year : semesterYear}})

        // udate status in confirm database only in semester year
        const updateStatus = await self_enroll.update(
            {
                    status: "ดำเนินเอกสารเสร็จสิ้น",
                    date_gen_doc: currentDate
                },
                {
                    where: { std_id: std_id ,academic_year : semesterYear},
                }
        )
        const updateStatusStd = await student.update(
            {
                status: "3",
                },
                {
                where: { std_id: std_id },
                }
        )
            // create new edit data 
            // const saveEditGenDoc = await edit_courtesy.create({
            //     std_id: std_id,
            //     number: number,
            //     date: date,
            //     name_to: name_to
            // })
        

        // Create DOC
        // docCreateWithLic(doc,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,setupD,semesterYear)
        docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number_courtesy,number_letter,imagePath,date_courtesy,date_letter,name_to,data,thaiString,lastSetup,semesterYear,company_self.company_name)
        docCreateLetterWithNonLic(doc,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,semesterYear,company_self.company_name)
        docLetterCreateWithLic(doc3,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,setupD,semesterYear,company_self.company_name)
        res.status(200).json({message: "Created Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

////////////////////////// Part Setup Format Document ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// function create courtesy with license
function docCreateWithLic(doc,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,setupD,semesterYear,company_name){
        console.log(lastSetup.signature_img)
        // Define the path where the PDF file will be saved
            // Define the directory path
        const directoryPath = `./uploads/${std_id}/`;

        // Create directory if it does not exist
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Define the file path where the PDF file will be saved
        const filePath = path.join(directoryPath, `courtesy_license_${std_id}.pdf`);

        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(fontsize).text(`ที่ อว ๖๗.๓๐/(วฟ-${thisdate}-${number_courtesy}) `, 93.390861224, 104.77838878);

        // insert image below
        doc.image(imagePath, 259.2, 50.184, { width: 80 });

        doc.fontSize(fontsize).text("คณะวิศวกรรมศาสตร์", 367.34397222, 104.77838878);
        doc.fontSize(fontsize).text("มหาวิทยาลัยธรรมศาสตร์ศูนย์รังสิต", 367.34397222, 122.50194444);
        doc.fontSize(fontsize).text("อ. คลองหลวง จ. ปทุมธานี ๑๒๑๒๐", 367.34397222, 139.78099999);

        doc.fontSize(fontsize).text(`${date_courtesy}`, 301.91427778, 168.13022222);
        doc
        .fontSize(fontsize)
        .text("เรื่อง ขอความอนุเคราะห์นักศึกษาฝึกงานภาคฤดูร้อน",  93.390861224, 197.058);
        doc.fontSize(fontsize).text(`เรียน ${name_to} บริษัท ${company_name}`, 93.390861224, 219.96738889);
        doc
        .fontSize(fontsize)
        .text("สิ่งที่ส่งมาด้วย แบบตอบรับนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 242.78152778);
        doc
        .fontSize(fontsize)
        .text(
            "ด้วย ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
            144,
            273.92261111
        );
        doc
        .fontSize(fontsize)
        .text(
            "ได้กําหนดวิชาการฝึกงานทางวิศวกรรมไฟฟ้าไว้ในหลักสูตร โดยมีนโยบายที่จะส่งเสริมให้นักศึกษาชั้นปีที่  ๓",
            93.390861224,
            291.23694444
        );
        doc
        .fontSize(fontsize)
        .text(
            "ได้มีประสบการณ์และความรอบรู้จากการทํางานจริง  ตลอดจนรู้จักใช้ความรู้จากการศึกษามาประยุกต์เข้ากับ",
            93.390861224,
            308.55480556
        );
        doc.fontSize(fontsize).text("การทํางาน", 93.390861224, 325.86913889);

        doc
        .fontSize(fontsize)
        .text(
            "ในการนี้ ภาควิชาฯจึงขอความอนุเคราะห์ให้นักศึกษา ดังรายนามต่อไปนี้",
            146.16994444,
            356
        );
        doc
        .fontSize(fontsize)
        .text(
            `๑.${data.student.name_title_th}${data.student.displayname_th}  เลขทะเบียน ${thaiString}    ${data.student.department}`,
            146.16994444,
            377.6
        );
        // doc
        // .fontSize(fontsize)
        // .text(
        //     "๒.นายxxxxx   xxxxxx  เลขทะเบียน xxxxxxxxxx    สาขาวิชาวิศวกรรมไฟฟ้ากําลัง",
        //     144,
        //     392
        // );
        doc
        .fontSize(fontsize)
        .text(
            `ได้มีโอกาสเข้าฝึกงานในหน่วยงานของท่าน ช่วงปิดภาคฤดูร้อน ระหว่างวันที่ ${lastSetup.start_date} ถึงวันที่ ${lastSetup.end_date}`,
            93.390861224,
            421.68
        );
        doc
        .fontSize(fontsize)
        .text(
            `${lastSetup.end_date_year}   (รวมเวลาฝึกงานไม่น้อยกว่า  ๒๔๐ ชั่วโมง) ภาควิชาฯ หวังเป็นอย่างยิ่งว่าจะได้รับความอนุเคราะห์`,
            93.390861224,
            437.96
        );
        doc.fontSize(fontsize).text("จากท่าน  ในครั้งนี้", 93.6, 456.896);
        doc
        .fontSize(fontsize)
        .text(
            "จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์ด้วย จักขอบพระคุณยิ่ง",
            147.05894444,
            484.93072222
        );
        doc.fontSize(fontsize).text("ขอแสดงความนับถือ", 302.26705556, 513.19880556);
        doc.image(`./uploads/${lastSetup.signature_img}`, 286.984, 541.6, {scale: 0.05})
        doc.fontSize(fontsize).text(`(${lastSetup.head_name})`, 284.57172222, 592.64788889);
        doc.fontSize(fontsize).text("หัวหน้าภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 259.23169444, 609.70822222);
        doc.fontSize(fontsize).text("ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 91.656, 644.605);
        doc.fontSize(fontsize).text("โทร. ๐ ๒๕๖๔ ๓๐๐๑-๙ ต่อ ๓๐๓๗", 91.656, 662.48730556);
        doc.fontSize(fontsize).text("โทรสาร ๐ ๒๕๖๔ ๓๐๒๑", 91.656, 680.83175);

        doc.end();
}
// function create lettern with license
function docLetterCreateWithLic(doc,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,setupD,semesterYear,company_name){
    console.log(lastSetup.signature_img)
    // Define the path where the PDF file will be saved
        // Define the directory path
    const directoryPath = `./uploads/${std_id}/`;

    // Create directory if it does not exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define the file path where the PDF file will be saved
    const filePath = path.join(directoryPath, `letter_license_${std_id}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(fontsize).text(`ที่ อว ๖๗.๓๐/(วฟ-${thisdate}-${number_letter})`, 93.390861224, 91.77838878);

    // insert image below +10
    doc.image(imagePath, 259.2, 40.184, { width: 80 });
    //y = -13
    doc.fontSize(fontsize).text("คณะวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 367.34397222, 91.77838878);
    doc.fontSize(fontsize).text("คณะวิศวกรรมศาสตร์", 367.34397222, 108.71172211);
    doc.fontSize(fontsize).text("มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", 367.34397222, 125.64505544);
    doc.fontSize(fontsize).text("อ.คลองหลวง จ.ปทุมธานี ๑๒๑๒๐", 367.34397222, 142.57838877);
    //y = -10
    doc.fontSize(fontsize).text(`${date_letter}`, 259.99722222, 166.38888889);
    // y = -12
    doc
      .fontSize(fontsize)
      .text("เรื่อง    ขอส่งตัวนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 203.37952778);
    doc.fontSize(fontsize).text(`เรียน    ${name_to} บริษัท ${company_name}`, 93.390861224, 222.51608333);
    doc.fontSize(fontsize).text("อ้างถึง  แบบตอบรับนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 242.46566667);
    
    //y = -11
    doc
      .fontSize(fontsize)
      .text("สิ่งที่ส่งมาด้วย   ๑. ใบบันทึกเวลาการฝึกงานของนักศึกษา จํานวน ๒ ชุด", 93.390861224, 263.41172222);
    doc
      .fontSize(fontsize)
      .text("๒. แบบประเมินผลการฝึกงาน จํานวน ๒ ชุด", 158.99341667, 281.11763889);
    doc
      .fontSize(fontsize)
      .text("๓. แบบสอบถามผู้ประกอบการ จํานวน ๑ ชุด", 158.99341667, 297.99452778);
    //y = -7
    doc
      .fontSize(fontsize)
      .text("ตามที่อ้างถึง หน่วยงานของท่านได้ให้ความอนุเคราะห์ตอบรับนักศึกษา ภาควิชาวิศวกรรมไฟฟ้าและ", 149.29908333, 324.64286111);
    doc
      .fontSize(fontsize)
      .text("คอมพิวเตอร์  คณะวิศวกรรมศาสตร์  มหาวิทยาลัยธรรมศาสตร์  เข้ารับการฝึกงานภาคฤดูร้อน  ประจําปีการศึกษา", 93.390861224, 341.8055);
    doc
      .fontSize(fontsize)
      .text(`${convertStringToThaiNumber(semesterYear)} ระหว่างวันที่  ${lastSetup.start_date}  ถึงวันที่ ${lastSetup.end_date}  ${lastSetup.end_date_year}  (รวมเวลาไม่น้อยกว่า ๒๔๐ ชั่วโมง) แล้วนั้น`, 93.390861224, 359.20802778);
    // y = -7
    doc
      .fontSize(fontsize)
      .text("ภาควิชาฯ จึงขอส่งตัวนักศึกษา เข้าฝึกงานกับหน่วยงานของท่าน ดังรายชื่อต่อไปนี้", 149.29908333, 387.62075);
    
    doc
      .fontSize(fontsize)
      .text(`๑.${data.student.name_title_th}${data.student.displayname_th}  เลขทะเบียน ${thaiString}    ${data.student.department}`, 120.85108333, 407.55975);
    //y=-4
    doc
      .fontSize(fontsize)
      .text("อนึ่ง ภาควิชาฯ ได้จัดส่งเอกสารเพื่อประกอบการฝึกงานดังนี้", 149.29908333, 456.27622222);
    
    doc
      .fontSize(fontsize)
      .text("๑. ใบบันทึกการลงเวลาการฝึกงานของนักศึกษา สําหรับให้นักศึกษาลงเวลาการเข้าฝึกงาน", 120.85108333, 473.53763889);
    doc
      .fontSize(fontsize)
      .text("และขอความกรุณาผู้ควบคุมการฝึกงานลงนามท้ายใบบันทึกการลงเวลา", 132.52097222, 490.80258333);
    
    doc
      .fontSize(fontsize)
      .text("๒. แบบประเมินผลการฝึกงานให้ผู้ควบคุมการฝึกงานเป็นผู้ประเมิน", 120.85108333, 508.31094444);
    doc
      .fontSize(fontsize)
      .text("๓. แบบสอบถามผู้ประกอบการขอความกรุณาผู้ประกอบการให้ความเห็น", 120.85108333, 525.36775);
    doc
      .fontSize(fontsize)
      .text("จึงเรียนมาเพื่อโปรดทราบ และขอขอบพระคุณในความร่วมมือของท่านมา ณ โอกาสนี้", 149.29908333, 548.01608333);
      // y = -4
    doc.fontSize(fontsize).text("ขอแสดงความนับถือ", 303.55469444, 570.84433333);
    doc.image(`./uploads/${lastSetup.signature_img}`, 286.984, 590.6, {scale: 0.05})
    doc.fontSize(fontsize).text(`(${lastSetup.head_name})`, 274.94088889, 628.3965);
    doc.fontSize(fontsize).text("หัวหน้าภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 255.86619444, 645.49916667);
     // y = -5
    doc.fontSize(12).text("สํานักงานภาควิชาฯ", 93.390861224, 674.085);
    doc.fontSize(12).text("โทร. ๐ ๒๕๖๔ ๓๐๐๑-๕ ต่อ ๓๐๓๗ (คุณบุญเรือน)", 93.390861224, 688.88402778);
    doc.fontSize(12).text("โทรสาร ๐๒๕๖๔ ๓๐๒๑", 93.390861224, 703.68305556);
    
    doc.end();
}
// function create courtesy with non lincense
function docCreateWithNonLic(doc,std_id,fontsize,thisdate,number_courtesy,number_letter,imagePath,date_courtesy,date_letter,name_to,data,thaiString,lastSetup,semesterYear,company_name){
    console.log(lastSetup.signature_img)
    console.log("this multi in year",lastSetup)
    // Define the path where the PDF file will be saved
        // Define the directory path
    const directoryPath = `./uploads/${std_id}/`;

    // Create directory if it does not exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define the file path where the PDF file will be saved
    const filePath = path.join(directoryPath, `doc_nonlicense_${std_id}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(fontsize).text(`ที่ อว ๖๗.๓๐/(วฟ-${thisdate}-${number_courtesy}) `, 93.390861224, 104.77838878);

    // insert image below
    doc.image(imagePath, 259.2, 50.184, { width: 80 });

    doc.fontSize(fontsize).text("คณะวิศวกรรมศาสตร์", 367.34397222, 104.77838878);
    doc.fontSize(fontsize).text("มหาวิทยาลัยธรรมศาสตร์ศูนย์รังสิต", 367.34397222, 122.50194444);
    doc.fontSize(fontsize).text("อ. คลองหลวง จ. ปทุมธานี ๑๒๑๒๐", 367.34397222, 139.78099999);

    doc.fontSize(fontsize).text(`${date_courtesy}`, 301.91427778, 168.13022222);
    doc
    .fontSize(fontsize)
    .text("เรื่อง ขอความอนุเคราะห์นักศึกษาฝึกงานภาคฤดูร้อน",  93.390861224, 197.058);
    doc.fontSize(fontsize).text(`เรียน ${name_to} บริษัท ${company_name}`, 93.390861224, 219.96738889);
    doc
    .fontSize(fontsize)
    .text("สิ่งที่ส่งมาด้วย แบบตอบรับนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 242.78152778);
    doc
    .fontSize(fontsize)
    .text(
        "ด้วย ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
        144,
        273.92261111
    );
    doc
    .fontSize(fontsize)
    .text(
        "ได้กําหนดวิชาการฝึกงานทางวิศวกรรมไฟฟ้าไว้ในหลักสูตร โดยมีนโยบายที่จะส่งเสริมให้นักศึกษาชั้นปีที่  ๓",
        93.390861224,
        291.23694444
    );
    doc
    .fontSize(fontsize)
    .text(
        "ได้มีประสบการณ์และความรอบรู้จากการทํางานจริง  ตลอดจนรู้จักใช้ความรู้จากการศึกษามาประยุกต์เข้ากับ",
        93.390861224,
        308.55480556
    );
    doc.fontSize(fontsize).text("การทํางาน", 93.390861224, 325.86913889);

    doc
    .fontSize(fontsize)
    .text(
        "ในการนี้ ภาควิชาฯจึงขอความอนุเคราะห์ให้นักศึกษา ดังรายนามต่อไปนี้",
        146.16994444,
        356
    );
    doc
    .fontSize(fontsize)
    .text(
        `๑.${data.student.name_title_th}${data.student.displayname_th}  เลขทะเบียน ${thaiString}    ${data.student.department}`,
        146.16994444,
        377.6
    );
    // doc
    // .fontSize(fontsize)
    // .text(
    //     "๒.นายxxxxx   xxxxxx  เลขทะเบียน xxxxxxxxxx    สาขาวิชาวิศวกรรมไฟฟ้ากําลัง",
    //     144,
    //     392
    // );
    doc
    .fontSize(fontsize)
    .text(
        `ได้มีโอกาสเข้าฝึกงานในหน่วยงานของท่าน ช่วงปิดภาคฤดูร้อน ระหว่างวันที่ ${lastSetup.start_date} ถึงวันที่ ${lastSetup.end_date}`,
        93.390861224,
        421.68
    );
    doc
    .fontSize(fontsize)
    .text(
        `${lastSetup.end_date_year}   (รวมเวลาฝึกงานไม่น้อยกว่า  ๒๔๐ ชั่วโมง) ภาควิชาฯ หวังเป็นอย่างยิ่งว่าจะได้รับความอนุเคราะห์`,
        93.390861224,
        437.96
    );
    doc.fontSize(fontsize).text("จากท่าน  ในครั้งนี้", 93.6, 456.896);
    doc
    .fontSize(fontsize)
    .text(
        "จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์ด้วย จักขอบพระคุณยิ่ง",
        147.05894444,
        484.93072222
    );
    doc.fontSize(fontsize).text("ขอแสดงความนับถือ", 302.26705556, 513.19880556);
    doc.fontSize(fontsize).text(`(${lastSetup.head_name})`, 284.57172222, 592.64788889);
    doc.fontSize(fontsize).text("หัวหน้าภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 259.23169444, 609.70822222);
    doc.fontSize(fontsize).text("ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 91.656, 644.605);
    doc.fontSize(fontsize).text("โทร. ๐ ๒๕๖๔ ๓๐๐๑-๙ ต่อ ๓๐๓๗", 91.656, 662.48730556);
    doc.fontSize(fontsize).text("โทรสาร ๐ ๒๕๖๔ ๓๐๒๑", 91.656, 680.83175);

    doc.addPage()
    ////////////////////////////////
    // lettern create nonlicense
    doc.fontSize(fontsize).text(`ที่ อว ๖๗.๓๐/(วฟ-${thisdate}-${number_letter})`, 93.390861224, 91.77838878);

    // insert image below +10
    doc.image(imagePath, 259.2, 40.184, { width: 80 });
    //y = -13
    doc.fontSize(fontsize).text("คณะวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 367.34397222, 91.77838878);
    doc.fontSize(fontsize).text("คณะวิศวกรรมศาสตร์", 367.34397222, 108.71172211);
    doc.fontSize(fontsize).text("มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", 367.34397222, 125.64505544);
    doc.fontSize(fontsize).text("อ.คลองหลวง จ.ปทุมธานี ๑๒๑๒๐", 367.34397222, 142.57838877);
    //y = -10
    doc.fontSize(fontsize).text(`${date_letter}`, 259.99722222, 166.38888889);
    // y = -12
    doc
      .fontSize(fontsize)
      .text("เรื่อง    ขอส่งตัวนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 203.37952778);
    doc.fontSize(fontsize).text(`เรียน    ${name_to} บริษัท ${company_name}`, 93.390861224, 222.51608333);
    doc.fontSize(fontsize).text("อ้างถึง  แบบตอบรับนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 242.46566667);
    
    //y = -11
    doc
      .fontSize(fontsize)
      .text("สิ่งที่ส่งมาด้วย   ๑. ใบบันทึกเวลาการฝึกงานของนักศึกษา จํานวน ๒ ชุด", 93.390861224, 263.41172222);
    doc
      .fontSize(fontsize)
      .text("๒. แบบประเมินผลการฝึกงาน จํานวน ๒ ชุด", 158.99341667, 281.11763889);
    doc
      .fontSize(fontsize)
      .text("๓. แบบสอบถามผู้ประกอบการ จํานวน ๑ ชุด", 158.99341667, 297.99452778);
    //y = -7
    doc
      .fontSize(fontsize)
      .text("ตามที่อ้างถึง หน่วยงานของท่านได้ให้ความอนุเคราะห์ตอบรับนักศึกษา ภาควิชาวิศวกรรมไฟฟ้าและ", 149.29908333, 324.64286111);
    doc
      .fontSize(fontsize)
      .text("คอมพิวเตอร์  คณะวิศวกรรมศาสตร์  มหาวิทยาลัยธรรมศาสตร์  เข้ารับการฝึกงานภาคฤดูร้อน  ประจําปีการศึกษา", 93.390861224, 341.8055);
    doc
      .fontSize(fontsize)
      .text(`${convertStringToThaiNumber(semesterYear)} ระหว่างวันที่  ${lastSetup.start_date}  ถึงวันที่ ${lastSetup.end_date}  ${lastSetup.end_date_year}  (รวมเวลาไม่น้อยกว่า ๒๔๐ ชั่วโมง) แล้วนั้น`, 93.390861224, 359.20802778);
    // y = -7
    doc
      .fontSize(fontsize)
      .text("ภาควิชาฯ จึงขอส่งตัวนักศึกษา เข้าฝึกงานกับหน่วยงานของท่าน ดังรายชื่อต่อไปนี้", 149.29908333, 387.62075);
    
    doc
      .fontSize(fontsize)
      .text(`๑.${data.student.name_title_th}${data.student.displayname_th}  เลขทะเบียน ${thaiString}    ${data.student.department}`, 120.85108333, 407.55975);
    //y=-4
    doc
      .fontSize(fontsize)
      .text("อนึ่ง ภาควิชาฯ ได้จัดส่งเอกสารเพื่อประกอบการฝึกงานดังนี้", 149.29908333, 456.27622222);
    
    doc
      .fontSize(fontsize)
      .text("๑. ใบบันทึกการลงเวลาการฝึกงานของนักศึกษา สําหรับให้นักศึกษาลงเวลาการเข้าฝึกงาน", 120.85108333, 473.53763889);
    doc
      .fontSize(fontsize)
      .text("และขอความกรุณาผู้ควบคุมการฝึกงานลงนามท้ายใบบันทึกการลงเวลา", 132.52097222, 490.80258333);
    
    doc
      .fontSize(fontsize)
      .text("๒. แบบประเมินผลการฝึกงานให้ผู้ควบคุมการฝึกงานเป็นผู้ประเมิน", 120.85108333, 508.31094444);
    doc
      .fontSize(fontsize)
      .text("๓. แบบสอบถามผู้ประกอบการขอความกรุณาผู้ประกอบการให้ความเห็น", 120.85108333, 525.36775);
    doc
      .fontSize(fontsize)
      .text("จึงเรียนมาเพื่อโปรดทราบ และขอขอบพระคุณในความร่วมมือของท่านมา ณ โอกาสนี้", 149.29908333, 548.01608333);
      // y = -4
    doc.fontSize(fontsize).text("ขอแสดงความนับถือ", 303.55469444, 570.84433333);
   
    doc.fontSize(fontsize).text(`(${lastSetup.head_name})`, 274.94088889, 628.3965);
    doc.fontSize(fontsize).text("หัวหน้าภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 255.86619444, 645.49916667);
     // y = -5
    doc.fontSize(12).text("สํานักงานภาควิชาฯ", 93.390861224, 674.085);
    doc.fontSize(12).text("โทร. ๐ ๒๕๖๔ ๓๐๐๑-๕ ต่อ ๓๐๓๗ (คุณบุญเรือน)", 93.390861224, 688.88402778);
    doc.fontSize(12).text("โทรสาร ๐๒๕๖๔ ๓๐๒๑", 93.390861224, 703.68305556);
    
    doc.end();
  
}


// function create Letter with non lincense
function docCreateCourtesyWithNonLic(doc,std_id,fontsize,thisdate,number_courtesy,imagePath,date_courtesy,name_to,data,thaiString,lastSetup,semesterYear,company_name){
    console.log(lastSetup.signature_img)
    console.log("this multi in year",lastSetup)
    // Define the path where the PDF file will be saved
        // Define the directory path
    const directoryPath = `./uploads/${std_id}/`;

    // Create directory if it does not exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define the file path where the PDF file will be saved
    const filePath = path.join(directoryPath, `doc_nonlicense_courtesy_${std_id}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(fontsize).text(`ที่ อว ๖๗.๓๐/(วฟ-${thisdate}-${number_courtesy}) `, 93.390861224, 104.77838878);

    // insert image below
    doc.image(imagePath, 259.2, 50.184, { width: 80 });

    doc.fontSize(fontsize).text("คณะวิศวกรรมศาสตร์", 367.34397222, 104.77838878);
    doc.fontSize(fontsize).text("มหาวิทยาลัยธรรมศาสตร์ศูนย์รังสิต", 367.34397222, 122.50194444);
    doc.fontSize(fontsize).text("อ. คลองหลวง จ. ปทุมธานี ๑๒๑๒๐", 367.34397222, 139.78099999);

    doc.fontSize(fontsize).text(`${date_courtesy}`, 301.91427778, 168.13022222);
    doc
    .fontSize(fontsize)
    .text("เรื่อง ขอความอนุเคราะห์นักศึกษาฝึกงานภาคฤดูร้อน",  93.390861224, 197.058);
    doc.fontSize(fontsize).text(`เรียน ${name_to} บริษัท ${company_name}`, 93.390861224, 219.96738889);
    doc
    .fontSize(fontsize)
    .text("สิ่งที่ส่งมาด้วย แบบตอบรับนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 242.78152778);
    doc
    .fontSize(fontsize)
    .text(
        "ด้วย ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
        144,
        273.92261111
    );
    doc
    .fontSize(fontsize)
    .text(
        "ได้กําหนดวิชาการฝึกงานทางวิศวกรรมไฟฟ้าไว้ในหลักสูตร โดยมีนโยบายที่จะส่งเสริมให้นักศึกษาชั้นปีที่  ๓",
        93.390861224,
        291.23694444
    );
    doc
    .fontSize(fontsize)
    .text(
        "ได้มีประสบการณ์และความรอบรู้จากการทํางานจริง  ตลอดจนรู้จักใช้ความรู้จากการศึกษามาประยุกต์เข้ากับ",
        93.390861224,
        308.55480556
    );
    doc.fontSize(fontsize).text("การทํางาน", 93.390861224, 325.86913889);

    doc
    .fontSize(fontsize)
    .text(
        "ในการนี้ ภาควิชาฯจึงขอความอนุเคราะห์ให้นักศึกษา ดังรายนามต่อไปนี้",
        146.16994444,
        356
    );
    doc
    .fontSize(fontsize)
    .text(
        `๑.${data.student.name_title_th}${data.student.displayname_th}  เลขทะเบียน ${thaiString}    ${data.student.department}`,
        146.16994444,
        377.6
    );
    // doc
    // .fontSize(fontsize)
    // .text(
    //     "๒.นายxxxxx   xxxxxx  เลขทะเบียน xxxxxxxxxx    สาขาวิชาวิศวกรรมไฟฟ้ากําลัง",
    //     144,
    //     392
    // );
    doc
    .fontSize(fontsize)
    .text(
        `ได้มีโอกาสเข้าฝึกงานในหน่วยงานของท่าน ช่วงปิดภาคฤดูร้อน ระหว่างวันที่ ${lastSetup.start_date} ถึงวันที่ ${lastSetup.end_date}`,
        93.390861224,
        421.68
    );
    doc
    .fontSize(fontsize)
    .text(
        `${lastSetup.end_date_year}   (รวมเวลาฝึกงานไม่น้อยกว่า  ๒๔๐ ชั่วโมง) ภาควิชาฯ หวังเป็นอย่างยิ่งว่าจะได้รับความอนุเคราะห์`,
        93.390861224,
        437.96
    );
    doc.fontSize(fontsize).text("จากท่าน  ในครั้งนี้", 93.6, 456.896);
    doc
    .fontSize(fontsize)
    .text(
        "จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์ด้วย จักขอบพระคุณยิ่ง",
        147.05894444,
        484.93072222
    );
    doc.fontSize(fontsize).text("ขอแสดงความนับถือ", 302.26705556, 513.19880556);
    doc.fontSize(fontsize).text(`(${lastSetup.head_name})`, 284.57172222, 592.64788889);
    doc.fontSize(fontsize).text("หัวหน้าภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 259.23169444, 609.70822222);
    doc.fontSize(fontsize).text("ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 91.656, 644.605);
    doc.fontSize(fontsize).text("โทร. ๐ ๒๕๖๔ ๓๐๐๑-๙ ต่อ ๓๐๓๗", 91.656, 662.48730556);
    doc.fontSize(fontsize).text("โทรสาร ๐ ๒๕๖๔ ๓๐๒๑", 91.656, 680.83175);
    doc.end();
}


// function create courtesy with non lincense
function docCreateLetterWithNonLic(doc,std_id,fontsize,thisdate,number_letter,imagePath,date_letter,name_to,data,thaiString,lastSetup,semesterYear,company_name){
    console.log(lastSetup.signature_img)
    console.log("this multi in year",lastSetup)
    // Define the path where the PDF file will be saved
        // Define the directory path
    const directoryPath = `./uploads/${std_id}/`;

    // Create directory if it does not exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define the file path where the PDF file will be saved
    const filePath = path.join(directoryPath, `doc_nonlicense_letter_${std_id}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));

    ////////////////////////////////
    // lettern create nonlicense
    doc.fontSize(fontsize).text(`ที่ อว ๖๗.๓๐/(วฟ-${thisdate}-${number_letter})`, 93.390861224, 91.77838878);

    // insert image below +10
    doc.image(imagePath, 259.2, 40.184, { width: 80 });
    //y = -13
    doc.fontSize(fontsize).text("คณะวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 367.34397222, 91.77838878);
    doc.fontSize(fontsize).text("คณะวิศวกรรมศาสตร์", 367.34397222, 108.71172211);
    doc.fontSize(fontsize).text("มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", 367.34397222, 125.64505544);
    doc.fontSize(fontsize).text("อ.คลองหลวง จ.ปทุมธานี ๑๒๑๒๐", 367.34397222, 142.57838877);
    //y = -10
    doc.fontSize(fontsize).text(`${date_letter}`, 259.99722222, 166.38888889);
    // y = -12
    doc
      .fontSize(fontsize)
      .text("เรื่อง    ขอส่งตัวนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 203.37952778);
    doc.fontSize(fontsize).text(`เรียน    ${name_to} บริษัท ${company_name}`, 93.390861224, 222.51608333);
    doc.fontSize(fontsize).text("อ้างถึง  แบบตอบรับนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 242.46566667);
    
    //y = -11
    doc
      .fontSize(fontsize)
      .text("สิ่งที่ส่งมาด้วย   ๑. ใบบันทึกเวลาการฝึกงานของนักศึกษา จํานวน ๒ ชุด", 93.390861224, 263.41172222);
    doc
      .fontSize(fontsize)
      .text("๒. แบบประเมินผลการฝึกงาน จํานวน ๒ ชุด", 158.99341667, 281.11763889);
    doc
      .fontSize(fontsize)
      .text("๓. แบบสอบถามผู้ประกอบการ จํานวน ๑ ชุด", 158.99341667, 297.99452778);
    //y = -7
    doc
      .fontSize(fontsize)
      .text("ตามที่อ้างถึง หน่วยงานของท่านได้ให้ความอนุเคราะห์ตอบรับนักศึกษา ภาควิชาวิศวกรรมไฟฟ้าและ", 149.29908333, 324.64286111);
    doc
      .fontSize(fontsize)
      .text("คอมพิวเตอร์  คณะวิศวกรรมศาสตร์  มหาวิทยาลัยธรรมศาสตร์  เข้ารับการฝึกงานภาคฤดูร้อน  ประจําปีการศึกษา", 93.390861224, 341.8055);
    doc
      .fontSize(fontsize)
      .text(`${convertStringToThaiNumber(semesterYear)} ระหว่างวันที่  ${lastSetup.start_date}  ถึงวันที่ ${lastSetup.end_date}  ${lastSetup.end_date_year}  (รวมเวลาไม่น้อยกว่า ๒๔๐ ชั่วโมง) แล้วนั้น`, 93.390861224, 359.20802778);
    // y = -7
    doc
      .fontSize(fontsize)
      .text("ภาควิชาฯ จึงขอส่งตัวนักศึกษา เข้าฝึกงานกับหน่วยงานของท่าน ดังรายชื่อต่อไปนี้", 149.29908333, 387.62075);
    
    doc
      .fontSize(fontsize)
      .text(`๑.${data.student.name_title_th}${data.student.displayname_th}  เลขทะเบียน ${thaiString}    ${data.student.department}`, 120.85108333, 407.55975);
    //y=-4
    doc
      .fontSize(fontsize)
      .text("อนึ่ง ภาควิชาฯ ได้จัดส่งเอกสารเพื่อประกอบการฝึกงานดังนี้", 149.29908333, 456.27622222);
    
    doc
      .fontSize(fontsize)
      .text("๑. ใบบันทึกการลงเวลาการฝึกงานของนักศึกษา สําหรับให้นักศึกษาลงเวลาการเข้าฝึกงาน", 120.85108333, 473.53763889);
    doc
      .fontSize(fontsize)
      .text("และขอความกรุณาผู้ควบคุมการฝึกงานลงนามท้ายใบบันทึกการลงเวลา", 132.52097222, 490.80258333);
    
    doc
      .fontSize(fontsize)
      .text("๒. แบบประเมินผลการฝึกงานให้ผู้ควบคุมการฝึกงานเป็นผู้ประเมิน", 120.85108333, 508.31094444);
    doc
      .fontSize(fontsize)
      .text("๓. แบบสอบถามผู้ประกอบการขอความกรุณาผู้ประกอบการให้ความเห็น", 120.85108333, 525.36775);
    doc
      .fontSize(fontsize)
      .text("จึงเรียนมาเพื่อโปรดทราบ และขอขอบพระคุณในความร่วมมือของท่านมา ณ โอกาสนี้", 149.29908333, 548.01608333);
      // y = -4
    doc.fontSize(fontsize).text("ขอแสดงความนับถือ", 303.55469444, 570.84433333);
   
    doc.fontSize(fontsize).text(`(${lastSetup.head_name})`, 274.94088889, 628.3965);
    doc.fontSize(fontsize).text("หัวหน้าภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 255.86619444, 645.49916667);
     // y = -5
    doc.fontSize(12).text("สํานักงานภาควิชาฯ", 93.390861224, 674.085);
    doc.fontSize(12).text("โทร. ๐ ๒๕๖๔ ๓๐๐๑-๕ ต่อ ๓๐๓๗ (คุณบุญเรือน)", 93.390861224, 688.88402778);
    doc.fontSize(12).text("โทรสาร ๐๒๕๖๔ ๓๐๒๑", 93.390861224, 703.68305556);
    
    doc.end();
  
}