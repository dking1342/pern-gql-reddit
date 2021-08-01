import { gql } from "graphql-tag";
import { REGISTER_USER } from "./constants";

export const gqlMutations = (action:string) => {
    switch (action) {
        case REGISTER_USER:
            return gql`
                mutation Register($username:String!,$password:String!){
                    register(options:{username:$username,password:$password}){
                        errors{
                            field
                            message
                        }
                        user {
                            id
                            username
                            token
                        }
                    }
                }
            `;
    
        default:
            return;
    }
}