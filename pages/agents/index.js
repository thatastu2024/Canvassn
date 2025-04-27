import React, { useEffect } from 'react';
import withAuth from "../../middleware/withAuth";

import AgentListComponent from '../../components/Agent'
import ChatBotIndex from '../../components/Agent/ChatBotIndex'
const AgentList = () => {
    return(
        <>
        {/* <AgentListComponent></AgentListComponent> */}
        <ChatBotIndex></ChatBotIndex>
        </>
    )
}

export default withAuth(AgentList,["superadmin","admin","employee"]);