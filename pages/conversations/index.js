import React from 'react';
import withAuth from "../../middleware/withAuth";

// import ConversationListComponent from '../../components/Conversations'
import ConversationListComponent from '../../components/Conversations/List'
const ConversationList = () =>{
    return(
        <ConversationListComponent></ConversationListComponent>
    )
}

export default withAuth(ConversationList,["superadmin","admin","employee"]);