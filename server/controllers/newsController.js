const db =require("../db/index")
const { news, admin} = db

db.sequelize.sync()

exports.createNews = async(req, res) => {
    try{

        const { topic, detail } = req.body;
        const createNews = await news.create({
            topic,
            detail,
        })
        res.status(200).json({ message: "news created successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({message: "server error"})
    }
}

exports.allNews = async(req, res) => {
    try{
        const allNews = await news.findAll()

        res.status(200).json(allNews)
    }catch(err){
        console.error(err)
        res.status(500).json({message: "server error"})
    }
}

exports.oneNews = async(req, res) => {
    try{
        const oneNews = await news.findOne({
            where: { news_id : req.params.id }

        })
        res.status(200).json(oneNews)
    }catch(err){
        console.error(err)
        res.status(500).json({message: "server error"})
    }
}

exports.editNews = async(req, res) => {
    try{
        const {id} = req.params
        const { topic, detail } = req.body;
        const editNews = await news.update({
            topic,
            detail,
        },{ where: { news_id : id}})
        res.status(200).json({ message: "แก้ไขข่าวสารสำเร็จ" });
    }catch(err){
        console.error(err)
        res.status(500).json({message: "server error"})
    }
}

exports.deleteNews = async(req, res) => {
    try{
        const {id} = req.params
        const deleteNews = await news.destroy({where: {news_id : id}})
        res.status(200).json({ message: "ลบข่าวสารสำเร็จ" });
    }catch(err){
        console.error(err)
        res.status(500).json({message: "server error"})
    }
}

// ใช้วิธี แยกส่งโดยส่ง text ไปสร้าง database ก่อน ใน react
exports.uploadCoverImg = async (req, res) => {
    try{
        if(req.file){
            const getlastNews = await news.findAll()
            const lastnews = getlastNews.length - 1
        
            const uplaodCover = await news.update({
                cover_img: `${req.user.username}/${req.file.originalname}`
            },{ where: { news_id : getlastNews[lastnews].news_id}})
            res.status(200).send("Upload Successfully");
        }else{
            res.status(200).send("Upload no file");
        }
    }catch(err){
        console.error(err)
        res.status(500).json({message: "server error"})
    }
}

exports.uploadImages = async (req, res) => {
    try {
        const getlastNews = await news.findAll()
        const lastnews = getlastNews.length - 1

        console.log("hello PIC",req.files);
        if(req.files){
            // Assuming req.files is an array of uploaded files
            const imagePaths = req.files.map(file => `${req.user.username}/${file.originalname}`);

            // Concatenate the image paths with commas
            const concatenatedPaths = imagePaths.join(',');
            console.log("concatenated paths", concatenatedPaths)
            // Assuming you want to update the database with a comma-separated string of image paths
            const uplaodImages = await news.update({
                images: concatenatedPaths
            }, { where: { news_id : getlastNews[lastnews].news_id } });

            res.status(200).send("Upload Successfully");
        }else{
            res.status(200).send("Upload no file");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};