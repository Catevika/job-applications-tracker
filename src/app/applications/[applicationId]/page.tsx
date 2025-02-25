"use client";

import BackToDashboard from '@/components/buttons/BackToDashboard';
import UpdateForm from '@/components/forms/UpdateForm';
import CustomLoader from '@/components/loader/CustomLoader';
import { getApplicationById } from '@/server/actions';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
export default function UpdateApplicationPage({ params }: { params: Promise<{ applicationId: string; }>; }) {
  const { applicationId } = use(params);

  const { isLoading, data: application, error } = useQuery({
    queryKey: ['applications', applicationId],
    queryFn: () => getApplicationById(applicationId),
  });

  if (error) {
    console.error(error);
    throw new Error('Failed to fetch application');
  }

  if (isLoading || !application) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-425px)]'> <CustomLoader /></div>
    );
  }

  return (
    <section className="flex flex-col justify-start items-center">
      <div className='max-w-4xl w-full p-4 md:p-0'>
        <div className='flex flex-col md:flex-row justify-start md:justify-between items-center w-full mb-4'>
          <h1 className='text-2xl font-bold mb-2 md:mb-0'>Update Job Application</h1>
          <BackToDashboard />
        </div>
        <UpdateForm application={application} />
      </div>
    </section>
  );
}