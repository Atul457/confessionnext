// import axios from "axios"

// export const getChatChit = (data) => {
//     const config = {
//         method: 'post',
//         url: `https://cloudart.com.au:3235/api/getchat`,
//         headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json'
//         },
//         data
//     }
//     return async dispatch => {
//         await axios(config)
//             .then(function (response) {
//                 dispatch({
//                     type: 'GET_DATA',
//                     allData: response.data,
//                     data: response.data,
//                     totalPages: response.data.count
//                 })
//             })
//             .catch(function (error) {
//                 console.log(error)
//             })
//     }
// }
// import axios from "axios"

export const getChatChit = (data) => {

    return dispatch => {
                dispatch({
                    type: 'update',
                    data: data
                })
            }
    }
