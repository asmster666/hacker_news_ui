import React, {Component} from 'react';
import MainPage from '../pages';
import News from '../component';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" component={MainPage}></Route>
                <Route path="/:id" render={(props) => (<News id={props.match.params.id} />)}></Route>
            </Router>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.id
    }
};

export default connect(mapStateToProps, null)(App);
