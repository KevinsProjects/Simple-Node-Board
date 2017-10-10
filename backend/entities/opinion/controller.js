
const Opinion = require('./model');


const getAllOpinions = (discussion_id) => {
  return new Promise((resolve, reject) => {
    Opinion
    .find({ discussion_id })
    .populate('user')
    .sort({ date: -1 })
    .exec((error, opinions) => {
      if (error) { console.log(error); reject(error); }
      else if (!opinions) reject(null);
      else resolve(opinions);
    });
  });
};


const createOpinion = ({ forum_id, discussion_id, user_id, content }) => {
  return new Promise((resolve, reject) => {
    const newOpinion = new Opinion({
      forum_id,
      discussion_id,
      discussion: discussion_id,
      user_id,
      user: user_id,
      content,
      date: new Date(),
    });

    newOpinion.save((error) => {
      if (error) { console.log(error); reject(error); }
      else { resolve(newOpinion); }
    });
  });
};

const updateOpinion = (opinion_id) => {

};


const deleteOpinion = (opinion_id) => {
  return new Promise((resolve, reject) => {
    Opinion
    .remove({ _id: opinion_id })
    .exec((error) => {
      if (error) { console.log(error); reject(error); }
      else resolve('deleted');
    });
  });
};

module.exports = {
  getAllOpinions,
  createOpinion,
  updateOpinion,
  deleteOpinion,
};
