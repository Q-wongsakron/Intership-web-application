const db = require("../db/index");
const { student, employer, confirm, setup_courtesy, gen_document, edit_courtesy, self_enroll,gen_document_self} = db;
db.sequelize.sync();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require('path');

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
        const { start_date_convert, end_date_convert, head_name } = req.body.formData;
        console.log("Extracted form data:", { start_date_convert, end_date_convert, head_name });
        
        const setup = await setup_courtesy.create({
            start_date:start_date_convert,
            end_date:end_date_convert,
            head_name,
            
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
        const { id } = req.params;
   
        const showEditCourtasy = await edit_courtesy.findOne({where: {std_id: id}})
    
        res.status(200).send(showEditCourtasy)
    }catch(err){
        console.error(err)
        res.status(500).send("Internal Server Error");
    }
}

// All data in edit courtesy
exports.showAllEditCourtasy = async (req, res) => {
    try{
    
        const showAllEditCourtasy = await edit_courtesy.findAll()
    
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

// create create new pre DOC
exports.preCreateCourtesy = async (req, res) => {
    
    try{
        // load data from client
        const {std_id, number, date, name_to } = req.body;
        // create new edit data 
        const saveEditGenDoc = await edit_courtesy.create({
                std_id: std_id,
                number: number,
                date: date,
                name_to: name_to
        })
        
        
        res.status(200).json({message: "Created Pre Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}




// edit pre DOC
exports.editPreCreateCourtesy = async (req, res) => {
    
    try{
        // load data from client
        const {std_id, number, date, name_to } = req.body;
        // update edit data 
        const saveEditGenDoc = await edit_courtesy.update({
                std_id: std_id,
                number: number,
                date: date,
                name_to: name_to
        }, {where: {std_id : std_id}})
        
        
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
        // const { id } = req.params;
        const {std_id,employer_id, number, date, name_to } = req.body;
        const data = await confirm.findOne({
            where: {std_id: std_id },   
            include: {model : student}
        })
        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.student.std_id);

        // check if used to create
        const findUser = await gen_document.findOne({
            where: {std_id: std_id },   
        })

        // create a gen DOC
        if (!findUser){
            const saveGenDoc = await gen_document.create({
                std_id: std_id,
                employer_id: employer_id,
                courtesy: `2566/${std_id}/courtesy_${std_id}.pdf`,
                courtesy_license: `2566/${std_id}/courtesy_license_${std_id}.pdf` 
            })
            // udate status in confirm database
            const updateStatus = await confirm.update(
                {
                    status: "ดำเนินเอกสารเสร็จสิ้น",
                    date_gen_doc: currentDate
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
        docCreateWithLic(doc,std_id,fontsize,thisdate,number,imagePath,date,name_to,data,thaiString,lastSetup,setupD)
        docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number,imagePath,date,name_to,data,thaiString,lastSetup)
        res.status(200).json({message: "Created Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// create new DOC Multiple
exports.createMultiCourtesy = async (req, res) => {
    try {
        
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

                const data = await confirm.findOne({
                    where: { std_id: item.std_id },
                    include: { model: student }
                });
                const setup = await setup_courtesy.findAll();
                const lastSetup = setup[setup.length - 1];

                const thaiString = convertStringToThaiNumber(data.student.std_id);

                const findUser = await gen_document.findOne({
                    where: { std_id: item.std_id },
                });

                if (!findUser) {
                    const saveGenDoc = await gen_document.create({
                        std_id: item.std_id,
                        employer_id: item.employer_id,
                        courtesy: `2566/${item.std_id}/courtesy_${item.std_id}.pdf`,
                        courtesy_license: `2566/${item.std_id}/courtesy_license_${item.std_id}.pdf`
                    });

                    const updateStatus = await confirm.update(
                        {
                            status: "ดำเนินเอกสารเสร็จสิ้น",
                            date_gen_doc: currentDate
                        },
                        {
                            where: { std_id: item.std_id },
                        }
                    );

                    // const saveEditGenDoc = await edit_courtesy.create({
                    //     std_id: item.std_id,
                    //     number: item.number,
                    //     date: item.date,
                    //     name_to: item.name_to
                    // });
                }

                docCreateWithLic(doc, item.std_id, fontsize, thisdate, item.number, imagePath, item.date, item.name_to, data, thaiString, lastSetup, setupD);
                docCreateWithNonLic(doc2, item.std_id, fontsize, thisdate, item.number, imagePath, item.date, item.name_to, data, thaiString, lastSetup);
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
        console.log("hello",Data.selectedItemsSelf)
        if (Data.length > 0) {
            await Promise.all(Data.map(async (item, index) => {
                console.log(item.std_id);

                // Create a new PDF document with the Thai font
                const doc = new PDFDocument({ font: thaiFontPath });
                const doc2 = new PDFDocument({ font: thaiFontPath });

                const data = await edit_courtesy.findOne({
                    where: { std_id: item.std_id },
                    include: { model: student }
                });
                const setup = await setup_courtesy.findAll();
                const lastSetup = setup[setup.length - 1];

                const thaiString = convertStringToThaiNumber(data.student.std_id);

                const findUser = await gen_document_self.findOne({
                    where: { std_id: item.std_id },
                });

                if (!findUser) {
                    const saveGenDoc = await gen_document_self.create({
                        std_id: item.std_id,
                        self_enroll_id: item.self_enroll_id,
                        courtesy: `2566/${item.std_id}/courtesy_${item.std_id}.pdf`,
                        courtesy_license: `2566/${item.std_id}/courtesy_license_${item.std_id}.pdf`
                    });

                    const updateStatus = await self_enroll.update(
                        {
                            status: "ดำเนินเอกสารเสร็จสิ้น",
                            date_gen_doc: currentDate
                        },
                        {
                            where: { std_id: item.std_id },
                        }
                    );

                    // const saveEditGenDoc = await edit_courtesy.create({
                    //     std_id: item.std_id,
                    //     number: item.number,
                    //     date: item.date,
                    //     name_to: item.name_to
                    // });
                }

                docCreateWithLic(doc, item.std_id, fontsize, thisdate, item.number, imagePath, item.date, item.name_to, data, thaiString, lastSetup, setupD);
                docCreateWithNonLic(doc2, item.std_id, fontsize, thisdate, item.number, imagePath, item.date, item.name_to, data, thaiString, lastSetup);
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

// edit Courtesy after created
exports.editCourtesy = async (req, res) => {
    try{
        // load default data
        const setupD = instantDataDoc();;
        const thisdate = setupD.thisdate;
        const fontsize = setupD.fontsize;
        const thaiFontPath = setupD.font
        const imagePath = setupD.img_cover;

        // Create a new PDF document with the Thai font
        const doc = new PDFDocument({ font: thaiFontPath });
        const doc2 = new PDFDocument({ font: thaiFontPath });
        const {std_id, number, date, name_to } = req.body;
        const data = await edit_courtesy.findOne({
            where: {std_id: std_id },   
            include: {model : student}
        })
        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.student.std_id);

        // update data edit
        const saveEditGenDoc = await edit_courtesy.update({
            number: number,
            date: date,
            name_to: name_to
        },{where: {std_id: std_id }}
        )
        
        // Re create DOC
        docCreateWithLic(doc,std_id,fontsize,thisdate,number,imagePath,date,name_to,data,thaiString,lastSetup,setupD)
        docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number,imagePath,date,name_to,data,thaiString,lastSetup)

        res.status(200).json({message: "Created Pdf Successfully"})

    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}


// create new DOC Self
exports.createCourtesySelf = async (req, res) => {
    
    try{
        // modify loop create many document in one time

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
        // const { id } = req.params;
        const {std_id,self_enroll_id, number, date, name_to } = req.body;
        const data = await self_enroll.findOne({
            where: {std_id: std_id },   
            include: {model : student}
        })
        const setup = await setup_courtesy.findAll()
        const lastSetup = setup[setup.length - 1]
        
        const thaiString = convertStringToThaiNumber(data.std_id);

        // check if used to create
        const findUser = await gen_document_self.findOne({
            where: {std_id: std_id },   
        })

        // create a gen DOC
        if (!findUser){
            const saveGenDoc = await gen_document_self.create({
                std_id: std_id,
                self_enroll_id: self_enroll_id,
                courtesy: `2566/${std_id}/courtesy_${std_id}.pdf`,
                courtesy_license: `2566/${std_id}/courtesy_license_${std_id}.pdf` 
            })
            // udate status in confirm database
            const updateStatus = await self_enroll.update(
                {
                    status: "ดำเนินเอกสารเสร็จสิ้น",
                    date_gen_doc: currentDate
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
        docCreateWithLic(doc,std_id,fontsize,thisdate,number,imagePath,date,name_to,data,thaiString,lastSetup,setupD)
        docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number,imagePath,date,name_to,data,thaiString,lastSetup)
        res.status(200).json({message: "Created Pdf Successfully"})
   
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}


// function create courtesy with license
function docCreateWithLic(doc,std_id,fontsize,thisdate,number,imagePath,date,name_to,data,thaiString,lastSetup,setupD){
        console.log(lastSetup.signature_img)
        // Define the path where the PDF file will be saved
            // Define the directory path
        const directoryPath = `./uploads/2566/${std_id}/`;

        // Create directory if it does not exist
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Define the file path where the PDF file will be saved
        const filePath = path.join(directoryPath, `courtesy_license_${std_id}.pdf`);

        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(fontsize).text(`ที่ อว ๖๗.๓๐/(วฟ-${thisdate}-${number}) `, 93.390861224, 104.77838878);

        // insert image below
        doc.image(imagePath, 259.2, 30.184, { width: 70 });

        doc.fontSize(fontsize).text("คณะวิศวกรรมศาสตร์", 367.34397222, 104.77838878);
        doc.fontSize(fontsize).text("มหาวิทยาลัยธรรมศาสตร์ศูนย์รังสิต", 367.34397222, 122.50194444);
        doc.fontSize(fontsize).text("อ. คลองหลวง จ. ปทุมธานี ๑๒๑๒๐", 367.34397222, 139.78099999);

        doc.fontSize(fontsize).text(`${date}`, 301.91427778, 168.13022222);
        doc
        .fontSize(fontsize)
        .text("เรื่อง ขอความอนุเคราะห์นักศึกษาฝึกงานภาคฤดูร้อน",  93.390861224, 197.058);
        doc.fontSize(fontsize).text(`เรียน ${name_to}`, 93.390861224, 219.96738889);
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
            `๒๕${thisdate}   (รวมเวลาฝึกงานไม่น้อยกว่า  ๒๔๐ ชั่วโมง) ภาควิชาฯ หวังเป็นอย่างยิ่งว่าจะได้รับความอนุเคราะห์`,
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
        doc.image(`./uploads/${lastSetup.signature_img}`, 276.984, 541.6, {scale: 0.05})
        doc.fontSize(fontsize).text(`(${lastSetup.head_name})`, 284.57172222, 592.64788889);
        doc.fontSize(fontsize).text("หัวหน้าภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 259.23169444, 609.70822222);
        doc.fontSize(fontsize).text("ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 91.656, 644.605);
        doc.fontSize(fontsize).text("โทร. ๐ ๒๕๖๔ ๓๐๐๑-๙ ต่อ ๓๐๓๗", 91.656, 662.48730556);
        doc.fontSize(fontsize).text("โทรสาร ๐ ๒๕๖๔ ๓๐๒๑", 91.656, 680.83175);

        doc.end();
}

// function create courtesy with non lincense
function docCreateWithNonLic(doc2,std_id,fontsize,thisdate,number,imagePath,date,name_to,data,thaiString,lastSetup){
    console.log(lastSetup.signature_img)
    // Define the path where the PDF file will be saved
        // Define the directory path
    const directoryPath = `./uploads/2566/${std_id}/`;

    // Create directory if it does not exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define the file path where the PDF file will be saved
    const filePath = path.join(directoryPath, `courtesy_${std_id}.pdf`);

    doc2.pipe(fs.createWriteStream(filePath));

    doc2.fontSize(fontsize).text(`ที่ อว ๖๗.๓๐/(วฟ-${thisdate}-${number}) `, 93.390861224, 104.77838878);

    // insert image below
    doc2.image(imagePath, 259.2, 30.184, { width: 70 });

    doc2.fontSize(fontsize).text("คณะวิศวกรรมศาสตร์", 367.34397222, 104.77838878);
    doc2.fontSize(fontsize).text("มหาวิทยาลัยธรรมศาสตร์ศูนย์รังสิต", 367.34397222, 122.50194444);
    doc2.fontSize(fontsize).text("อ. คลองหลวง จ. ปทุมธานี ๑๒๑๒๐", 367.34397222, 139.78099999);

    doc2.fontSize(fontsize).text(`${date}`, 301.91427778, 168.13022222);
    doc2
    .fontSize(fontsize)
    .text("เรื่อง ขอความอนุเคราะห์นักศึกษาฝึกงานภาคฤดูร้อน",  93.390861224, 197.058);
    doc2.fontSize(fontsize).text(`เรียน ${name_to}`, 93.390861224, 219.96738889);
    doc2
    .fontSize(fontsize)
    .text("สิ่งที่ส่งมาด้วย แบบตอบรับนักศึกษาฝึกงานภาคฤดูร้อน", 93.390861224, 242.78152778);
    doc2
    .fontSize(fontsize)
    .text(
        "ด้วย ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
        144,
        273.92261111
    );
    doc2
    .fontSize(fontsize)
    .text(
        "ได้กําหนดวิชาการฝึกงานทางวิศวกรรมไฟฟ้าไว้ในหลักสูตร โดยมีนโยบายที่จะส่งเสริมให้นักศึกษาชั้นปีที่  ๓",
        93.390861224,
        291.23694444
    );
    doc2
    .fontSize(fontsize)
    .text(
        "ได้มีประสบการณ์และความรอบรู้จากการทํางานจริง  ตลอดจนรู้จักใช้ความรู้จากการศึกษามาประยุกต์เข้ากับ",
        93.390861224,
        308.55480556
    );
    doc2.fontSize(fontsize).text("การทํางาน", 93.390861224, 325.86913889);

    doc2
    .fontSize(fontsize)
    .text(
        "ในการนี้ ภาควิชาฯจึงขอความอนุเคราะห์ให้นักศึกษา ดังรายนามต่อไปนี้",
        146.16994444,
        356
    );
    doc2
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
    doc2
    .fontSize(fontsize)
    .text(
        `ได้มีโอกาสเข้าฝึกงานในหน่วยงานของท่าน ช่วงปิดภาคฤดูร้อน ระหว่างวันที่ ${lastSetup.start_date} ถึงวันที่ ${lastSetup.end_date}`,
        93.390861224,
        421.68
    );
    doc2
    .fontSize(fontsize)
    .text(
        `๒๕${thisdate}   (รวมเวลาฝึกงานไม่น้อยกว่า  ๒๔๐ ชั่วโมง) ภาควิชาฯ หวังเป็นอย่างยิ่งว่าจะได้รับความอนุเคราะห์`,
        93.390861224,
        437.96
    );
    doc2.fontSize(fontsize).text("จากท่าน  ในครั้งนี้", 93.6, 456.896);
    doc2
    .fontSize(fontsize)
    .text(
        "จึงเรียนมาเพื่อโปรดพิจารณาให้ความอนุเคราะห์ด้วย จักขอบพระคุณยิ่ง",
        147.05894444,
        484.93072222
    );
    doc2.fontSize(fontsize).text("ขอแสดงความนับถือ", 302.26705556, 513.19880556);
    doc2.fontSize(fontsize).text(`(${lastSetup.head_name})`, 284.57172222, 592.64788889);
    doc2.fontSize(fontsize).text("หัวหน้าภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 259.23169444, 609.70822222);
    doc2.fontSize(fontsize).text("ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์", 91.656, 644.605);
    doc2.fontSize(fontsize).text("โทร. ๐ ๒๕๖๔ ๓๐๐๑-๙ ต่อ ๓๐๓๗", 91.656, 662.48730556);
    doc2.fontSize(fontsize).text("โทรสาร ๐ ๒๕๖๔ ๓๐๒๑", 91.656, 680.83175);

    doc2.end();
}