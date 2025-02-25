"use client";

import { formatDate } from '@/server/utils/formatDate';
import type { Application } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';

const SingleApplication = (application: Application) => {
  const pathname = usePathname();
  const deletePathname = `/applications/${application.applicationId}/delete`;

  return (
    <div key={application.applicationId} className='relative flex flex-col flex-shrink-0 w-[300px] h-[650px] md:h-[calc(100vh-300px)] border-1 border-fuchsia-950/80 shadow-md shadow-slate-950 text-fuchsia-200'>
      <div className='p-2 bg-fuchsia-950/80 text-slate-50 rounded-t-md rounded-x-md'>
        <p className="font-bold h-11 p-2 uppercase">{application.companyName}</p>
      </div>
      <p className="h-11 mt-2 p-2 truncate"><em>{application.applicationLink}</em></p>
      <p className="h-11 p-2 truncate"><em>{application.contactEmail}</em></p>
      <p className="h-11 p-2 font-bold truncate">{application.jobTitle}</p>
      <div className="h-11 p-2 truncate">{application.jobDescription}</div>
      <p className="h-11 p-2">{formatDate(application.applicationDate)}</p>
      <p className="h-11 p-2 truncate">{application.applicationMethod}</p>
      <p className="h-11 p-2 truncate">{application.status}</p>
      <p className="h-11 p-2 truncate">{application.nextStep || "N/A"}</p>
      <p className="h-11 p-2">{application.followUpDate ? formatDate(application.followUpDate) : "N/A"}</p>
      <div className="p-2 truncate">{application.notes || "N/A"}</div>

      {pathname !== deletePathname ? <div className="flex flex-row justify-between items-center absolute bottom-2 left-4 right-4 text-slate-900 hover:text-fuchsia-300">
        <Link href={`/applications/${application.applicationId}`}>
          <p className="flex justify-center h-11 ml-4 md:ml-0 mb-4 md:mb-0 p-2 bg-fuchsia-300 hover:bg-slate-900 border border-fuchsia-300 shadow-md shadow-slate-950 rounded-md text-slate-900 hover:text-fuchsia-300">
            <RiEdit2Line size={24} />
          </p>
        </Link>

        <Link href={`/applications/${application.applicationId}/delete`}>
          <p className="flex justify-center h-11 ml-4 md:ml-0 mb-4 md:mb-0 p-2 bg-fuchsia-300 hover:bg-slate-900 border border-fuchsia-300 shadow-md shadow-slate-950 rounded-md text-slate-900 hover:text-fuchsia-300">
            <RiDeleteBin6Line size={24} />
          </p>
        </Link>
      </div> : null}
    </div>
  );
};

export default SingleApplication;
