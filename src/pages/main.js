import React, {Component} from 'react';
import News from '../component/news';
import {withRouter} from 'react-router-dom';

import './main.css';

class MainPage extends Component {

    state = {
        id: '',
        score: '',
        title: '',
        url: '',
        date: '',
        didGet: false
    }
    
    componentDidUpdate() {
        this.generateNews(this.state.didGet);
    }
    
    generateNews = (trigger) => {
        if(trigger) {
            const block = document.querySelector(".block");
            const {id, score, title, url, date} = this.state;

            let kid = document.createElement("li");
            kid.innerHTML = ` 
                <div className="left">
                    <div className="title">
                        <h1>${title}</h1>
                        <div id="link">${url}</div>
                    </div>
                    <div className="info">
                        ${this.convertTime(date)} <br/>
                        author: ${id}
                    </div>
                </div>
                <div className="right">
                    <div className="com">
                        <div className="img"></div>
                        ${score}
                    </div>
                    <div id="list">
                        comments
                    </div>
                </div>
            `;
            kid.style = "list-style: none";
            kid.classList.add("news");
            block.appendChild(kid);

            this.refreshState();
        }
    }

    refreshState = () => {
        this.setState(() => ({
            id: '',
            score: '',
            title: '',
            url: '',
            date: '',
            didGet: false
        }));
    }

    getAllStoryURL = () => {
        const api = `https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty`;
        fetch(api)
                .then(res => res.json())
                .then(res => {
                    console.log("get all stories");
                    res.length = 100;
                    res.forEach(id => {
                        const api = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
                        fetch(api)
                            .then(res => res.json())
                            .then(res => {
                                    console.log(`get story  ${id}`);
                                    this.setState(() => ({
                                        id: res.by,
                                        score: res.descendants,
                                        title: res.title,
                                        url: res.url,
                                        date: res.time
                                    }))
                            })
                            .then(() => {
                                this.setState(() => ({
                                    didGet: true
                                }))
                            })
                            .catch(error => console.log(error));
                        });
                    })
                .catch(error => console.log(error)); 
    }

    convertTime = (unixTime) => {
        let data = new Date(unixTime * 1000);
        let utcString = data.toUTCString();
        let time = utcString.slice(-11, -4);

        return time;

    }

    render() {
        return (
            <ul className="block">
                <div id="update" onClick={this.getAllStoryURL}>get first 100 stories</div>
            </ul> 
        )
    }
}

export default withRouter(MainPage);