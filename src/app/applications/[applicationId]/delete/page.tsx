"use client";

import CustomLoader from "@/components/loader/CustomLoader";
import SingleApplication from "@/components/SingleApplication";
import { deleteApplication, getApplicationById } from "@/server/actions";
import type { Application } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use } from 'react';

const DeleteModal = ({ params }: { params: Promise<{ applicationId: string; }>; }) => {
  const { applicationId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteApplication(applicationId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });

      const previousApplications = queryClient.getQueryData(["applications"]);

      queryClient.setQueryData(["applications"], (oldApplications: Application[] | undefined) =>
        oldApplications?.filter((app) => app.applicationId !== applicationId)
      );

      return { previousApplications };
    },
    onError: (error, _variables, context) => {
      console.error("Error during deletion:", error);

      if (context?.previousApplications) {
        queryClient.setQueryData(["applications"], context.previousApplications);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      router.back();
    },
  });

  const { isLoading, data: application, error } = useQuery({
    queryKey: ["applications", applicationId],
    queryFn: () => getApplicationById(applicationId),
    enabled: !!applicationId,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch application");
  }

  if (isLoading || !application) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-140px)]">
        <CustomLoader />
      </div>
    );
  }

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <section className="flex flex-col md:flex-row justify-start md:justify-center items-center mt-28 md:mt-8 h-[calc(100vh-16px)] gap-4">
      <SingleApplication {...application} key={application.applicationId} />

      <div className="bg-slate-900 p-6 rounded-md shadow-md shadow-slate-950 border border-pink-600/80 w-[300px]">
        <h2 className="text-2xl text-pink-600/80 font-bold mb-4">Confirm Deletion</h2>
        <hr className="w-full border-t-1 border-pink-600/80 mb-2" />
        <p className="my-4">Are you sure you want to delete this application?</p>
        <div className="flex justify-center md:justify-end space-x-2">
          <button
            onClick={() => router.back()}
            className="bg-slate-50 hover:bg-slate-900 border border-fuchsia-300 text-slate-900 hover:text-fuchsia-300 shadow-md shadow-slate-950 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="bg-pink-600/80 hover:bg-slate-900 shadow-md shadow-slate-950 hover:text-pink-600/80 border border-transparent hover:border-pink-600/80 font-bold py-2 px-4 rounded"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeleteModal;