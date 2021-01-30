
state = {
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
                        block.appendChild(block_li);

                        this.setState(() => ({
                            first_array_comments: res.kids
                        }))

                        // create li for each comment and fill up id (function 2)
                        const parent_comment_list = document.querySelector(".list");
                        const first_array = this.state.first_array_comments;
                        first_array.forEach(parent_id => {
                            const api = `https://hacker-news.firebaseio.com/v0/item/${parent_id}.json?print=pretty`;
                            fetch(api)
                                .then(res => res.json())
                                .then(res => {
                                    let pcl_li = document.createElement("li");
                                    pcl_li.innerHTML = `
                                        <ul>
                                            parent_text: <p>${res.text}</p>
                                            parent_author: <p>${res.by}</p>
                                            parent_time: <p>${this.convertTime(res.time)}</p>
                                            <button>show more about that branch of comments</button>
                                        </ul>
                                    `;
                                    pcl_li.classList.add("wrap_parent");
                                    pcl_li.setAttribute('id', `${res.id}`)
                                    parent_comment_list.appendChild(pcl_li);

                                    this.setState(() => ({
                                        second_array_comments: res.kids,
                                        parent: res.id
                                    }))

                                    // create kid wrap and fill it up (function 3)
                                    const second_array = this.state.second_array_comments;
                                    second_array.forEach(kid_id => {
                                        const api = `https://hacker-news.firebaseio.com/v0/item/${kid_id}.json?print=pretty`;
                                        fetch(api)
                                            .then(res => res.json())
                                            .then(res => {
                                                const parent = parent_comment_list.querySelector(`#${this.state.parent}`);
                                                if(res.parent === this.state.parent) {
                                                    let kid_li = document.createElement("li");
                                                    kid_li.innerHTML = `
                                                        kid_text: <p>${res.text}</p>
                                                        kid_author: <p>${res.by}</p>
                                                        kid_time: <p>${this.convertTime(res.time)}</p>
                                                    `;
                                                    kid_li.classList.add("comment");
                                                    parent.appendChild(kid_li);
                                                }
                                                
                                            })
                                    })
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