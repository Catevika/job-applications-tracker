"use client";

import FilterComponent from '@/components/search/FilterComponent';
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuSearch, LuSearchCheck } from 'react-icons/lu';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const searchDate = searchParams.get("date")
    ? new Date(searchParams.get("date")!)
    : undefined;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSearchDown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const closeDropdownAction = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdownAction();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <>
      <div className='flex flex-row justify-start items-center'>
        {keyword !== "" || searchDate !== undefined ?
          <button type="button" onClick={toggleSearchDown} className="flex justify-center items-center h-12 p-2 rounded-md bg-slate-50 hover:bg-fuchsia-300 border border-slate-900 shadow shadow-slate-950 text-fuchsia-900 hover:text-slate-900">
            <LuSearchCheck size={24} />
          </button>
          :
          <button type="button" onClick={toggleSearchDown} className="flex justify-center items-center h-12 ml-4 md:ml-0 p-2 bg-fuchsia-300 hover:bg-slate-900 border border-slate-900 hover:border-fuchsia-300 shadow-md shadow-slate-950 rounded-md text-slate-900 hover:text-fuchsia-300">
            <LuSearch size={24} />
          </button>
        }
      </div>
      {isOpen && (
        <div ref={dropdownRef} className="fixed top-14 left-0 right-0 z-50 max-w-[1430px] w-full mx-auto rounded-2xl">
          <FilterComponent closeDropdownAction={closeDropdownAction} />
        </div>
      )}
    </>
  );
}
