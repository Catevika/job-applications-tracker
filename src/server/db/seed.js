import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
	await prisma.application.createMany({
		data: [
			{
				companyName: 'ABC Corporation',
				applicationLink: 'https://www.abc.com/apply',
				contactEmail: 'John Doe: j.doe@abc.com',
				jobTitle: 'Web developer React',
				jobDescription: 'React developer with 3 years experience.',
				applicationDate: new Date('2024-02-01'),
				applicationMethod: 'Online Portal',
				status: 'Submitted',
				nextStep: 'Await Response',
				followUpDate: new Date('2024-02-15'),
				notes: 'Sent tailored cover letter and resume.',
			},
			{
				companyName: 'XYZ Tech',
				applicationLink: 'https://www.xyz.com/apply',
				contactEmail: 'Jane Smith: j.smith@xyz.com',
				jobTitle: 'Web developer',
				jobDescription: 'Lead developer with 5 years experience.',
				applicationDate: new Date('2024-02-03'),
				applicationMethod: 'Email',
				status: 'Interview Scheduled',
				nextStep: 'Prepare for Technical Interview',
				followUpDate: new Date('2024-02-10'),
				notes: 'Interview on 02/12/2024 at 10:00 AM.',
			},
			{
				companyName: 'DEF Solutions',
				applicationLink: 'https://www.def.com/apply',
				contactEmail: 'Mike Johnson: m.johnson@def.com',
				jobTitle: 'Junior Web developer',
				jobDescription: 'Junior developer with 1 year experience.',
				applicationDate: new Date('2024-02-05'),
				applicationMethod: 'LinkedIn',
				status: 'Rejected',
				nextStep: 'No Response',
				followUpDate: new Date('2024-02-07'),
				notes: 'Received rejection email on 07/02/2024.',
			},
			{
				companyName: 'GHI Innovations',
				jobTitle: 'Frontend Web developer',
				applicationLink: 'https://www.ghi.com/apply',
				contactEmail: 'Sarah Williams: s.williams@ghi.com',
				jobDescription: 'Frontend developer with 2 years experience.',
				applicationDate: new Date('2024-02-06'),
				applicationMethod: 'Referral',
				status: 'Pending',
				nextStep: 'Follow Up',
				followUpDate: new Date('2024-02-18'),
				notes: 'Referred by John Doe awaiting response.',
			},
		],
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
