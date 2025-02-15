import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const EmailDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [email, setEmail] = useState(null);

  // useEffect(() => {
  //   if (id) {
  //     const fetchEmail = async () => {
  //       try {
  //         const response = await fetch(`/api/get-email?id=${id}`);
  //         const data = await response.json();
  //         setEmail(data);
  //       } catch (error) {
  //         console.error('Error fetching email:', error);
  //       }
  //     };

  //     fetchEmail();
  //   }
  // }, [id]);

  // if (!email) {
    return <div>Loading...</div>;
  // }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">{email.mailbody.subject}</h1>
        <div className="flex items-center mb-4">
          <img
            src="/path-to-profile-image.jpg" // Replace with actual path to profile image
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-gray-700 font-semibold">{email.mailbody.from}</p>
            <p className="text-gray-500">{new Date(email.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">{email.mailbody.body}</p>
        </div>
        <div>
          <p className="text-gray-500">To: {email.mailbody.to}</p>
          {email.mailbody.cc && <p className="text-gray-500">Cc: {email.mailbody.cc}</p>}
          {email.mailbody.bcc && <p className="text-gray-500">Bcc: {email.mailbody.bcc}</p>}
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
