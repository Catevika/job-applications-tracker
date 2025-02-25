"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from 'react-icons/io';
import { TbSearchOff } from 'react-icons/tb';

export default function FilterComponent({ closeDropdownAction }: { closeDropdownAction: () => void; }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const keyword = searchParams.get("keyword") || "";
  const searchDateParam = searchParams.get("date") || "";

  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    searchDateParam ? (new Date(searchDateParam)) : null
  );

  const updateSearchParams = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    return params.toString();
  }, [searchParams]);

  const handleSearch = useCallback(() => {
    let searchDateString: string | null = null;
    if (selectedDate) {
      searchDateString = selectedDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
    }

    const params = new URLSearchParams();

    if (searchKeyword.trim()) {
      params.set('keyword', searchKeyword.trim());
    }

    if (searchDateString) {
      params.set('date', searchDateString);
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  }, [searchKeyword, selectedDate, pathname, router]);

  const clearFilters = useCallback(() => {
    const queryString = updateSearchParams({ keyword: null, date: null });
    router.push(`${pathname}?${queryString}`);
    setSearchKeyword("");
    setSelectedDate(null);
  }, [updateSearchParams, pathname, router]);

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
    handleSearch();
  }, [handleSearch]);

  return (
    <div className={searchKeyword || selectedDate ? "space-y-2 mx-4 md:mx-0 mb-4 rounded bg-fuchsia-950 border border-fuchsia-950 shadow-md shadow-slate-950" : "space-y-4 mx-4 md:mx-0 mb-4 rounded bg-fuchsia-950 border border-fuchsia-950 shadow-md shadow-slate-950"}>
      <IoMdClose onClick={closeDropdownAction} size={24} className="absolute top-4 right-4 cursor-pointer" />
      <div className='flex flex-col md:flex-row items-end p-4'>
        <div className='flex flex-col w-full md:w-3/4'>
          <div className="flex flex-col md:flex-row items-center w-auto md:w-full mb-4 gap-2 md:gap-0">
            <label
              htmlFor="keyword"
              className="w-full md:w-1/3 text-left md:text-right text-slate-50 pr-4"
            >Search by keyword</label>
            <input
              id="keyword"
              name="keyword"
              type="text"
              placeholder="Search by keyword"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="flex-1 md:flex-none md:w-md text-slate-50 bg-slate-900/10 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center w-auto md:w-full mb-2 md:mb-0 gap-2 md:gap-0">
            <label
              htmlFor="datePicker"
              className="flex flex-row md:flex-col items-center md:items-end w-full md:w-1/3 text-left md:text-right text-slate-50 pr-4 space-x-2"
            >Search by date</label>
            <DatePicker
              id="datePicker"
              name="datePicker"
              selected={selectedDate}
              onChange={handleDateChange}
              className="flex-1 md:flex-none md:w-md text-slate-50 bg-slate-900/10 border border-slate-900 inset-shadow-sm inset-shadow-slate-950/60 p-2 rounded-md"
              placeholderText="mm/dd/yyyy"
              dateFormat="MM/dd/yyyy"
            />
          </div>
        </div>
        <div className='flex flex-row justify-center md:justify-end items-center w-full md:w-1/4'>
          <button
            type="button"
            onClick={handleSearch}
            className="flex justify-center items-center mt-2 ml-4 md:ml-0 mr-2 p-2 rounded-md bg-fuchsia-300 hover:bg-slate-900 shadow-md shadow-slate-950 border border-fuchsia-300 font-bold text-slate-900 hover:text-fuchsia-300"
          >Search</button>
          <button
            type="button"
            onClick={clearFilters}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                clearFilters();
              }
            }}
            className="flex justify-center items-center mt-2 ml-4 md:ml-0 p-2 rounded-md bg-slate-50 hover:bg-fuchsia-300 border border-fuchsia-900 shadow-md shadow-slate-950 font-bold text-fuchsia-900 hover:text-slate-900">
            <TbSearchOff size={28} className='mr-1' />Clear
          </button>
        </div>
      </div>
    </div>
  );
}
