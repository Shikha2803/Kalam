import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/BlogUser.css";
import axios from "axios";
import { BASE_URL } from "../../helper/ref";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const BlogUser = ({
  blogId,
  userName,
  blogSaveTime,
  minuteRead,
  setUserIdForFollowers,
}) => {
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  let localData = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    async function fetchUserInfo() {
      let userResult = await axios.get(`${BASE_URL}/user/userInfo`, {
        params: {
          userName: userName,
        },
      });

      try {
        if (userResult.data.length) {
          setUserId(userResult.data[0]._id);
          setFullName(userResult.data[0].fullName);
          setUserIdForFollowers(userResult.data[0]._id);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchUserInfo();
  }, [userName]);

  async function handleDelete(e) {
    e.preventDefault();
    // let sure = confirm("Are you sure want to delete");
    if (window.confirm("Are you sure want to delete") === true) {
      let response = await axios.delete(`${BASE_URL}/blog/deleteBlog`, {
        params: {
          blogId: blogId,
        },
      });
      navigate("/");
    }
  }

  function handleEdit() {
    navigate("/editblog/" + blogId);
  }

  return (
    <>
      <div className="BlogUserContainer">
        <div className="blogUserPrimaryDetailsContainer">
          {/* <div className="imageContainer">
            <NavLink to={`/profile/${userName}`}>
              <img
                src="https://cdn3.vectorstock.com/i/1000x1000/23/22/new-woman-avatar-icon-flat-vector-19152322.jpg"
                alt="blog"
              />
            </NavLink>
          </div> */}
          <div className="userInfoContainer">
            <div className="blogPrimaryInfo">
              <NavLink to={`/profile/${userName}`}>{fullName}</NavLink>
            </div>
            <div className="blogSecondaryInfo">
              <div>{blogSaveTime}</div> ・<div>{minuteRead}</div>
            </div>
          </div>
        </div>
        {/* {localData && localData.userName !== userName && (
          <div className="followButtonContainer" onClick={handleFollow}>
            <button className={follow ? "follow" : "unfollow"}>
              {follow ? "Followed" : "Follow"}
            </button>
          </div>
        )} */}

        {localData && localData.userName === userName && (
          <div className="blogEditButtonsContainer">
            <div className="followButtonContainer" onClick={handleDelete}>
              <button className="deleteButton">
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>

            <div className="followButtonContainer" onClick={handleEdit}>
              <button className="editButton">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogUser;
