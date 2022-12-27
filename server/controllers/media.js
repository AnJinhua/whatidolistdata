const Media = require("../models/media");
const MediaComment = require("../models/mediaComments");
const { deleteMediaService } = require("../services/media");
const {
  deleteMediaCommentService,
} = require("../services/deleteMediaCommentService");
const { MEDIA_CDN_URL } = require("../config/s3");
const { deleteFile } = require("./uploaderController");

exports.createMedia = async (req, res) => {
  const uploadedFiles = req.files.media;
  const uploadedThumbnails = req.files.thumbnail;

  let newMediaData;

  if (!uploadedFiles) {
    newMediaData = {
      ...req.body,
    };
  } else {
    newMediaData = {
      ...req.body,
      file: uploadedFiles.map((file) => {
        return {
          location: file.location,
          key: file.key,
          cdnUrl: MEDIA_CDN_URL + "media/" + file.key,
        };
      }),

      thumbnail: uploadedThumbnails[0]
        ? uploadedThumbnails.map((file) => {
            return {
              location: file.location,
              key: file.key,
              cdnUrl: MEDIA_CDN_URL + "media/" + file.key,
            };
          })
        : uploadedFiles.map((file) => {
            return {
              location: file.location,
              key: file.key,
              cdnUrl: MEDIA_CDN_URL + "media/" + file.key,
            };
          }),
    };
  }

  const newMedia = new Media(newMediaData);
  try {
    const savedMedia = await newMedia.save();
    res.status(200).json(savedMedia);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createMediaComment = async (req, res) => {
  const newMediaComment = new MediaComment(req.body);
  try {
    const savedMediaComment = await newMediaComment.save();
    res.status(200).json(savedMediaComment);
  } catch (err) {
    res.status(500).json(err);
  }
};

//update file
exports.editMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json(err);
  }
};

//upload to s3 bucket
exports.uploadS3 = async (req, res) => {
  try {
    const uploadedFile = req.files.file[0];

    if (!uploadedFile) {
      res.status(401).json({
        status: false,
        message: "File not uploaded",
      });
    } else {
      const resData = {
        location: uploadedFile.location,
        key: uploadedFile.key,
        cdnUrl: MEDIA_CDN_URL + "media/" + uploadedFile.key,
      };
      res.status(200).json(resData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllUserMedia = async (req, res) => {
  try {
    const media = await Media.find({
      userSlug: req.params.userSlug,
    });
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getMediaPost = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getPaginatedUserMedia = async (req, res) => {
  try {
    const media = await Media.find({
      userSlug: req.params.userSlug,
    })
      .skip(req.query.page * 6)
      .limit(6);
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getPaginatedMediaComments = async (req, res) => {
  try {
    const comment = await MediaComment.find({
      mediaId: req.params.mediaId,
    })
      .sort({ createdAt: -1 })
      .skip(req.query.page * 10)
      .limit(10);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteMediaComment = async (req, res) => {
  const result = await deleteMediaCommentService(req);
  res.status(result.statusCode).json(result.data);
};

exports.deleteMedia = async (req, res) => {
  const result = await deleteMediaService(req);

  result.data.file.forEach(({ key }) => {
    deleteFile(key, "media");
  });

  result.data.thumbnail.forEach(({ key }) => {
    deleteFile(key, "media");
  });

  res.status(result.statusCode).json(result.data);
  if (!result.error) {
    //   emit post event
    try {
      const deletedComment = await MediaComment.deleteMany({
        mediaId: result.data._id,
      });
      console.log("deleted comments", deletedComment);
    } catch (error) {
      console.log(error);
    }
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const fileKey = req.params.key;
    const path = req.params.path;
    const deletedFile = await deleteFile(fileKey, path);
    res.status(200).json(deletedFile);
  } catch (error) {
    console.log(error);
  }
};
