import React, {Component} from 'react';
import News from '../component/news';
import {withRouter} from 'react-router-dom';

import './main.css';

class MainPage extends Component {

    state = {
        id: '',
        score: 0,
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
                id: ${id} <br/>
                score: ${score} <br/>
                title: ${title} <br/>
                url: ${url} <br/>
                date: ${this.convertTime(date)}  
            `;
            kid.style = "list-style: none";
            block.appendChild(kid);
        }
    }

    getAllStoryURL = () => {
        const api = `https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty`;
        fetch(api)
                    .then(res => res.json())
                    .then(res => {
                        res.length = 100;
                        console.log(res.length);
                        res.forEach(id => {
                            const api = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
                            fetch(api)
                                .then(res => res.json())
                                .then(res => {
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
                <button id="update" onClick={this.getAllStoryURL}></button>
            </ul> 
        )
    }
}

export default withRouter(MainPage);