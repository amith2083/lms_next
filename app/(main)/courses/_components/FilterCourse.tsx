'use client'

import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const PRICE_OPTIONS = [
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

const FilterCourse = ({ categories, isLoading }: { categories: any[]; isLoading: boolean }) => {
  const [filter, setFilter] = useState({
    categories: ["development"],
    price: ["free"],
    sort: "",
  });

  const applyArrayFilter = ({ type, value }: { type: string; value: string }) => {
    const isFilterApplied = filter[type].includes(value);

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [type]: prev[type].filter((v) => v !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [type]: [...prev[type], value],
      }));
    }
  };

  return (
    <div className="hidden lg:block">
      <Accordion defaultValue={["categories"]} type="multiple">
        {/* Categories filter */}
        <AccordionItem value="categories">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Categories</span>
          </AccordionTrigger>
          <AccordionContent className="pt-6 animate-none">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-4">
                {categories.map((category, index) => (
                  <li key={category.id } className="flex items-center">
                    <Checkbox
                      id={`category-${index}`}
                      onCheckedChange={() => {
                        applyArrayFilter({
                          type: "categories",
                          value: category.slug || category.value || category.title.toLowerCase(),
                        });
                      }}
                      checked={filter.categories.includes(category.slug || category.value)}
                    />
                    <label
                      htmlFor={`category-${index}`}
                      className="ml-3 text-sm text-gray-600 cursor-pointer"
                    >
                      {category.title || category.label}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Price filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Price</span>
          </AccordionTrigger>
          <AccordionContent className="pt-6 animate-none">
            <ul className="space-y-4">
              {PRICE_OPTIONS.map((option, optionIdx) => (
                <li key={option.value} className="flex items-center">
                  <Checkbox
                    id={`price-${optionIdx}`}
                    onCheckedChange={() => {
                      applyArrayFilter({
                        type: "price",
                        value: option.value,
                      });
                    }}
                    checked={filter.price.includes(option.value)}
                  />
                  <label
                    htmlFor={`price-${optionIdx}`}
                    className="ml-3 text-sm text-gray-600 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterCourse;
