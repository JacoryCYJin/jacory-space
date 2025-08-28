import React from "react";
import { useApp } from "@/lib/context";
import { aboutTexts } from "@/constants/About";

const AuthorHeader = () => {
  const { language } = useApp();
  const currentTexts = aboutTexts[language];

  return (
    <div className="max-w-5xl p-8 mb-12">
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-12">
        <div className="flex-shrink-0">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 dark:border-blue-800 shadow-lg">
            <img
              src="/images/avatar/avatar.jpg"
              alt={currentTexts.nickname}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {currentTexts.nickname}
          </h1>
          <p className="text-2xl text-primary dark:text-blue-400 mb-6 font-medium">
            {currentTexts.slogan}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {currentTexts.bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorHeader;
