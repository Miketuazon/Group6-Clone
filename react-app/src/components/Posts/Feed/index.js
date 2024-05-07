import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { thunkGetAllPosts } from '../../../store/post';
import PostItem from "../PostItem";
import LoadingScreen from '../../LoadingScreen';
import "./Feed.css";
import "../../LoadingScreen/Loading.css";

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.allPosts);
  const postsClassName = posts ? "posts" : "loading";

  useEffect(() => {
    //dispatch(thunkGetAllPosts());
  }, [dispatch]);

  return (
    <div className='Feed'>
      <ul className={postsClassName}>
        {posts ? (
          <>
            {Object.values(posts).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map(post =>
              (
                <li key={post.id} className="post">
                  <PostItem post={post} />
                </li>
              ))}
          </>
        ) : (
          <>
            <div className={postsClassName}>
              <LoadingScreen />
            </div>
          </>
        )}
      </ul>
    </div>
  )
}

export default Feed
