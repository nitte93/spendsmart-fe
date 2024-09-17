"use client";
// components/Documents.js
import React from "react";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Card from "@/components/common/Card";

function Documents() {
  return (
    <Card>
      <div className="">
        <h1 className="text-lg font-semibold">Use an example file:</h1>

        <div className="">
          <h2 className="text-lg mt-2 font-semibold text-blue-600">
            example-hdfc-bank-statement.xlsx
          </h2>
          <a className="text-green-500 block mt-1 hover:text-green-700 transition duration-300 ease-in-out">
            Analyse Document →
          </a>
        </div>
      </div>
    </Card>
  );
}

export default Documents;
