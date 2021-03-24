import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import './news.css';

class News extends Component {

    state = {
        wrapper: '',
        first_array_comments: [],
        second_array_comments: [],
        parent: '',
        click_trigger: false
    }

    componentDidMount() {
        this.changeStory();
    }

    changeStory = () => {
        const {id} = this.props.match.params;
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
                                                        <button class="btn">show more</button>
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

                                                this.triggerClickFunction(parent, second_array);
                                            
                                        })
         
                                    this.refreshKids();
                                })
    
                            this.refreshState();
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

    triggerClickFunction = (element, array) => {
        if(array) {
            let lastKid = element.lastElementChild; //button show more
            lastKid.addEventListener('click', () => {
                console.log("trigger turn on");
                this.setState(() => ({
                    click_trigger: true
                }))

                if(this.state.click_trigger){
                    console.log("show kids");
                    this.getKidsData(array, element);
                }
            })
        } 
    }

    getKidsData = (array, parent) => {
        if(array){ 
            array.forEach(kid_id => {
                const api = `https://hacker-news.firebaseio.com/v0/item/${kid_id}.json?print=pretty`;
                fetch(api)
                    .then(res => res.json())
                    .then(res => {
                        let kid_li = document.createElement("li");
                        kid_li.innerHTML = `
                            <div id="kid_txt">${this.cutLongComments(res.text)}</div>
                            <div class="author_date_wrap" id="kid_wrap">
                                <p>${res.by}</p>
                                <p>${this.convertTime(res.time)}</p>
                            </div>
                        `;
                        //kid_li.style.display = "none";
                        kid_li.classList.add("comment");
                        kid_li.addEventListener('click', () => {
                            document.getElementById("kid_txt").innerHTML = `${res.text}`;
                        })
                        parent.appendChild(kid_li);    
                    })
            })
        }

        this.refreshTrigger();
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

    refreshTrigger = () => {
        this.setState(() => ({
            click_trigger: false,
            second_array_comments: []
        }))
    }

    convertTime = (unixTime) => {
        let data = new Date(unixTime * 1000);
        let utcString = data.toUTCString();
        let time = utcString.slice(-11, -4);

        return time;

    }

    cutLongComments = (text) => {
        if(text !== undefined) {
            if(text.length > 40) {
                let result = text.substring(0, 40);
                return result + '...';
            }
        }
    }

    render() {

        return (
            <div className="news">
                <div className="wrapper">
                    <ul className="block"></ul>
                    <ul className="list"></ul>
                </div>
            </div>
        )
    }
}

export default withRouter(News);