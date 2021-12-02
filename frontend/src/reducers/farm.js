import { APPROVE_LP_FARM, STAKE_LP_TOKENS } from "../actions/types";


const initalState = {
    //pairAddress:data
    farms: {
    },
    lpApproved: {
    },
};

export default function (state = initalState, action) {
    switch (action.type) {

        case APPROVE_LP_FARM:
            return {
                ...state,
                lpApproved: {
                    ...state.lpApproved,
                    ...action.payload
                }
            };
        case STAKE_LP_TOKENS:
            return {
                ...state,
                farms: {
                    ...state.farms,
                    ...action.payload
                }
            };

        default:
            return state;
    }
}
