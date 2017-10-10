
const getAllForums = require('./controller').getAllForums;
const getDiscussions = require('./controller').getDiscussions;


const forumAPI = (app) => {

  app.get('/api/forum', (req, res) => {
    getAllForums().then(
      (result) => { res.send(result); },
      (error) => { res.send(error); }
    );
  });


  app.get('/api/forum/:forum_id/discussions', (req, res) => {
    getDiscussions(req.params.forum_id, false, req.query.sorting_method).then(
      (result) => { res.send(result); },
      (error) => { res.send([]); }
    );
  });


  app.get('/api/forum/:forum_id/pinned_discussions', (req, res) => {
    getDiscussions(req.params.forum_id, true).then(
      (result) => { res.send(result); },
      (error) => { res.send([]); }
    );
  });
};

module.exports = forumAPI;
