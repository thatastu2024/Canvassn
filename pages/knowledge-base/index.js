import React from 'react';
import KnowledgeBaseListComponent from '../../components/KnowledgeBase'
import withAuth from "../../middleware/withAuth";

const knowledgeBaseList = () =>{
    return(
        <KnowledgeBaseListComponent></KnowledgeBaseListComponent>
    )
}

export default withAuth(knowledgeBaseList,["superadmin"]);