import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/reports",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export default multer({ storage });

