import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import CreateTextPost from "./components/Posts/CreateTextPost";
import Navigation from "./components/Navigation";
import Feed from "./components/Posts/Feed"
import AllLikes from "./components/Likes/AllLikes";
import LikesCounter from "./components/Likes/LikesCounter";
import CurrentUserPosts from "./components/Posts/CurrentUserPosts";
import EditPost from "./components/Posts/EditPost";
import ResultsPage from "./components/ResultsPage/ResultsPage"
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/" >
            <Feed />
          </Route>
          <Route exact path="/create/text">
            <CreateTextPost />
          </Route>
          <Route exact path="/login">
            <LoginFormPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/posts/edit/:postId">
            <EditPost />
          </Route>
          <Route exact path="/likes">
            <AllLikes />
          </Route>
          <Route exact path="/posts/current">
            <CurrentUserPosts />
          </Route>
          <Route exact path="/likesCounter">
            <LikesCounter />
          </Route>
          <Route exact path="/feed">
            <Feed />
          </Route>
          <Route exact path="/search/:query">
            <ResultsPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
