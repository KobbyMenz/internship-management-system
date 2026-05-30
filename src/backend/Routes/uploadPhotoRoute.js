import staticStorage from "../Services/staticStorage.js";

export default function uploadPhotoRoute(app) {
  const upload = staticStorage();

  app.post("/api/uploadPhoto", upload.single("photo"), (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      // Return the public path to the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      return res.status(201).json({ url: fileUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}
