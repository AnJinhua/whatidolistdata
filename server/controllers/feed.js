const Following = require("../models/following");
const User = require("../models/user");
const Media = require("../models/media");
const Conversation = require("../models/conversation");
const Experts = require("../models/experts");

exports.getForYou = async (req, res) => {
  try {
    const userSlug = req.params.id;
    const userCommunity = (await User.findOne({ slug: userSlug }))
      .expertCategories[0];
    const following = await Following.findOne({ userSlug: userSlug });
    const members = await Conversation.find({ members: { $in: userSlug } });
    const peer = [];
    for (let i = 0; i < members.length; i++) {
      for (let j = 0; j < members[i].members.length; j++) {
        if (members[i].members[j] !== userSlug) {
          peer.push(members[i].members[j]);
        }
      }
    }
    const community = (
      await Experts.findOne({ "subcategory.slug": userCommunity })
    ).slug;
    const followingList = following?.followings;
    const followingCommunity = [];
    const followingPeer = [];
    if (followingList) {
      await followingList.filter((a) => {
        if (a.Type === "community") {
          return followingCommunity.push(a.community);
        } else {
          return followingPeer.push(a.userSlug);
        }
      });
    }
    const media = await Media.find({
      $and: [
        { mediaType: { $ne: "youtube" } },
        {
          $or: [
            { community: { $in: community } },
            { community: community },
            { userSlug: { $in: followingPeer } },
            { userSlug: { $in: peer } },
          ],
        },
      ],
    }).sort({ updatedAt: -1 })
      .skip(req.query.page * 12)
      .limit(12);
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getInspiring = async (req, res) => {
  // try {
  const media = await Media.aggregate([
    { $match: { mediaType: { $ne: "youtube" } } },

    {
      $addFields: { inspired_count: { $size: { $ifNull: ["$inspired", []] } } },
    },
    {
      $sort: { inspired_count: -1, updatedAt: -1 },
    },
  ])
    .skip(req.query.page * 12)
    .limit(12);
  console.log(media);
  res.status(200).json(media);
  // } catch (err) {
  //     res.status(500).json(err);
  // }
};

exports.getNoneUserForYou = async (req, res) => {
  try {
    const media = await Media.aggregate([
      { $match: { mediaType: { $ne: "youtube" } } },
      {
        $addFields: {
          inspired_count: { $size: { $ifNull: ["$inspired", []] } },
        },
      },
      {
        $sort: { updatedAt: -1, inspired_count: -1 },
      },
    ])
      .skip(req.query.page * 12)
      .limit(12);
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getCommunity = async (req, res) => {
  try {
    const community = req.params.community;
    const media = await Media.find({
      $and: [
        { mediaType: { $ne: "youtube" } },
        {
          community: community,
        },
      ],
    }).sort({ updatedAt: -1 })
      .skip(req.query.page * 12)
      .limit(12);
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getTenPeers = async (req, res) => {
  try {
    const userSlug = req.params.id;
    const members = await Conversation.find({ members: { $in: userSlug } })
      .sort({ updatedAt: -1 })
      .limit(10);
    const peer = [];
    for (let i = 0; i < members.length; i++) {
      for (let j = 0; j < members[i].members.length; j++) {
        if (members[i].members[j] !== userSlug) {
          peer.push(members[i].members[j]);
        }
      }
    }
    res.status(200).json(peer);
  } catch (err) {
    res.status(500).json(err);
  }
};
