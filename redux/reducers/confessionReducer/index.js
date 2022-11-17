const Confesssions = (state = [], action) => {

    // const printIndex = index => console.log(index);

    switch (action.type) {
        case 'CONFESSION':
            return action.confessionArr

        case 'OPENSHARE' : 
            let openArr = state[action.index];
            openArr = {...openArr, "shareVisible" : true};
            state[action.index] = openArr;
            return state

        case 'CLOSESHARE' : 
            let closeArr = state[action.index];
            closeArr = {...closeArr, "shareVisible" : false};
            state[action.index] = closeArr;
            return state
        default:
            return state
    }


}

export default Confesssions