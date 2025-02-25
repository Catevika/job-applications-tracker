import Link from 'next/link';

const BackToDashboard = () => {
  return <Link href='/applications' className='bg-fuchsia-300 hover:bg-slate-900 text-slate-900 hover:text-fuchsia-300 shadow-md shadow-slate-950 border border-transparent hover:border-fuchsia-300 font-bold py-2 px-4 rounded w-fit'>Back to dashboard</Link>;
};
export default BackToDashboard;
