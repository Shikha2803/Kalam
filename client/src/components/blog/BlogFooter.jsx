import React, { useState, useEffect } from "react";
import "../../styles/BlogFooter.css";
import Comment from "../blog/Comment.jsx";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComments,
  faShare,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
// import {
//   EmailShareButton,
//   FacebookShareButton,
//   InstapaperShareButton,
//   LinkedinShareButton,
//   TelegramShareButton,
//   TwitterShareButton,
// } from "react-share";

import { BASE_URL } from "../../helper/ref.js";
import axios from "axios";

const BlogFooter = ({ id }) => {
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  // getting local data from localStorag

  let localData = JSON.parse(localStorage.getItem("userInfo"));
  let userId = localData ? localData.userId : "-1";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikes = async () => {
      let response = await axios.get(`${BASE_URL}/like/getLikes`, {
        params: {
          blogId: id,
        },
      });

      try {
        // check whether the user has already liked the blog or not when the user is loggedin (means, localData is not null)
        if (userId !== "-1") {
          setLike(response.data[0].likes.includes(userId));
        }
        setLikeCount(response.data[0].likes.length);
      } catch (e) {
        console.log(e);
      }
    };
    fetchLikes();

    //get request to fetch all the comments
    axios
      .get(`${BASE_URL}/comment/getComment`, {
        params: {
          blogId: id,
        },
      })
      .then((res) => {
        setAllComments(res.data);
        setCommentCount(res.data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  async function handleLike() {
    // changes current state
    if (userId != "-1") {
      setLike(!like);

      // database work
      let response = await axios.put(`${BASE_URL}/like/addLike`, {
        blogId: id,
        userId: userId,
        like: like,
      });

      try {
        setLikeCount(!like ? likeCount + 1 : likeCount - 1);
      } catch (e) {
        console.log(e);
      }
    } else {
      let userConfirm = window.confirm(
        "Please login/register to like the blog!"
      );
      if (userConfirm) {
        navigate("/login");
      }
    }
  }

  function handleComment() {
    setShowComment(!showComment);
  }

  return (
    <>
      <div className="footerContainer">
        <div className="likeContainer">
          <div className="likeCount">{likeCount}</div>
          <div className="likeIcon icon" onClick={handleLike}>
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={like ? "liked" : "notliked"}
            />
          </div>
        </div>
        <div className="commentSection" onClick={handleComment}>
          <div className="commentCount">{commentCount}</div>
          <div className="commentIcon icon">
            <FontAwesomeIcon icon={faCommentAlt} />
          </div>
        </div>

        <div className="shareSection">
          <div className="icon">
            <FontAwesomeIcon icon={faShare} />
          </div>
        </div>
      </div>

      {showComment && (
        <Comment
          blogId={id}
          allComments={allComments}
          setCommentCount={setCommentCount}
        />
      )}
    </>
  );
};

export default BlogFooter;
