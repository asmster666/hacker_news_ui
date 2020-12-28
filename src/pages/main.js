import React, {Component} from 'react';
import News from '../component/news';
import {withRouter} from 'react-router-dom';

import './main.css';

class MainPage extends Component {

    news = News;
    
    componentDidMount() {
        this.generateNews(this.news);
    }
    
    generateNews = (props) => {
        const block = document.querySelector(".block");
        const {id, score, title, url, date} = this.props;
        for(let i = 0; i < 100; i++) {
            let kid = document.createElement("li");
            kid.innerHTML = `
                ID story: ${id}
                score: ${score}
                title: ${title}
                url: ${url}
                date (YYYY-MM-DD): ${date}
            `;
            kid.style = "list-style: none";
            block.appendChild(kid);
        }
    }

    render() {
        return (
            <ul className="block">
                <button id="update"></button>
            </ul> 
        )
    }
}

export default withRouter(MainPage);