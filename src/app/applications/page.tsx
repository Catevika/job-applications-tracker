"use client";

import ButtonLink from '@/components/buttons/ButtonLink';
import CustomLoader from '@/components/loader/CustomLoader';
import SearchBar from '@/components/search/SearchBar';
import SingleApplication from "@/components/SingleApplication";
import { rowTitles } from '@/data/data';
import { filterApplications } from "@/server/actions";
import type { Application } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function ApplicationsPage() {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const searchDate = searchParams.get("date")
    ? new Date(searchParams.get("date")!)
    : undefined;

  const { isLoading, data: applications, error } = useQuery({
    queryKey: ["applications", keyword, searchDate],
    queryFn: () => filterApplications(keyword, searchDate),
    enabled: true,
  });

  if (isLoading || !applications) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-425px)]">
        <CustomLoader />
      </div>
    );
  }

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch applications");
  }

  return (
    <section className='mx-auto'>
      <div className='flex flex-row justify-center md:justify-start items-center gap-2 w-full p-4 pt-0'>
        <ButtonLink
          href='/applications/new-application'
          pClassName='bg-fuchsia-300 hover:bg-slate-900 font-bold p-2 rounded-md w-fit shadow-md shadow-transparent hover:shadow-slate-950 border border-transparent hover:border-fuchsia-300 text-slate-950 hover:text-fuchsia-300 text-nowrap'
          text='New job application'
        />
        <SearchBar />
      </div>

      <div className='relative flex flex-col md:flex-row items-center md:items-start md:max-w-[99%] mt-16'>
        <div className={(keyword || searchDate) && applications.length === 0 ? 'hidden' : 'hidden fixed md:z-10 md:flex md:flex-col h-[calc(100vh-280px)] md:text-nowrap'}>
          <div className='mx-2 mt-4 h-full'>
            {rowTitles.map((rowTitle: string, index: number) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "h-11 font-bold uppercase p-2 mb-2 border border-transparent rounded-md"
                    : index === 1 ? "h-11 mt-4 p-2 border border-transparent rounded-md"
                      : index === 3 ? "h-11 font-bold p-2 border border-transparent rounded-md"
                        : index === rowTitles.length - 2 || index === rowTitles.length - 1
                          ? "h-11 text-transparent p-2 border border-transparent rounded-md"
                          : "h-11 p-2 border border-transparent rounded-md"
                }
              >
                {rowTitle}
              </p>
            ))}
          </div>
        </div>

        {applications.length > 0 ? (
          <>
            <div className='flex flex-col md:flex-row gap-4 h-[calc(100vh-280px)] md:ml-50 mt-2 overflow-x-hidden md:overflow-x-scroll overflow-y-scroll md:overflow-y-hidden scrollbar-thin md:scrollbar-thumb-rounded-md md:scrollbar-thumb-fuchsia-300 md:scrollbar-track-rounded-md md:scrollbar-track-slate-900'>
              {applications.map((application: Application) => (
                <SingleApplication {...application} key={application.applicationId} />
              ))}
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center w-full h-[calc(100vh-425px)]'>
            <p className='mt-64 text-center text-xl text-fuchsia-300'>No application found</p>
          </div>
        )}
      </div>
    </section>
  );
}
