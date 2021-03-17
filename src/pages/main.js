import React, {Component} from 'react';
import {unmountComponentAtNode} from 'react-dom';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';

import './main.css';

class MainPage extends Component {

    fetchFunction = () => {
        // get all stories
        const api = `https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty`;
        fetch(api)
            .then(res => res.json())
            .then(res => {
                res.length = 100;
                res.forEach(id => {
                    const api = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
                    fetch(api)
                        .then(res => res.json())
                        .then(res => {
                            const news = document.querySelector(".news_item");
                            let item = document.createElement("div");
                            this.props.match.params.id = res.id;

                            item.innerHTML = `
                                <a style="text-decoration: none; color: black;" href='/${res.id}'>
                                    <h1>${res.title}</h1>
                                    <div className="info">
                                        ${this.convertTime(res.time)} <br/>
                                        author: ${res.by}
                                    </div>
                                </a>
                            `;
                            item.classList.add("item");

                            item.addEventListener('click', () => {
                                let data = res.id;
                                this.props.get_news_data(data);

                                this.props.history.push(`/${data}`);
                            })

                            news.appendChild(item);
                        })
                    
                })   
            })
    
    }

    

    convertTime = (unixTime) => {
        let data = new Date(unixTime * 1000);
        let utcString = data.toUTCString();
        let time = utcString.slice(-11, -4);

        return time;

    }

    unmountFunction = () => {
        let wrap = document.querySelector(".wrapper");
        unmountComponentAtNode(wrap);
    }

    render() {
        return (
            <div className="main">
                <div id="update" onClick={this.fetchFunction}>get first 100 stories</div>
                <div className="news_item"></div>
            </div> 
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.id
    }
};

export default withRouter(connect(mapStateToProps, actions)(MainPage));