'use client';

import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { List, Spinner } from '@/components/common';
// import UploadComponent from "@/components/UploadComponent";
import FileUpload from "@/components/UploadComponent";
import ExampleStatementCard from "@/components/ExampleStatementCard";

export default function Page() {
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

  const config = [
    {
      label: "First Name",
      value: user?.first_name,
    },
    {
      label: "Last Name",
      value: user?.last_name,
    },
    {
      label: "Email",
      value: user?.email,
    },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome {user?.first_name}
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl py-6 my-8 sm:px-6 lg:px-8">
        {/* <List config={config} /> */}
        <div className="mt-10 flex gap-x-6">
          {/* <UploadComponent /> */}
          <FileUpload />
          <div className="flex flex-col items-center justify-center">
            <div className="w-px h-12 bg-gray-300"></div>
            <span className="text-sm text-gray-500 px-2">or</span>
            <div className="w-px h-12 bg-gray-300"></div>
          </div>
          <ExampleStatementCard />
        </div>
      </main>
    </>
  );
}