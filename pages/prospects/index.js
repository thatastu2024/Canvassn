import React from 'react';
import withAuth from "../../middleware/withAuth";

import ProspectList from '../../components/Prospect/List'
const ProspectPageComponent = () =>{
    return(
        <ProspectList></ProspectList>
    )
}

export default withAuth(ProspectPageComponent,["superadmin","admin","employee"]);