import { LuLoader } from 'react-icons/lu';

const CustomLoader = () => {
  return <p className='flex justify-center items-center w-[100vw] h-[100vh]'><LuLoader className="h-12 w-12 animate-spin" /></p>;
};
export default CustomLoader;
