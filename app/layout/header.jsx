
'use client';
import Avatar from "../component/avatar";
import Breadcrumb from "../component/Breadcrumb";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';




export default function subHeader() {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const { data: session, status } = useSession();
  const router = useRouter();


  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/Login'); // Redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex text-black justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session || !session.user) {
    router.push('/Login');
    return null; // Return null to avoid rendering the rest of the component
  }
  
    return (
        <div className="flex font-cairo justify-between w-full border-b-2 border-b-gray-100 shadow-lg  h-fit ">
        <div className="m-3 text-blue-gray-900">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <div className="text-sm ml-3 text-blue-gray-500">
        <Breadcrumb setPageTitle={setPageTitle}  />
          </div>
          </div>
        <div className="m-3 flex flex-row">
            <Avatar name="John Doe" src="/header/avatar.png" />
            <p className="text-blue-gray-900 font-comfortaa ml-2 text-md origin-left duration-200">
      {session.user.firstName} {session.user.lastName} 
      <br />
        <span className="text-xs m-auto text-blue-gray-500">{session.user.roles}</span>
      
      </p>
      
        </div>
        </div>
        
    );

}