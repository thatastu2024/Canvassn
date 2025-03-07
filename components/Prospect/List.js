import  {React, useState, useEffect } from "react";
import axios from 'axios';
import {formatDateTime} from '../../utils/dateUtil'
import { faArrowDown,faArrowUp} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Input } from "postcss";

export default function ProspectList() {
  const [error, setError] = useState("");
  const [prospects,setProspects] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
  }, []);
  const fetchData = async (filterField=null,filterValue=null) => {
      try {
        if(filterField === null && filterValue === null){
          filterField='createdAt',
          filterValue='-1'
        }
        let token=localStorage.getItem('token')
        const response=await axios.get('/api/prospects',{
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
          setProspects(response?.data?.data);
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
        Loading prospects...
      </div>
    );
  }

  if(!prospects?.length === 0 || prospects === undefined){
    return <p className="text-gray-500 p-4">No data found.</p>;
  }
  return (
    <>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Prospects</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-4">
            <label className="px-6 py-2 text-lg font-medium text-gray-700">Search</label>
            <input className="border rounded px-6 py-2 text-gray-600 mr-2" type="text" onKeyUp={e=>{fetchData('search',e.target.value)}}>
            </input>
            <select className="border rounded px-3 py-2 text-gray-600">
              <option>All Customers</option>
            </select>
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
                    Location
                    <FontAwesomeIcon icon={faArrowUp} className="ml-2" onClick={e=>{fetchData('prospect_email','-1')}}/>
                    <FontAwesomeIcon icon={faArrowDown} onClick={e=>{fetchData('location','1')}}/>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                    <FontAwesomeIcon icon={faArrowUp} className="ml-2" onClick={e=>{fetchData('createdAt','-1')}}/>
                    <FontAwesomeIcon icon={faArrowDown} onClick={e=>{fetchData('createdAt','1')}}/>
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {prospects.map((prospect, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prospect.prospect_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prospect.prospect_email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prospect.prospect_location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDateTime(prospect.createdAt)}</td>
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
