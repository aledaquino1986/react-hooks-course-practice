import React from "react";
import queryString from "query-string";
import { fetchItem, fetchPosts, fetchComments } from "../utils/api";
import Loading from "./Loading";
import PostMetaInfo from "./PostMetaInfo";
import Title from "./Title";
import Comment from "./Comment";

const reducer = (state, action) => {
  switch (action.type) {
    case "SUCCESS_POST":
      return {
        ...state,
        post: action.post,
        loadingPost: action.loadingPost
      };
    case "SUCCESS_COMMENTS":
      return {
        ...state,
        comments: action.comments,
        loadingComments: action.loadingComments
      };
    case "Error":
      return {
        ...state,
        error: action.message,
        loadingComments: action.loadingComments,
        loadingPost: action.loadingPost
      };
  }
};

const Post = ({ location }) => {
  const initialState = {
    post: null,
    loadingPost: true,
    comments: null,
    loadingComments: true,
    error: null
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { post, loadingPost, comments, loadingComments, error } = state;

  React.useEffect(() => {
    const { id } = queryString.parse(location.search);

    fetchItem(id)
      .then(post => {
        dispatch({ type: "SUCCESS_POST", loadingPost: false, post });

        return fetchComments(post.kids || []);
      })
      .then(comments => {
        dispatch({
          type: "SUCCESS_COMMENTS",
          comments,
          loadingComments: false
        });
      })
      .catch(({ message }) => {
        dispatch({
          type: "ERROR",
          error: message,
          loadingComments: false,
          loadingPost: false
        });
      });
  }, [post, loadingPost, comments, loadingComments, error]);

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return (
    <React.Fragment>
      {loadingPost === true ? (
        <Loading text="Fetching post" />
      ) : (
        <React.Fragment>
          <h1 className="header">
            <Title url={post.url} title={post.title} id={post.id} />
          </h1>
          <PostMetaInfo
            by={post.by}
            time={post.time}
            id={post.id}
            descendants={post.descendants}
          />
          <p dangerouslySetInnerHTML={{ __html: post.text }} />
        </React.Fragment>
      )}
      {loadingComments === true ? (
        loadingPost === false && <Loading text="Fetching comments" />
      ) : (
        <React.Fragment>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Post;
