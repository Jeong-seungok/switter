import React from 'react';
import Auth from '../routes/Auth'
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import Home from '../routes/Home';
import Navigation from './Navigation';
import Profile from 'routes/Profile';

const ReactRouter = ({refreshUser,isLoggedIn, userObj}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj}></Navigation>}
            <Switch>
                {isLoggedIn ? 
                <>
                <Route exact path="/">
                    <Home userObj={userObj}></Home>
                </Route>
                <Route exact path="/profile">
                    <Profile userObj={userObj} refreshUser={refreshUser}></Profile>
                </Route>
                </> : 
                <>
                <Route exact path="/">
                    <Auth></Auth>
                </Route>
                </>}
            </Switch>
        </Router>
    );
}

export default ReactRouter;