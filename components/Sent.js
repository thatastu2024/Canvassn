import { useState, useEffect } from 'react';

export default function SentComponent() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  useEffect(() => {
    // fetchEmails();
  }, [page, limit]);

  const fetchEmails = async () => {
    const response = await fetch(`/api/send?page=${page}&limit=${limit}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
      setEmails(data);
    setLoading(false);
  };
  const totalPages = Math.ceil(total / limit);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading emails...
      </div>
    );
  }
  console.log(emails)
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              To
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Body
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {emails?.data?.map((email) => (
            <tr key={email.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{email?.mailbody?.to}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{email?.mailbody?.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{email?.mailbody?.body}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(email?.createdAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
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
        </button>
      </div>
    </div>
  );
}
