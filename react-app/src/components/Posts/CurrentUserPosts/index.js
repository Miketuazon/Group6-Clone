import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { thunkGetAllPosts } from '../../../store/post';
import PostItem from "../PostItem"
import LoadingScreen from '../../LoadingScreen'
import "./CurrentUserPosts.css"


const CurrentUserPosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state?.posts.currentUserPosts)
  const postsClassName = posts ? "posts" : "loading";
  const currentUser = useSelector(state => state?.session?.user)

  useEffect(() => {
    dispatch(thunkGetAllPosts());
  }, [dispatch]);

  return (
    <>
    <div className="Feed">
      {posts ? (
          <ul className={postsClassName}>
            {Object.values(posts).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map(post =>
              (
                <li key={post.id} className="post">
                  <PostItem post={post} />
                </li>
              ))}
          </ul>
      ) : (
      <>
        <div className={postsClassName}>
          <LoadingScreen />
        </div>
      </>
      )}
    </div>
    </>
  )
}

export default CurrentUserPosts
