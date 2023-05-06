import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getAllPosts } from '../../../store/post'
import PostItem from "../PostItem"
import "./Feed.css"
import { NavLink } from "react-router-dom"

const Feed = () => {
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts)
    useEffect(() => {
        dispatch(getAllPosts())
    }, [])

    console.log(posts)

    return (
        <div className='Feed'>
            <div className="post-option">
                <NavLink exact to="/"> Aa</NavLink>
                <NavLink exact to="/"><i class="fa fa-camera"></i></NavLink>
                <NavLink exact to="/"><i class="fa fa-quote-left"></i></NavLink>
                <NavLink exact to="/"><i class="fa fa-chain"></i></NavLink>
                <NavLink exact to="/"><i class='fas fa-comment-dots'></i></NavLink>
                <NavLink exact to="/"><i class="fa fa-headphones"></i></NavLink>
                <NavLink exact to="/"><i class="fa fa-video-camera"></i></NavLink>
                <span></span>
            </div>
            <ul className='posts'>
                {Object.values(posts).map(post => (
                    <li key={post.id} className="post">
                        <PostItem post={post} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Feed
