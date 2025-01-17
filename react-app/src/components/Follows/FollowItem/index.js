import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux"
import { thunkAddFollow, thunkRemoveFollow } from '../../../store/session';

const FollowItem = ({follow}) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);
    let isFollowing = false;

    for (let i = 0; i < currentUser.following.length; i++) {
        if (currentUser.following[i].id === follow.id) {
            isFollowing = true;
        }

        if (currentUser.following[i] === follow.id) {
            isFollowing = true;
        }
    }

    const onSubmitFollow = async (e) => {
        e.preventDefault();

        dispatch(thunkAddFollow(follow));
    }

    const onSubmitUnfollow = async (e) => {
        e.preventDefault();

        dispatch(thunkRemoveFollow(follow));
    }

  return (
    <>
        <div className='follow-item'>
            <div><img src="https://assets.tumblr.com/images/default_avatar/cone_open_64.png" alt="default_image.png" />{follow.username}</div>
            <div className="username-unfollow-follow">
                {currentUser && isFollowing  ? <button className="button-unfollow" onClick={onSubmitUnfollow}>unfollow</button> : currentUser && !isFollowing? <button className="button-follow" onClick={onSubmitFollow}>Follow</button> : <></>}
            </div>
        </div>
    </>
  )
}

export default FollowItem