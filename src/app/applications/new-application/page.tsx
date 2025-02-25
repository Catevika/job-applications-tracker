import BackToDashboard from '@/components/buttons/BackToDashboard';
import CreateForm from '@/components/forms/CreateForm';

export default function NewApplicationPage() {
  return (
    <section className="flex flex-col justify-start items-center">
      <div className='max-w-4xl w-full p-4 md:p-0'>
        <div className='flex flex-col md:flex-row justify-start md:justify-between items-center w-full mb-4'>
          <h1 className="text-2xl font-bold mb-2 md:mb-0">New Job Application</h1>
          <BackToDashboard />
        </div>
        <CreateForm />
      </div>
    </section>
  );
};