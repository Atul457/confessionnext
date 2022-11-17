let initialSate = {accepted : false};

const todos = (state = [initialSate], action) => {
    switch (action.type) {
        case 'TERMS':
            return action.terms
            
        default:
            return state
    }
}

export default todos