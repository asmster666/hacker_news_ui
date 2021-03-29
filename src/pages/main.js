import React, {Component} from 'react';
import {unmountComponentAtNode} from 'react-dom';
import {withRouter} from 'react-router-dom';

import './main.css';

class MainPage extends Component {

    rerenderFunction = () => {
        let wrapper = document.querySelector(".news_item");
        wrapper.style = "display: none;";
        if(wrapper.style.display === "none") {
            setInterval(() => {
                window.location.reload(true);
                this.fetchFunction();
                wrapper.style = "display: block;";
            }, 100);
            clearInterval();
        } 
        console.log("timeout worked");
    }

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

    render() {
        return (
            <div className="main">
                <div id="update" onClick={this.fetchFunction}>update first 100 stories</div>
                <div className="news_item"></div>
            </div> 
        )
    }
}

export default withRouter(MainPage);