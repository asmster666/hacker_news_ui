import React, {Component} from 'react';
import MainPage from '../pages';
import News from '../component';
import {BrowserRouter as Router, Route} from 'react-router-dom';
export default class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" component={MainPage}></Route>
                <Route path="/page" component={News}></Route>
            </Router>
        )
    }
}