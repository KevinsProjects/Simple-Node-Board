import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import * as actions from '../actions';
import * as constants from '../constants';

// configure axios
const host = 'http://localhost:8080';
axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

// configure dummy store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);


describe('getPinnedDiscussions', () => {
  afterEach(() => {
    // clean mock instances after every test instance
    nock.cleanAll();
  });

  it('should call FETCHING_PINNED_DISCUSSIONS_SUCCESS when fetching pinned discussion has been done', () => {
    // define mock forumId
    const forumId = '1122334455';

    // intercept axios calls with mock
    nock(host)
      .get(`/api/forum/${forumId}/pinned_discussions`)
      .reply(200, {
        pinnedDiscussions: [],
      });


    const expectedActions = [
      { type: constants.START_FETCHING_PINNED_DISCUSSIONS },
      {
        type: constants.FETCHING_PINNED_DISCUSSIONS_SUCCESS,
        payload: { pinnedDiscussions: [] },
      },
    ];


    const store = mockStore({});

    // perform test
    return store.dispatch(actions.getPinnedDiscussions(forumId, true)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});


describe('updateSortingMethod', () => {
  it('should update the sorting method', () => {
    const method = 'popularity';
    const expectedAction = {
      type: constants.UPDATE_SORTING_METHOD,
      payload: method,
    };

    expect(actions.updateSortingMethod(method)).toEqual(expectedAction);
  });
});
