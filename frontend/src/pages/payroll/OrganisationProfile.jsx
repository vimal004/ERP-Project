import React from "react";
import { PhotoIcon, LightBulbIcon } from "@heroicons/react/24/outline";

const OrganisationProfile = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-4 font-sans text-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Organisation Profile
        </h1>
        <div className="text-xs text-gray-500">
          Organisation ID: 60058460764
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#fff9e6] p-3 mb-8 flex items-start rounded-sm">
        <LightBulbIcon className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <p className="text-[13px] text-gray-700">
          The changes made here will be reflected in Zoho Books apps as well.
        </p>
      </div>

      <div className="space-y-8">
        {/* Logo Section */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <label className="block text-[13px] text-gray-600 mb-1">
              Organisation Logo
            </label>
          </div>
          <div className="col-span-12 md:col-span-9 flex items-start gap-4">
            <div className="w-40 h-24 border border-dashed border-gray-300 bg-gray-50 rounded flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-gray-400 transition-colors">
              <PhotoIcon className="w-5 h-5 mb-1" />
              <span className="text-[10px] uppercase font-semibold tracking-wide">
                Upload Logo
              </span>
            </div>
            <div className="text-[11px] text-gray-500 space-y-1">
              <p>
                This logo will be displayed on documents such as Payslip and TDS
                Worksheet.
              </p>
              <p>
                Preferred Image Size: 240 x 240 pixels @ 72 DPI, Maximum size of
                1MB.
              </p>
              <p>Accepted File Formats: PNG, JPG, and JPEG</p>
            </div>
          </div>
        </div>

        {/* Organisation Name */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <label className="block text-[13px] text-gray-900">
              Organisation Name<span className="text-red-500">*</span>
            </label>
          </div>
          <div className="col-span-12 md:col-span-6">
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="KSK electronics pvt ltd"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              This is your registered business name which will appear in all the
              forms and payslips.
            </p>
          </div>
        </div>

        {/* Business Location & Industry */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            {/* Spacer for alignment if strictly following grid, or labels here?
                   Screenshot has labels above inputs for this row.
               */}
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="flex gap-8">
              <div className="w-1/2">
                <label className="block text-[13px] text-gray-900 mb-1">
                  Business Location<span className="text-red-500">*</span>
                </label>
                <select className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:border-blue-500">
                  <option>India</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-[13px] text-gray-900 mb-1">
                  Industry<span className="text-red-500">*</span>
                </label>
                <select className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:border-blue-500">
                  <option>Manufacturing</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Date Format & Separator */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3"></div>
          <div className="col-span-12 md:col-span-9">
            <div className="flex gap-8">
              <div className="w-1/2">
                <label className="block text-[13px] text-gray-900 mb-1">
                  Date Format<span className="text-red-500">*</span>
                </label>
                <select className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:border-blue-500">
                  <option>dd/MM/yyyy [ 21/01/2026 ]</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-[13px] text-gray-900 mb-1">
                  Field Separator
                </label>
                <select className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:border-blue-500">
                  <option>/</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Organisation Address */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <label className="block text-[13px] text-gray-900">
              Organisation Address<span className="text-red-500">*</span>
            </label>
          </div>
          <div className="col-span-12 md:col-span-6 space-y-3">
            <p className="text-[11px] text-gray-500 -mt-2 mb-2">
              This will be considered as the address of your primary work
              location.
            </p>

            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
              placeholder="Address Line 1"
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
              placeholder="Address Line 2"
            />

            <div className="grid grid-cols-3 gap-3">
              <select className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:border-blue-500">
                <option>Tamil Nadu</option>
              </select>
              <input
                type="text"
                className="col-span-2 w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                defaultValue="Chennai, Tamil Nadu, India"
              />
            </div>
            <input
              type="text"
              className="w-1/3 border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
              defaultValue="638004"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 flex items-center gap-4">
        <button className="bg-[#007eff] hover:bg-blue-600 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">
          Save
        </button>
        <div className="flex-1"></div>
        <p className="text-xs text-red-500">* indicates mandatory fields</p>
      </div>
    </div>
  );
};

export default OrganisationProfile;
