import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';
// import { addFriendToGroup } from '../actions/groupFunctions';
// import { fetchGroupSuccess } from '../actions/userFunctions';


const initialState = {
    groupList : null,
    friendList : null,
    error : null,
    loading : false,
    groupId : null,
    groupDetails : null,
    friendDetails : null,
};


const clearUserDetails = (state,action) => {
    return updateObject(state,
        {
            groupList : null,
            friendList : null,
            error : null,
            loading : false,
            groupId : null,
            groupDetails : null,
            friendDetails : null
        }
    )
}

// const getRecommendation = (state, action) => {
//     return updateObject(state,
//         {

//         })
// }


const reducer = (state = initialState, action) => {
    switch ( action.type ){
        
        // fetching groups

        default : 
            return state
            
    }
}

export default reducer;