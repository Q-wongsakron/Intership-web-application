const db =require("../db/index")
const { news, admin} = db

db.sequelize.sync()

exports.createNews = async(req, res) => {
    try{
        const teacher_id = req.user.id
        const { topic, detail } = req.body;
        console.log(teacher_id)
        const createNews = await news.create({
            teacher_id : teacher_id,
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
// ใช้วิธี เเยกส่งโดยส่ง text ไปสร้าง database ก่อน ใน react
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

        console.log(req.files);
        if(req.file){
            // Assuming req.files is an array of uploaded files
            const imagePaths = req.files.map(file => `${req.user.username}/${file.originalname}`);

            // Concatenate the image paths with commas
            const concatenatedPaths = imagePaths.join(',');

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