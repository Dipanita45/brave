"use client";

import { db } from "@/lib/utils/db";
import { JsonForms } from "@/lib/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItem from "./FormListItem";

async function FormList() {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);

  const result = await db
    .select()
    .from(JsonForms)
    .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(JsonForms.id));

  setFormList(result);
  console.log(result);

  return (
    <div className="py-10 px-4">
      <h2 className="font-bold text-3xl">Your Forms</h2>
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-5">
        {formList.map((form, index) => (
          <div key={index}>
            <FormListItem
              jsonForm={JSON.parse(form.jsonform)}
              formRecord={form}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormList;
