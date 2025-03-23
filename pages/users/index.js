import React from 'react';
import withAuth from "../../middleware/withAuth";

import UserList from '../../components/User/List'
const UserListComponent = () =>{
    return(
        <UserList></UserList>
    )
}

export default withAuth(UserListComponent,["superadmin"]);