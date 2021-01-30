import React, {Component} from 'react';
import News from '../component/news';
import {withRouter} from 'react-router-dom';

import './main.css';

class MainPage extends Component {

    state = {
        wrapper: '',
        first_array_comments: [],
        second_array_comments: [],
        parent: ''
    }

    fetchFunction = () => {
        // get all stories
        const api = `https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty`;
        fetch(api)
            .then(res => res.json())
            .then(res => {
                res.length = 5;
                res.forEach(id => {
                    const api = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
                    fetch(api)
                        .then(res => res.json())
                        .then(res => {
                            // create li for each story and fill it up (function 1)
                            const block = document.querySelector(".block");
                            let block_li = document.createElement("li");
                            block_li.innerHTML = `
                                <div className="intro">
                                    <div className="title">
                                        <h1>${res.title}</h1>
                                        <div id="link">${res.url}</div>
                                    </div>
                                    <div className="info">
                                        ${this.convertTime(res.time)} <br/>
                                        author: ${res.by}
                                    </div>
                                    <div className="com">
                                        <div className="img"></div>
                                        comments: ${res.descendants}
                                    </div>
                                </div>
                            `;
                            block_li.style = "list-style: none;";
                            block_li.classList.add("newsli");
                            block_li.setAttribute('id', `${res.id}`);
                            block.appendChild(block_li);

                            const parent_comment_list = document.querySelector(".list");
                            let wrap = document.createElement("ul");
                            wrap.classList.add("wrap");
                            wrap.setAttribute('id', `${res.id}`);
                            parent_comment_list.appendChild(wrap);
                            for(let wrapper of parent_comment_list.children) {
                                this.setState(() => ({
                                    wrapper: wrapper
                                }))
                            }
                            console.log(this.state.wrapper);
    
                            this.setState(() => ({
                                first_array_comments: res.kids
                            }))
    
                            // create li for each comment and fill up id (function 2)
                            
                                let story_parent = this.state.wrapper;
                                const first_array = this.state.first_array_comments;
                                first_array.forEach(parent_id => {
                                    const api = `https://hacker-news.firebaseio.com/v0/item/${parent_id}.json?print=pretty`;
                                    fetch(api)
                                        .then(res => res.json())
                                        .then(res => {
                                                let pcl_li = document.createElement("li");
                                                pcl_li.innerHTML = `
                                                    <ul className="wrap_parent">
                                                        parent_text: <p>${res.text}</p>
                                                        parent_author: <p>${res.by}</p>
                                                        parent_time: <p>${this.convertTime(res.time)}</p>
                                                        <button>show more about that branch of comments</button>
                                                    </ul>
                                                `;
                                                pcl_li.style = "list-style: none;";
                                                pcl_li.setAttribute('id', `${res.id}`)
                                                story_parent.appendChild(pcl_li);
            
                                                this.setState(() => ({
                                                    second_array_comments: res.kids,
                                                    parent: res.id
                                                }))
            
                                                // create kid wrap and fill it up (function 3)
                                                const parent = pcl_li.lastElementChild;
                                                const second_array = this.state.second_array_comments;
                                                if(second_array){
                                                    second_array.forEach(kid_id => {
                                                        const api = `https://hacker-news.firebaseio.com/v0/item/${kid_id}.json?print=pretty`;
                                                        fetch(api)
                                                            .then(res => res.json())
                                                            .then(res => {
                                                                let kid_li = document.createElement("li");
                                                                kid_li.innerHTML = `
                                                                    kid_text: <p>${res.text}</p>
                                                                    kid_author: <p>${res.by}</p>
                                                                    kid_time: <p>${this.convertTime(res.time)}</p>
                                                                `;
                                                                kid_li.classList.add("comment");
                                                                parent.appendChild(kid_li);
                                                                
                                                            })
                                                    })
                                                }
                                            
                                        })
        
                                    this.refreshKids();
                                })
                            
                                
                            
    
                            this.refreshState();
                        })
                    
                })   
            })
    
    }

    refreshState = () => {
        this.setState(() => ({
            first_array_comments: [],
            second_array_comments: [],
            parent: ''
        }))
    }
    
    refreshKids = () => {
        this.setState(() => ({
            second_array_comments: [],
            parent: ''
        }))
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
                <div id="update" onClick={this.fetchFunction}>get first 100 stories</div>
                <div className="wrapper">
                    <ul className="block"></ul>
                    <ul className="list"></ul>
                </div>
            </div> 
        )
    }
}

export default withRouter(MainPage);