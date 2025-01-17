import "./PostItem.css"
import OpenModalButton from "../../OpenModalButton"
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux"
import EditPost from "../EditPost"
import DeletePost from "../DeletePost"
import CreateComment from "../../comments/CreateComment"
import EditComment from "../../comments/EditComment";
import DeleteComment from "../../comments/DeleteComment"
import { thunkAddFollow, thunkRemoveFollow } from "../../../store/session";
import { useDispatch } from "react-redux"
import { thunkAddLike, thunkRemoveLike } from "../../../store/post";

const PostItem = ({ post }) => {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state?.session?.user)
    const following = currentUser?.following.find(id => id === post.userId)
    const liked = post.likes.find(id => id === currentUser?.id)
    const notes = (post?.comments?.length + post?.likes?.length)


    // creating date
    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }

    const date = new Date(post?.createdAt)
    const month = months[date?.getMonth()];
    const day = date?.getDate();
    const year = date?.getFullYear();
    const hoursMin = date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', });

    const onSubmitFollow = async (e) => {
        e.preventDefault();

        dispatch(thunkAddFollow(post.owner));
    }

    const onSubmitUnfollow = async (e) => {
        e.preventDefault();

        dispatch(thunkRemoveFollow(post.owner));
    }

    const onSubmitLike = async (e) => {
        e.preventDefault();

        dispatch(thunkAddLike(post.id, currentUser.id));
    }

    const onSubmitUnlike = async (e) => {
        e.preventDefault();

        dispatch(thunkRemoveLike(post.id, currentUser.id));
    }
    const openMenu = () => {
        setShowMenu(!showMenu);
    };

    const ulClassNameUpdateDelete = "list-for-update-delete" + (showMenu ? "" : " hidden");

    return (
        <div>
            <div className="post-header">
                <div><img src="https://assets.tumblr.com/images/default_avatar/cone_open_64.png" alt="default_image.png" />{post?.owner?.username}</div>
                <div className="username-unfollow-follow">
                    {currentUser &&  following && (currentUser?.id !== post?.userId) ? <button className="button-unfollow" onClick={onSubmitUnfollow}>unfollow</button> : currentUser && !following && (currentUser?.id !== post?.userId) ? <button className="button-follow" onClick={onSubmitFollow}>Follow</button> : <></>}
                </div>
            </div>
            <h6 className="timestamp">{month}, {day}, {year} | {hoursMin}</h6>
            <h4 className="post-item-postTitle">{post?.title}</h4>
            <p className="post-content">
                {post?.content}
            </p>
            <div className="post-footer">
                <button onClick={openMenu} className="like-button">{notes === 1 ? <div><span>{notes} </span><span>note</span></div> : <div><span>{notes} </span><span>notes</span></div>}</button>
                {currentUser && !liked && (currentUser?.id !== post?.userId) ? <button className="like-button" onClick={onSubmitLike}><i className="far fa-heart"></i></button> : currentUser && liked && (currentUser?.id !== post?.userId) ? <button className="unlike-button" onClick={onSubmitUnlike}><i className="fas fa-heart" ></i></button> : <></>}

                {currentUser?.id === post?.userId ? (
                    <div className="comments-trash-and-update-button">
                        <OpenModalButton
                            buttonText={<><i className="fas fa-trash-alt"></i></>}
                            modalComponent={<DeletePost postId={post?.id} />}
                        />

                        <OpenModalButton
                            buttonText={<><i className="fa fa-pencil"></i></>}
                            modalComponent={<EditPost post={post} />}
                        />
                    </div>
                ) : (
                    <></>
                )}

                <span></span><span><button type='click' onClick={openMenu}>{<><i className="fas fa-comment-dots"></i></>}</button></span>

            </div>
            <div className="dropdown m-10">
                <ul className={ulClassNameUpdateDelete} ref={ulRef}>
                    {currentUser ?
                        <CreateComment postId={post?.id} /> : <></>}
                    {post?.comments?.length ?

                        post?.comments?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))?.map((comment) => {

                            return (
                                <li key={comment.id}>
                                    <div className="list-for-update-delete">
                                        <div className="trash-comment">
                                            <div className="comment-text-bubble">
                                                <span className="comment-owner">{comment.owner}</span>
                                                <div className="the-comments-commented">

                                                    <span>{comment?.content}</span>
                                                </div>
                                            </div>
                                            <span className="delete-comment-icon" style={{"marginRight": "5px"}}>{currentUser?.id === comment?.userId ? <DeleteComment commentId={comment.id}><i className="fas fa-trash-alt"></i></DeleteComment> : <></>}</span>
                                            <span>{currentUser?.id === comment?.userId ? <OpenModalButton
                                                buttonText={<><i className="fas fa-pen-square edit-comment"></i></>}
                                                modalComponent={<EditComment comment={comment} />}
                                            /> : <></>}</span>
                                        </div>
                                    </div>
                                </li>
                            )
                        }) : null
                    }
                </ul>
            </div>
        </div >
    )
}

export default PostItem
