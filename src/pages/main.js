import React, {Component} from 'react';
import News from '../component/news';
import {withRouter} from 'react-router-dom';

import './main.css';

class MainPage extends Component {

    state = {
        wrapper: '',
        first_array_comments: [],
        second_array_comments: [],
        parent: '',
        click_trigger: false
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
                            this.createParentWrapper(parent_comment_list, `${res.id}`);
    
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
                                                        <div id="txt">${res.text}</div>
                                                        <div class="author_date_wrap">
                                                            <p id="author">${res.by}</p>
                                                            <p>${this.convertTime(res.time)}</p>
                                                        </div>
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
                                                const parent = pcl_li.lastElementChild; //wrap parent ul

                                                let second_array = this.state.second_array_comments;
                                                this.getKidsData(second_array, parent);
                                            
                                        })
                                        .then(() => {
                                            for (let parent of story_parent.children) {
                                                const parent_wrapper = parent.lastElementChild; // === parent
                                                this.triggerClickFunction(parent_wrapper);

                                                for (let kid of parent_wrapper.children) {
                                                    if(this.state.click_trigger) {
                                                        console.log("i want kids comment");
                                                        kid.style.display = "block";
                                                    }
                                                }
                                            }
                                        })
         
                                    this.refreshKids();
                                })
    
                            this.refreshState();
                        })
                    
                })   
            })
    
    }

    createParentWrapper = (list, id) => {
        let wrap = document.createElement("ul");
        wrap.classList.add("wrap");
        wrap.setAttribute('id', id);
        list.appendChild(wrap);
        for(let wrapper of list.children) {
            this.setState(() => ({
                wrapper: wrapper
            }))
        }
    }

    triggerClickFunction = (element) => {
        let lastKid = element.lastElementChild; //button show more
        lastKid.addEventListener('click', () => {
            console.log("trigger was clicked");
            this.setState(() => ({
                click_trigger: true
            }))
        })
    }

    getKidsData = (array, parent) => {
        if(array){
            console.log("got array");
            array.forEach(kid_id => {
                const api = `https://hacker-news.firebaseio.com/v0/item/${kid_id}.json?print=pretty`;
                fetch(api)
                    .then(res => res.json())
                    .then(res => {
                        let kid_li = document.createElement("li");
                        kid_li.innerHTML = `
                            <div id="kid_txt">${res.text}</div>
                            <div class="author_date_wrap" id="kid_wrap">
                                <p>${res.by}</p>
                                <p>${this.convertTime(res.time)}</p>
                            </div>
                        `;
                        kid_li.style.display = "none";
                        kid_li.classList.add("comment");
                        parent.appendChild(kid_li);    
                    })
            })
        }
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