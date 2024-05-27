import { useSession, getSession } from 'next-auth/react';
import { useState,useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [totalEmails, setTotalEmails] = useState(0);
  const [readEmails, setReadEmails] = useState(0);
  const [unreadEmails, setUnreadEmails] = useState(0);

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
      fetchEmailCounts();
    }
  }, [status]);

  const fetchEmailCounts = async () => {
    const total = 100;
    const read = 75;
    const unread = 25;

    setTotalEmails(total);
    setReadEmails(read);
    setUnreadEmails(unread);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>You must be logged in to view this page</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Profile</h2>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center mb-4">
            <img
              src={session?.session?.user?.image || '/default-avatar.png'}
              alt={session?.session?.user?.name}
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold">{session?.session?.user?.name}</h3>
            <p className="text-gray-500">{session?.session?.user?.email}</p>
          </div>
          <div className="mt-4 flex justify-between w-full px-4">
              <div className="text-center">
                <h4 className="text-lg font-bold">{totalEmails}</h4>
                <p className="text-gray-500">Total Emails</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold">{readEmails}</h4>
                <p className="text-gray-500">Read Emails</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold">{unreadEmails}</h4>
                <p className="text-gray-500">Unread Emails</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
