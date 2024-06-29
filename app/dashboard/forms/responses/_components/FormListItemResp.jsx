import { Button } from "@/app/components/ui/button";
import { db } from "../../../../configs";
import { userResponses } from "../../../../configs/schema";
import { eq } from "drizzle-orm";
import { HardDriveDownload, Loader2 } from "lucide-react";
import React, { useState } from "react";
import * as XLSX from "xlsx";

export function FormListItemResp({ jsonForm, formRecord }) {
  const [loading, setLoading] = useState(false);

  const ExportData = async () => {
    let jsonData = [];
    setLoading(true);
    const result = await db
      .select()
      .from(userResponses)
      .where(eq(userResponses.formRef, formRecord.id));

    console.log(result);
    if (result) {
      result.forEach((item) => {
        const jsonItem = JSON.parse(item.jsonResponse);
        jsonData.push(jsonItem);
      });
      setLoading(false);
    }
    console.log(jsonData);
    exportToExcel(jsonData);
  };

  /**
   * Convert Json to Excel and then Donwload it
   */
  const exportToExcel = (jsonData) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, jsonForm?.formTitle + ".xlsx");
  };

  return (
    <div className="border shadow-sm rounded-lg p-4 my-5 hover:scale-105 transition-all duration-500">
      <h2 className="text-lg text-black font-semibold">
        {jsonForm?.formTitle}
      </h2>
      <h2 className="text-sm pb-2 text-gray-500">{jsonForm?.formHeading}</h2>
      <hr className="my-4"></hr>
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-green-500">as XLSX</h2>
        <Button
          className=""
          size="sm"
          onClick={() => ExportData()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <p>Export</p> <HardDriveDownload size={18} />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
