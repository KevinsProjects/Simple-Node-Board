
const getAdminDashInfo = require('./controller').getAdminDashInfo;
const createForum = require('./controller').createForum;
const deleteForum = require('./controller').deleteForum;
const deleteUser = require('./controller').deleteUser;
const deleteDiscussion = require('./controller').deleteDiscussion;


const adminAPI = (app) => {

  app.get('/api/admin/admin_dashboard_info', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      getAdminDashInfo().then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'Sorry not admin.' });
  });


  app.post('/api/admin/create_forum', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      const {
        title,
        slug,
      } = req.body;

      createForum({ forum_name: title, forum_slug: slug }).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'Sorry not admin.' });
  });

  // delete a forum
  app.post('/api/admin/delete_forum', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteForum(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'Sorry not admin.' });
  });

  // delete an user
  app.post('/api/admin/delete_user', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteUser(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'Sorry not admin.' });
  });

  // delete a forum
  app.post('/api/admin/delete_user', (req, res) => {
    if (req.user && req.user.role === 'admin') {
      deleteDiscussion(req.body).then(
        (data) => { res.send(data); },
        (error) => { res.send(error); }
      );
    }
    else res.send({ error: 'Sorry not admin.' });
  });
};

module.exports = adminAPI;
