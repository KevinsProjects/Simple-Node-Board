import { browserHistory } from 'react-router';
import {
  POSTING_DISCUSSION_START,
  POSTING_DISCUSSION_END,
  POSTING_DISCUSSION_SUCCESS,
  POSTING_DISCUSSION_FAILURE,

  UPDATE_DISCUSSION_TITLE,
  UPDATE_DISCUSSION_CONTENT,
  UPDATE_DISCUSSION_PIN_STATUS,
  UPDATE_DISCUSSION_TAGS,

  CLEAR_SUCCESS_MESSAGE,
} from './constants';
import { postDiscussionApi } from './api';


export const postDiscussion = (userId, forumId, currentForum) => {
  return (dispatch, getState) => {
    dispatch({ type: POSTING_DISCUSSION_START });


    // discussion values in redux
    const {
      title,
      content,
      tags,
      pinned,
    } = getState().newDiscussion;

    let validated = true;

    if (!userId || !forumId) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Something is wrong with user/forum.',
      });
    }

    if (title === null || title.length < 15) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Title should be at least 15 characters.',
      });
    }

    if (content === null || content.length === 0) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Please write some content before posting.',
      });
    }

    if (tags === null || tags.length === 0) {
      validated = false;
      return dispatch({
        type: POSTING_DISCUSSION_FAILURE,
        payload: 'Please provide some tags.',
      });
    }


    if (validated) {
      postDiscussionApi({
        userId,
        forumId,
        title,
        content,
        tags,
        pinned,
      }).then(
        (data) => {
          if (data.data.postCreated === true) {
            dispatch({ type: POSTING_DISCUSSION_SUCCESS });
            setTimeout(() => { dispatch({ type: CLEAR_SUCCESS_MESSAGE }); }, 2000);


            browserHistory.push(`/${currentForum}/discussion/${data.data.discussion_slug}`);
          } else {
            dispatch({
              type: POSTING_DISCUSSION_FAILURE,
              payload: 'Something is wrong at our server end. Please try again later',
            });
          }
        },
        (error) => {
          dispatch({
            type: POSTING_DISCUSSION_FAILURE,
            payload: error,
          });
        }
      );
    }
  };
};


export const updateDiscussionTitle = (value) => {
  return {
    type: UPDATE_DISCUSSION_TITLE,
    payload: value,
  };
};


export const updateDiscussionContent = (value) => {
  return {
    type: UPDATE_DISCUSSION_CONTENT,
    payload: value,
  };
};


export const updateDiscussionPinStatus = (value) => {
  return {
    type: UPDATE_DISCUSSION_PIN_STATUS,
    payload: value,
  };
};


export const updateDiscussionTags = (value) => {
  return {
    type: UPDATE_DISCUSSION_TAGS,
    payload: value,
  };
};
