"use client";

import PendingButton from '@/components/buttons/PendingButton';
import { rowTitlesForm } from "@/data/data";
import { updateApplication } from "@/server/actions";
import { toISOString } from "@/server/utils/formatDate";
import type { Application } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import Form from "next/form";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const UpdateForm = ({ application }: { application: Application; }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateApplication(application.applicationId, formData),
    onError: (error) => {
      console.error("Update error:", error);
      setIsPending(false);
    },
    onSuccess: (result) => {
      setIsPending(false);
      router.push(result.redirectTo);
    },
  });

  const handleFormAction = async (formData: FormData) => {
    setIsPending(true);

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
        let placeholder = application[field as keyof Application]?.toString() ?? "";
        let defaultValue = application[field as keyof Application]?.toString() ?? "";
        if (field === "applicationDate" || field === "followUpDate") {
          inputType = "date";
          placeholder = application[field as keyof Application]
            ? new Date(application[field as keyof Application] as string).toISOString().split('T')[0]
            : "";
          defaultValue = application[field as keyof Application]
            ? new Date(application[field as keyof Application] as string).toISOString().split('T')[0]
            : "";
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
            {rowTitlesForm[index] !== 'Job Description' && rowTitlesForm[index] !== 'Notes' ? (
              <input
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
                placeholder={placeholder}
                defaultValue={defaultValue}
                className={
                  rowTitlesForm[index] === "Application Id"
                    ? "hidden"
                    : "flex-1 w-full text-fuchsia-200 bg-fuchsia-300/5 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md"
                }
              />
            ) : (
              <textarea
                id={field}
                name={rowTitlesForm[index]}
                placeholder={rowTitlesForm[index]}
                defaultValue={defaultValue}
                className="flex-1 w-full text-fuchsia-200 bg-fuchsia-300/5 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md resize-none scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-fuchsia-300 scrollbar-track-rounded-md scrollbar-track-slate-900 overflow-auto"
                rows={2}
              />
            )}
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