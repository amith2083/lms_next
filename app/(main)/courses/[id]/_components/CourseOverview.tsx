import React from 'react';
import { CheckCheck } from "lucide-react";

const CourseOverview = ({course}) => {
    return (
        <>
                  <h3 className=" text-2xl">Course Description</h3>
                  <p className="mt-4">
                  {course?.description}.
                    <br /> <br /> 
                  </p>
                  <div className="bg-gray-50 space-y-6 p-8 rounded-md mt-8">
                    <h4 className="text-2xl">What You will Learn?</h4>
                    <ul className="grid sm:grid-cols-2 grid-cols-1 gap-6">
                      <li className="flex space-x-3">
                        <div className="flex-none relative top-1">
                          <CheckCheck />
                        </div>
                        <div className="flex-1">
                          Learn how perspective works and how to incorporate
                          your art
                        </div>
                      </li>
                      <li className="flex space-x-3">
                        <div className="flex-none relative top-1">
                          <CheckCheck />
                        </div>
                        <div className="flex-1">
                          Learn how perspective works and how to incorporate
                          your art
                        </div>
                      </li>
                      <li className="flex space-x-3">
                        <div className="flex-none relative top-1">
                          <CheckCheck />
                        </div>
                        <div className="flex-1">
                          Learn how perspective works and how to incorporate
                          your art
                        </div>
                      </li>
                      <li className="flex space-x-3">
                        <div className="flex-none relative top-1">
                          <CheckCheck />
                        </div>
                        <div className="flex-1">
                          Learn how perspective works and how to incorporate
                          your art
                        </div>
                      </li>
                    </ul>
                  </div>
                </>
    );
};

export default CourseOverview;