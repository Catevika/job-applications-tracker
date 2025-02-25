"use client";

import PendingButton from '@/components/buttons/PendingButton';
import { rowTitlesForm } from "@/data/data";
import { updateApplication } from "@/server/actions";
import { toISOString } from "@/server/utils/formatDate";
import type { Application } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Form from "next/form";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const UpdateForm = ({ application }: { application: Application; }) => {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateApplication(application.applicationId, formData),
    onMutate: async (formData: FormData) => {
      await queryClient.cancelQueries({ queryKey: ["application", application.applicationId] });

      const previousApplication = queryClient.getQueryData([
        "application",
        application.applicationId,
      ]);

      const updatedApplication = Object.fromEntries(formData.entries());

      queryClient.setQueryData(
        ["application", application.applicationId],
        (oldApplication: Application | undefined) => ({
          ...oldApplication,
          ...updatedApplication,
        })
      );

      return { previousApplication };
    },
    onError: (error, _variables, context) => {
      console.error("Mutation error:", error);
      if (context?.previousApplication) {
        queryClient.setQueryData(
          ["application", application.applicationId],
          context.previousApplication
        );
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["application", application.applicationId] });
      setIsPending(false);
      router.push(result.redirectTo);
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  const handleFormAction = async (formData: FormData) => {
    setIsPending(true);
    // Convert dates to ISO strings before submitting
    const applicationDate = formData.get('Application Date');
    if (applicationDate) {
      formData.set('Application Date', toISOString(applicationDate.toString()));
    }
    const followUpDate = formData.get('Follow-up Date');
    if (followUpDate) {
      formData.set('Follow-up Date', toISOString(followUpDate.toString()));
    }
    mutation.mutate(formData);
  };

  return (
    <Form
      action={handleFormAction}
      className="flex flex-col flex-nowrap justify-center p-4 bg-fuchsia-950/80 border border-fuchsia-950 rounded-md shadow-md shadow-slate-950"
    >
      {Object.keys(application).map((field, index) => {
        let inputType = "text";
        if (field === "applicationDate" || field === "followUpDate") {
          inputType = "date";
        }

        return (
          <div
            key={index}
            className={
              rowTitlesForm[index] === "Application Id"
                ? "flex flex-col items-start sm:items-center sm:flex-row"
                : "flex flex-col items-start mb-2 sm:flex-row"
            }
          >
            <label
              htmlFor={field}
              className={
                rowTitlesForm[index] === "Application Id"
                  ? "hidden"
                  : "w-full sm:w-1/4 text-left sm:text-right text-slate-50 mt-2 mb-2 sm:mb-0 pr-4"
              }
            >
              {rowTitlesForm[index]}
            </label>
            {rowTitlesForm[index] !== 'Job Description' && rowTitlesForm[index] !== 'Notes' ? <input
              id={field}
              name={rowTitlesForm[index]}
              type={inputType}
              required={[
                "companyName",
                "jobTitle",
                "applicationMethod",
                "status",
              ].includes(field)}
              autoComplete="off"
              placeholder={
                (field === "applicationDate" || field === "followUpDate")
                  ? application[field as keyof Application]
                    ? new Date(application[field as keyof Application] as string).toISOString().split('T')[0]
                    : ""
                  : application[field as keyof Application]?.toString() ?? ""
              }
              defaultValue={
                (field === "applicationDate" || field === "followUpDate")
                  ? application[field as keyof Application]
                    ? new Date(application[field as keyof Application] as string).toISOString().split('T')[0]
                    : ""
                  : application[field as keyof Application]?.toString() ?? ""
              }
              className={
                rowTitlesForm[index] === "Application Id"
                  ? "hidden"
                  : "flex-1 w-full text-fuchsia-200 bg-fuchsia-300/5 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md"
              }
            /> : <textarea id={field} name={rowTitlesForm[index]} placeholder={rowTitlesForm[index]} defaultValue={application[field as keyof Application]?.toString() ?? ""} className="flex-1 w-full text-fuchsia-200 bg-fuchsia-300/5 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md resize-none scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-fuchsia-300 scrollbar-track-rounded-md scrollbar-track-slate-900 overflow-auto" rows={2} />}
          </div>
        );
      })}
      <PendingButton
        title="Update application"
        type="submit"
        className="flex justify-center items-center py-2 px-4 rounded w-1/2 mx-auto text-slate-900 hover:text-fuchsia-300 bg-fuchsia-300 hover:bg-slate-900 font-bold shadow-md shadow-slate-950 border border-fuchsia-300"
        pendingText="Updating..."
        buttonText="Update"
        disabled={isPending}
      />
    </Form>
  );
};

export default UpdateForm;
