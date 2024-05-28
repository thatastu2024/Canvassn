import { useState, useEffect } from 'react';

export default function TrashComponent() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    const response = await fetch('/api/email');
    console.log(response)
    const data = await response.json();
    setEmails(data);
    setLoading(false);
  };

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
      <ul>
        {emails.map((email) => (
          <li key={email.id} className="border-b border-gray-200 py-2">
            <p className="font-semibold">{email.subject}</p>
            <p className="text-sm text-gray-600">{email.sender}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
