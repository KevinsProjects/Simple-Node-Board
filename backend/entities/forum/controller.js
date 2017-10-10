const asyncEach = require('async/each');


const Forum = require('./model');
const Discussion = require('../discussion/model');


const getAllOpinions = require('../opinion/controller').getAllOpinions;
const getUser = require('../user/controller').getUser;


const getAllForums = () => {
  return new Promise((resolve, reject) => {
    Forum
    .find({})
    .exec((error, results) => {
      if (error) { console.log(error); reject(error); }
      else if (!results) reject(null);
      else resolve(results);
    });
  });
};


const getDiscussions = (forum_id, pinned, sorting_method='date') => {
  return new Promise((resolve, reject) => {

    const sortWith = { };
    if (sorting_method === 'date') sortWith.date = -1;
    if (sorting_method === 'popularity') sortWith.favorites = -1;


    Discussion
    .find({ forum_id: forum_id, pinned: pinned })
    .sort(sortWith)
    .populate('forum')
    .populate('user')
    .lean()
    .exec((error, discussions) => {
      if (error) { console.error(error); reject(error); }
      else if (!discussions) reject(null);
      else {

        asyncEach(discussions, (eachDiscussion, callback) => {

          getAllOpinions(eachDiscussion._id).then(
            (opinions) => {

              eachDiscussion.opinion_count = opinions ? opinions.length : 0;
              callback();
            },
            (error) => { console.error(error); callback(error); }
          );
        }, (error) => {
          if (error) { console.error(error); reject(error); }
          else resolve(discussions);
        });
      }
    });
  });
};

module.exports = {
  getAllForums,
  getDiscussions,
};
