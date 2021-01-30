state = {
    id: '',
    score: '',
    title: '',
    url: '',
    date: '',
    parent_comments: [],
    didGetData: false,
    kid_comments: [],
    didGetParent: false,
    didGetKid: false
}

componentDidUpdate() {
    this.fillupWrapper(this.state.didGetData)
}

getStoryData = () => {
    // get all stories
    const api = `https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty`;
    fetch(api)
        .then(res => res.json())
        .then(res => {
            res.length = 5;
            res.forEach(id => {
                // get all info about story
                const api = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
                fetch(api)
                    .then(res => res.json())
                    .then(res => {
                        this.setState(() => ({
                            id: res.by,
                            score: res.descendants,
                            title: res.title,
                            url: res.url,
                            date: res.time,
                            parent_comments: res.kids
                        }))
                    })
                    // render block ul and ul for parent comments
                    .then(() => {
                        this.setState(() => ({
                            didGetData: true
                        }))
                    })
                    .then(() => {
                        // get for each parent kid comments
                        this.state.parent_comments.forEach(parent => {
                            const api = `https://hacker-news.firebaseio.com/v0/item/${parent}.json?print=pretty`;
                            fetch(api)
                                .then(res => res.json())
                                .then(res => {
                                    this.setState(() => ({
                                        kid_comments: res.kids
                                    }))
                                })
                                .then(res => {
                                    this.fillupParentWrapper(res.parent)
                                })
                                .then(() => {
                                    this.setState(() => ({
                                        didGetParent: true
                                    }))
                                })
                                .catch(error => console.log(error));
                        })
                    })
                    .catch(error => console.log(error)); 
            }
};

fillupWrapper = (trigger) => {
    if(trigger) {
        const block = document.querySelector(".block");
        const list = document.querySelector(".list");
        const {id, score, title, url, date, parent_comments} = this.state;
        
        // create wrap for each story info
        let block_li = document.createElement("li");
        block_li.innerHTML = ` 
            <div className="intro">
                <div className="title">
                    <h1>${title}</h1>
                    <div id="link">${url}</div>
                </div>
                <div className="info">
                    ${this.convertTime(date)} <br/>
                    author: ${id}
                </div>
                <div className="com">
                    <div className="img"></div>
                    comments: ${score}
                </div>
            </div>
        `;
        kid.style = "list-style: none";
        kid.classList.add("newsli");
        block.appendChild(kid);

        //create wrap for each parent comment
        parent_comments.forEach(parent => {
            let list_li = document.createElement("li");
            list_li.innerHTML = `
                <ul className="wrap">
                    parent: ${parent}
                </ul>
            `;
            list.appendChild(list_li);
        })

        this.refreshState();
    }
};

fillupParentWrapper = () => {
    const list = document.querySelector(".list").children;
    list.forEach(kid => {
        const api = `https://hacker-news.firebaseio.com/v0/item/${kid.parent}.json?print=pretty`;
        fetch(api)
            .then(res => res.json())
            .then(res => {
                let list_li = document.createElement("div");
                list_li.innerHTML = `
                    parent comment: ${res.text}
                    author: ${res.by}
                    time: ${this.convertTime(res.date)}
                `;
                kid.appendChild(list_li);
            })

    })
}

refreshState = () => {
    this.setState(() => ({
        id: '',
        score: '',
        title: '',
        url: '',
        date: '',
        parent_comments: [],
        didGetData: false
    }));
};

// refreshArrays = () => {
//     this.setState(() => ({
//         didGetParent: false,
//         kid_comments: [],
//         didGetKid: false
//     }))
// }

