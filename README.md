avito test task
ui for hacker news site, api(https://github.com/HackerNews/API)
react, redux, bootstrap, react router v5, npm






 // got data === true
this.state.parent_comments.forEach(comment => {
    const api = `https://hacker-news.firebaseio.com/v0/item/${comment}.json?print=pretty`;
    fetch(api)
        .then(res => res.json())
        .then(res => {
            this.setState(() => ({
                kid_comments: res.kids,
                parent: res.parent
            }))
        })
        .then(() => {
            this.setState(() => ({
                didGetComments: true
            }))
        })
        .catch(error => console.log(error));
});

// got parent comments === true
this.state.parent.forEach(kid => {
    const api = `https://hacker-news.firebaseio.com/v0/item/${kid}.json?print=pretty`;
    fetch(api)
        .then(res => res.json())
        .then(res => {
            const list = document.querySelector(".wrap_parent");
            console.log(this.state.parent);
            if(res.parent === this.state.parent) {
                let element =document.createElement("li");
                element.innerHTML = `
                    <div class="text">${res.text}</div>    
                    <div className="info">
                        author: ${res.by}  
                        <br/>  
                        ${this.convertTime(res.time)}
                    </div>
                    ${res.parent}
                    <button>show all comment</button>
                `;
                element.style = 'list-style: none;';
                element.classList.add("comment");
                    ist.appendChild(element);

                this.refreshKids();
            } 
        })
        .catch(error => console.log(error))
});