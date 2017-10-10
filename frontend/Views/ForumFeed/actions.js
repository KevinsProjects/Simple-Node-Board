import _ from 'lodash';
import {
  START_FETCHING_DISCUSSIONS,
  STOP_FETCHING_DISCUSSIONS,
  FETCHING_DISCUSSIONS_SUCCESS,
  FETCHING_DISCUSSIONS_FAILURE,

  START_FETCHING_PINNED_DISCUSSIONS,
  STOP_FETCHING_PINNED_DISCUSSIONS,
  FETCHING_PINNED_DISCUSSIONS_SUCCESS,
  FETCHING_PINNED_DISCUSSIONS_FAILURE,

  UPDATE_SORTING_METHOD,
  INVALID_FORUM,
} from './constants';
import {
  fetchDiscussions,
  fetchPinnedDiscussions,
} from './api';


const findForumId = (state, forum) => {
  const { forums } = state.app;
  const forumId = _.find(forums, { forum_slug: forum });

  if (forumId) { return forumId._id; }
  else { return null; }
};


export const getDiscussions = (forumId, feedChanged=false, sortingChanged=false) => {
  return (dispatch, getState) => {
    const sortingMethod = getState().feed.sortingMethod;

    // show the loading message when user initiates a forum change
    if (feedChanged || sortingChanged) dispatch({ type: START_FETCHING_DISCUSSIONS });

    if (!forumId) {
      dispatch({ type: INVALID_FORUM });
    }
    else {
      //start fetching discussions
      fetchDiscussions(forumId, sortingMethod).then(
        data => dispatch({ type: FETCHING_DISCUSSIONS_SUCCESS, payload: data.data }),
        error => dispatch({ type: FETCHING_DISCUSSIONS_FAILURE })
      );
    }
  };
};


export const getPinnedDiscussions = (forumId, feedChanged) => {
  return (dispatch, getState) => {

    if (feedChanged) dispatch({ type: START_FETCHING_PINNED_DISCUSSIONS });;

    if (!forumId) {
      dispatch({ type: INVALID_FORUM });
    }
    else {

      return fetchPinnedDiscussions(forumId).then(
        data => dispatch({ type: FETCHING_PINNED_DISCUSSIONS_SUCCESS, payload: data.data }),
        error => { console.log(error); dispatch({ type: FETCHING_PINNED_DISCUSSIONS_FAILURE }); }
      );
    }
  };
};


export const updateSortingMethod = (method) => {
  return { type: UPDATE_SORTING_METHOD, payload: method };
};
