"use client";

import PendingButton from "@/components/buttons/PendingButton";
import { rowTitlesForm } from "@/data/data";
import { createNewApplication } from "@/server/actions";
import { toISOString } from "@/server/utils/formatDate";
import type { Application } from '@prisma/client';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Form from "next/form";
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

const CreateForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Initialize date states with null values
  const [applicationDate, setApplicationDate] = useState<string | null>(null);
  const [followUpDate, setFollowUpDate] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Convert dates to ISO strings before submitting
      if (applicationDate) {
        formData.set('Application Date', toISOString(applicationDate));
      }
      if (followUpDate) {
        formData.set('Follow-up Date', toISOString(followUpDate));
      }
      return await createNewApplication(formData);
    },
    onMutate: async (formData: FormData) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });

      const newApplication = Object.fromEntries(formData.entries());

      queryClient.setQueryData(["applications"], (oldApplications: Application[] = []) => [
        ...oldApplications,
        newApplication,
      ]);
    },
    onError: (error, variables) => {
      console.error("Mutation error:", error);
      queryClient.setQueryData(["applications"], (oldApplications: Application[] = []) => {
        const newApplication = Object.fromEntries(variables.entries());
        return oldApplications.filter(
          (app: Application) =>
            app.applicationId !== newApplication.applicationId
        );
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setIsPending(false);
      router.push(result.redirectTo);
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  const handleFormAction = async (formData: FormData) => {
    setIsPending(true);
    mutation.mutate(formData);
  };

  const handleApplicationDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApplicationDate(e.target.value);
  }, []);

  const handleFollowUpDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFollowUpDate(e.target.value);
  }, []);

  return (
    <Form
      action={handleFormAction}
      className="flex flex-col flex-nowrap justify-center p-4 bg-fuchsia-950/80 border border-fuchsia-950 rounded-md shadow-md shadow-slate-950"
    >
      {rowTitlesForm.map((rowTitle: string, index: number) => {
        let inputType = "text";
        let value = undefined;
        let onChange = undefined;

        if (rowTitle === "Application Date") {
          inputType = "date";
          value = applicationDate || '';
          onChange = handleApplicationDateChange;
        } else if (rowTitle === "Follow-up Date") {
          inputType = "date";
          value = followUpDate || '';
          onChange = handleFollowUpDateChange;
        }

        return (
          <div
            key={index}
            className={
              rowTitle === "Application Id"
                ? "flex flex-col items-start sm:items-center sm:flex-row"
                : "flex flex-col items-start mb-2 sm:flex-row"
            }
          >
            <label
              htmlFor={rowTitle}
              title={rowTitle}
              className={
                rowTitle === "Application Id"
                  ? "hidden"
                  : "w-full sm:w-1/4 text-left sm:text-right text-slate-50 sm:mt-2 mb-2 sm:mb-0 pr-4"
              }
            >
              {rowTitle}
            </label>
            {rowTitle !== "Job Description" && rowTitle !== "Notes" ? <input
              id={rowTitle}
              name={rowTitle}
              type={inputType}
              datatype={(rowTitle === "Application Date" || rowTitle === "Follow-up Date") ? 'MM/dd/yyyy' : 'text'}
              required={[
                "Company Name",
                "Job Title",
                "Application Method",
                "Status",
              ].includes(rowTitle)}
              autoComplete="off"
              placeholder={rowTitle}
              className={
                rowTitle === "Application Id"
                  ? "hidden"
                  : rowTitle === 'Application Date' || rowTitle === 'Follow-up Date'
                    ? 'flex-1 w-full text-fuchsia-200/60 bg-fuchsia-300/5 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md'
                    : "flex-1 w-full text-fuchsia-200 bg-fuchsia-300/5 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md"
              }
              value={value}
              onChange={onChange}
            /> : <textarea id={rowTitle} name={rowTitle} placeholder={rowTitle} className="flex-1 w-full text-fuchsia-200 bg-fuchsia-300/5 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md resize-none scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-fuchsia-300 scrollbar-track-rounded-md scrollbar-track-fuchsia-950 overflow-auto" rows={2} />}
          </div>
        );
      })}
      <PendingButton
        title="Submit new application"
        type="submit"
        className="flex justify-center items-center py-2 px-4 rounded w-1/2 mx-auto text-slate-900 hover:text-fuchsia-300 bg-fuchsia-300 hover:bg-slate-900 font-bold shadow-md shadow-slate-950 border border-fuchsia-300"
        pendingText="Sending..."
        buttonText="Send"
        disabled={isPending}
      />
    </Form>
  );
};

export default CreateForm;
