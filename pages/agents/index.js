import React from 'react';
import withAuth from "../../middleware/withAuth";

import AgentListComponent from '../../components/Agent'
const AgentList = () => {
    return(
        <AgentListComponent></AgentListComponent>
    )
}

export default withAuth(AgentList,["superadmin","admin","employee"]);