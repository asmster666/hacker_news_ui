import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import './news.css';

class News extends Component {

    state = {
        id: null,
        title: '',
        score: null, 
        url: '',
        date: '',
        parentComment: '',
        kidComment: ''
    }

    componentDidMount() {
        this.changeStory("8863");
    }

    changeStory = async (id) => {
        const api = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
        await fetch(api)
                    .then(res => res.json())
                    .then(res => {
                        if(res.type === "story"){
                            this.setState(() => ({
                                id: res.by,
                                score: res.descendants,
                                title: res.title,
                                url: res.url,
                                date: res.time
                            }))
                        }
                    })
                    .catch(error => console.log(error));
    }

    getComments = async() => {
        const api = '';
        await fetch(api)
                    .then(res => res.json())
                    .then(res => {
                        if(res.type === "") {

                        }
                    })
    }

    convertTime = (unixTime) => {
        let data = new Date(unixTime * 1000);
        let utcString = data.toUTCString();
        let time = utcString.slice(-11, -4);

        return time;

    }

    render() {

        const {id, score, title, url, date} = this.state;

        return (
            <div className="news">
                <div className="left">
                    <div className="title">
                        <h1>{title}</h1>
                        <div id="link">{url}</div>
                    </div>
                    <div className="info">
                        {this.convertTime(date)} <br/>
                        author: {id}
                    </div>
                </div>
                <div className="right">
                    <div id="com">
                        <div id="img"></div>
                        {score}
                    </div>
                    <div id="list">
                        comments
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(News);