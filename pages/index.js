import { useSession,signIn,signOut } from 'next-auth/react';
import SignOutButton from '../components/SignOutButton';
import Link from 'next/link';

export default function Home() {
  const session = useSession();
    console.log(session?.data?.session)
    if(session?.data === null){
        return (
            <button onClick={signIn}>
                Login
            </button>
        )
    }
  return (
    <div></div>
  );
}
