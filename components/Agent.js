import { useState, useEffect } from 'react';
import axios from 'axios';
export default function EmailListComponent() {
  const [agents,setAgents] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
      const fetchData = async () => {
          try {
          let token=localStorage.getItem('token')
          const response = await axios.get('/api/chatagent',{
              headers:{
                  Authorization:'Bearer '+token,
                  "Content-Type": "application/json",
              }
          })
          console.log(response)
            // if (!response.ok) {
            //   throw new Error("Failed to fetch data");
            // }
            // const result = await response.json();
            // setData(result);
          } catch (error) {
            console.log(error)
            // setError(error.message);
          } finally {
            // setLoading(false);
          }
      };
      fetchData()
  },[])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading emails...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      {/* <ul>
        {emails.map((email) => (
          <li key={email.id} className="border-b border-gray-200 py-2">
            <p className="font-semibold">{email.subject}</p>
            <p className="text-sm text-gray-600">{email.sender}</p>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
