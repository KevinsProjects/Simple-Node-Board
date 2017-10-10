const _ = require('lodash');
const asyncEach = require('async/each');

// controller
const getAllOpinions = require('../opinion/controller').getAllOpinions;

// model
const User = require('./model');
const Discussion = require('../discussion/model');
const Opinion = require('../opinion/model');


const getUser = (user_id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: user_id }, (error, user) => {
      if (error) { console.log(error); reject(error); }
      else if (!user) reject(null);
      else resolve(user);
    });
  });
};

//sign in/up user via github provided info /will create a new user using git profile info provided by github user doc

const signInViaGithub = (gitProfile) => {
  return new Promise((resolve, reject) => {

    // find if user exist on database
    User.findOne({ username: gitProfile.username }, (error, user) => {
      if (error) { console.log(error); reject(error); }
      else {

        const email = _.find(gitProfile.emails, { verified: true }).value;


        if (user) {

          user.name = gitProfile.displayName;
          user.username = gitProfile.username;
          user.avatarUrl = gitProfile._json.avatar_url;
          user.email = email;
          user.github.id = gitProfile._json.id,
          user.github.url = gitProfile._json.html_url,
          user.github.company = gitProfile._json.company,
          user.github.location = gitProfile._json.location,
          user.github.hireable = gitProfile._json.hireable,
          user.github.bio = gitProfile._json.bio,
          user.github.followers = gitProfile._json.followers,
          user.github.following = gitProfile._json.following,


          user.save((error) => {
            if (error) { console.log(error); reject(error); }
            else { resolve(user); }
          });
        }


        else {

          User.count({}, (err, count) => {
            console.log('usercount: ' + count);

            let assignAdmin = false;
            if (count === 0) assignAdmin = true;


            const newUser = new User({
              name: gitProfile.displayName,
              username: gitProfile.username,
              avatarUrl: gitProfile._json.avatar_url,
              email: email,
              role: assignAdmin ? 'admin' : 'user',
              github: {
                id: gitProfile._json.id,
                url: gitProfile._json.html_url,
                company: gitProfile._json.company,
                location: gitProfile._json.location,
                hireable: gitProfile._json.hireable,
                bio: gitProfile._json.bio,
                followers: gitProfile._json.followers,
                following: gitProfile._json.following,
              },
            });

            // save user and update user doc
            newUser.save((error) => {
              if (error) { console.log(error); reject(error); }
              else { resolve(newUser); }
            });

          });
        }
      }
    });

  });
};


const getFullProfile = (username) => {
  return new Promise((resolve, reject) => {
    User
    .findOne({ username })
    .lean()
    .exec((error, result) => {
      if (error) { console.log(error); reject(error); }
      else if (!result) reject('not_found');
      else {

        Discussion
        .find({ user_id: result._id })
        .populate('forum')
        .lean()
        .exec((error, discussions) => {
          if (error) { console.log(error); reject(error); }
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
              if (error) { console.log(error); reject(error); }
              else {
                result.discussions = discussions;
                resolve(result);
              }
            });
          }
        });
      }
    });
  });
};

module.exports = {
  signInViaGithub,
  getUser,
  getFullProfile,
};
