import  {React, useState, useEffect } from "react";
import axios from 'axios';
import { faArrowDown,faArrowUp} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataFound from "../NoDataFound";
import {formatDateTime} from '../../utils/dateUtil'

export default function UserList() {
  const [error, setError] = useState("");
  const [users,setUsers] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
  }, []);
  const fetchData = async (filterField=null,filterValue=null) => {
      try {
        if(filterField === null && filterValue === null){
          filterField='createdAt',
          filterValue='-1'
        }else if(filterField === 'search' && filterValue.toString().length === 0){
          filterField='createdAt',
          filterValue='-1'
        }
        let token=localStorage.getItem('token')
        const response=await axios.get('/api/users',{
          params:{
            filterField,
            filterValue
          },
          headers:{
              Authorization:'Bearer '+token,
              "Content-Type": "application/json",
          }
        })
          if (!response.data.data.length) {
            throw new Error("Failed to fetch data");
          }
          setUsers(response?.data?.data);
      } catch (error) {
        console.log(error)
        setError(error.message);
      } finally {
        setLoading(false);
      }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading users...
      </div>
    );
  }

  if(!users?.length === 0 || users === undefined){
    return <NoDataFound/>;
  }
  return (
    <>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-4">
            <label className="px-6 py-2 text-lg font-medium text-gray-700">Search</label>
            <input className="border rounded px-6 py-2 text-gray-600 mr-2" type="text" onKeyUp={e=>{fetchData('search',e.target.value)}}>
            </input>
            <select className="border rounded px-3 py-2 text-gray-600">
              <option>All User Type</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ml-2 mr-2">Create New User</button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                    <FontAwesomeIcon icon={faArrowUp} className="ml-2" onClick={e=>{fetchData('name','-1')}}/>
                    <FontAwesomeIcon icon={faArrowDown} onClick={e=>{fetchData('prospect_name','1')}}/>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                    <FontAwesomeIcon icon={faArrowUp} className="ml-2" onClick={e=>{fetchData('prospect_email','-1')}}/>
                    <FontAwesomeIcon icon={faArrowDown} onClick={e=>{fetchData('prospect_email','1')}}/>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Canvassn Unique User Token
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                        <FontAwesomeIcon icon={faArrowUp} className="ml-2" onClick={e=>{fetchData('createdAt','-1')}}/>
                        <FontAwesomeIcon icon={faArrowDown} onClick={e=>{fetchData('createdAt','1')}}/>
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.user_unique_token}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.user_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDateTime(user.createdAt)}</td>
              </tr>
            ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            {/* <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button> */}
          </div>
        </div>
        </>
  );
}
