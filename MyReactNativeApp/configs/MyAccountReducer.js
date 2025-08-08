const myUserReducer = (current, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        default:
            return current;
    }
};

export default myUserReducer;