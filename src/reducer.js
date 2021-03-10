const initialState = {
    id: ""
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'NEWS_DATA' :
            return {
                ...state,
                id: action.payload
            };
        default:
            return state;
    }
}

export default reducer;