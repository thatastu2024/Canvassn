import { useState, useEffect } from 'react';
import axios from 'axios';
export default function knowledgeBaseListComponent() {
  const [knowledgeBaseList, setKnowledgeBaseList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getknowledgeBase();
  });

  const getknowledgeBase = async () => {
    const KnowledgeBaseResponse = await axios.get(process.env.NEXT_PUBLIC_ELEVEN_LABS_API_BASEURL+'/knowledge-base',{
        headers:{
        'xi-api-key':process.env.NEXT_PUBLIC_ELEVEN_LABS_VALUE,
        "Content-Type": "application/json",
        }
    })
    setKnowledgeBaseList(KnowledgeBaseResponse?.data?.documents);
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading Knowledge Base...
      </div>
    );
  }
  return (
    <>
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
        </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Access Level
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {knowledgeBaseList?.map((kb) => (
            <tr key={kb.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{kb?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kb?.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kb?.access_level}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kb?.dependent_agents?.length ? new Date(kb?.dependent_agents?.created_at_unix_secs).toLocaleTimeString(): 'N/A'}</td>
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
