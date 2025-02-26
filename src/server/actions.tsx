"use server";

import prisma from '@/server/db/prisma';
import type { Application } from '@prisma/client';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
}

// Fetch all applications
export async function getApplications() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: [
        { applicationDate: 'desc' },
        { companyName: 'asc' }
      ],
    });
    return applications;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch applications');
  }
}

// Fetch a single application by ID
export async function getApplicationById(applicationId: string) {
  try {
    const application = await prisma.application.findUnique({
      where: { applicationId },
    });
    return application;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch application');
  }
}

// Create a new application
export async function createNewApplication(data: FormData): Promise<{ success: boolean; application?: Application; redirectTo: string; error?: string; }> {
  try {
    const newApplication = await prisma.application.create({
      data: {
        companyName: data.get('Company Name')?.toString() || '',
        applicationLink: data.get('Application Link')?.toString() || '',
        contactEmail: data.get('Contact Email')?.toString() || '',
        jobTitle: data.get('Job Title')?.toString() || '',
        jobDescription: data.get('Job Title')?.toString() || '',
        applicationDate: data.get('Application Date')?.toString()
          ? new Date(data.get('Application Date')?.toString() || '').toISOString()
          : new Date().toISOString(),
        applicationMethod: data.get('Application Method')?.toString() || '',
        status: data.get('Status')?.toString() || '',
        nextStep: data.get('Next Step')?.toString() || '',
        followUpDate: data.get('Follow-up Date')?.toString()
          ? new Date(data.get('Follow-up Date')?.toString() || '').toISOString()
          : new Date().toISOString(),
        notes: data.get('Notes')?.toString() || '',
      },
    });
    return { success: true, application: newApplication, redirectTo: '/applications' };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create application", redirectTo: '/applications' };
  }
}


// Update an existing application
export async function updateApplication(applicationId: string, data: FormData): Promise<{
  success: boolean; application?: Application; redirectTo: string; error?: string;
}> {
  const application = await getApplicationById(applicationId);
  if (!application) {
    return { success: false, error: "Application not found", redirectTo: '/applications' };
  }

  try {
    const updatedApplication = await prisma.application.update({
      where: { applicationId },
      data: {
        applicationId: application.applicationId,
        companyName: data.get('Company Name')?.toString() ?? application.companyName,
        applicationLink: data.get('Application Link')?.toString() ?? application.applicationLink,
        contactEmail: data.get('Contact Email')?.toString() ?? application.contactEmail,
        jobTitle: data.get('Job Title')?.toString() ?? application.jobTitle,
        jobDescription: data.get('Job Description')?.toString() ?? application.jobDescription,
        applicationDate: data.get('Application Date')?.toString()
          ? new Date(data.get('Application Date')?.toString() || '').toISOString()
          : application.applicationDate,
        applicationMethod: data.get('Application Method')?.toString() ?? application.applicationMethod,
        status: data.get('Status')?.toString() ?? application.status,
        nextStep: data.get('Next Step')?.toString() ?? application.nextStep,
        followUpDate: data.get('Follow-up Date')?.toString()
          ? new Date(data.get('Follow-up Date')?.toString() || '').toISOString()
          : application.followUpDate,
        notes: data.get('Notes')?.toString() ?? application.notes,
      },
    });
    return { success: true, application: updatedApplication, redirectTo: "/applications" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update application", redirectTo: '/applications' };
  }
};

// Delete an application
export async function deleteApplication(applicationId: string): Promise<{ success: boolean; error?: string; }> {
  try {
    await prisma.application.delete({
      where: { applicationId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting application:", error);
    return { success: false, error: "Failed to delete application" };
  }
}

// Search applications
export const filterApplications = async (
  keyword: string,
  searchDate?: Date,
): Promise<Application[]> => {
  try {
    const whereClause = {
      AND: [
        {
          OR: [
            { companyName: { contains: keyword, mode: 'insensitive' as const } },
            { applicationLink: { contains: keyword, mode: 'insensitive' as const } },
            { contactEmail: { contains: keyword, mode: 'insensitive' as const } },
            { jobTitle: { contains: keyword, mode: 'insensitive' as const } },
            { applicationMethod: { contains: keyword, mode: 'insensitive' as const } },
            { status: { contains: keyword, mode: 'insensitive' as const } },
            { nextStep: { contains: keyword, mode: 'insensitive' as const } },
            { notes: { contains: keyword, mode: 'insensitive' as const } },
            { jobDescription: { contains: keyword, mode: 'insensitive' as const } },
          ],
        },
        ...(searchDate
          ? [
            {
              OR: [
                {
                  applicationDate: {
                    gte: startOfDay(searchDate),
                    lt: endOfDay(searchDate),
                  },
                },
                {
                  followUpDate: {
                    gte: startOfDay(searchDate),
                    lt: endOfDay(searchDate),
                  },
                },
                {
                  notes: {
                    contains: formatDateForSearch(searchDate),
                  },
                },
                {
                  jobDescription: {
                    contains: formatDateForSearch(searchDate),
                  },
                },
              ],
            },
          ]
          : []),
      ].filter(Boolean),
    };

    const applications = await prisma.application.findMany({
      where: whereClause,
      orderBy: {
        applicationDate: 'desc',
      },
    });

    return applications;
  } catch (error) {
    console.error('Error fetching applications by filters:', error);
    throw new Error('Failed to fetch applications by filters');
  }
};

// Helper function to format date for searching within notes and jobDescription
const formatDateForSearch = (date: Date): string => {
  return format(date, 'MM/dd/yyyy', { locale: enUS });
};

// Helper function to get the start of the day in Europe/Paris time zone
const startOfDay = (date: Date): Date => {
  const zonedDate = toZonedTime(date, 'Europe/Paris');
  zonedDate.setHours(0, 0, 0, 0);
  return zonedDate;
};

// Helper function to get the end of the day in Europe/Paris time zone
const endOfDay = (date: Date): Date => {
  const zonedDate = toZonedTime(date, 'Europe/Paris');
  zonedDate.setHours(23, 59, 59, 999);
  return zonedDate;
};