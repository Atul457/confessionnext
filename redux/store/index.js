import thunk from 'redux-thunk'
import createDebounce from 'redux-debounced'
import { rootReducer } from "../reducers/rootReducer"
import { createStore, applyMiddleware, compose } from 'redux'
import { isWindowPresent } from '../../utils/checkDom'

// ** init middleware
const middleware = [thunk, createDebounce()]

const ReduxDevExt = isWindowPresent() ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null

// ** Dev Tools
const composeEnhancers = ReduxDevExt || compose


// ** Create store
const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(...middleware)))

export { store }
