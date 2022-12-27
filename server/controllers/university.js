const University = require("../models/university");

//check if university.name exists else create new
exports.createUniversity = async (req, res) => {
  try {
    const university = await University.findOne({ name: req.body.name });
    if (university) {
      res.status(201).json(university);
    } else {
      const newUniversity = await University.create(req.body);
      res.status(200).json(newUniversity);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//get universities by search term
exports.getUniversitiesBySearchTerm = async (req, res) => {
  try {
    const universities = await University.find({
      name: {
        $regex: req.params.searchTerm,
        $options: "i",
      },
    });
    res.status(200).json(universities);
  } catch (err) {
    res.status(500).json(err);
  }
};
