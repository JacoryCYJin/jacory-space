"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { aboutTexts } from "@/constants/About";

const About = () => {
  const { language } = useApp();
  const currentTexts = aboutTexts[language];

  const SkillTag = ({ skill }) => (
    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200">
      {skill}
    </span>
  );

  const ExperienceCard = ({ exp }) => (
    <div className="dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {exp.title}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {exp.period}
        </span>
      </div>
      <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
        {exp.company}
      </p>
      <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
    </div>
  );

  const ContactLink = ({ href, icon, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </a>
  );

  return (
    <div className="min-h-screen ">
      <div className="flex flex-col items-center justify-center max-w-7.5xl mx-auto px-4 py-12">
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

        <div className="grid lg:grid-cols-5 gap-8 w-full">
          {/* Skills Section */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-3">🚀</span>
                {currentTexts.sections.skills}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Frontend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentTexts.skills.frontend.map((skill, index) => (
                      <SkillTag key={index} skill={skill} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Backend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentTexts.skills.backend.map((skill, index) => (
                      <SkillTag key={index} skill={skill} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Tools & Others
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentTexts.skills.tools.map((skill, index) => (
                      <SkillTag key={index} skill={skill} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-3">💼</span>
                {currentTexts.sections.experience}
              </h2>
              <div className="space-y-6">
                {currentTexts.experiences.map((exp, index) => (
                  <ExperienceCard key={index} exp={exp} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-2">
            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">🎓</span>
                {currentTexts.sections.education}
              </h2>
              <div className="space-y-4">
                {currentTexts.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400">
                      {edu.school}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">🎨</span>
                {currentTexts.sections.interests}
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentTexts.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">📧</span>
                {currentTexts.sections.contact}
              </h2>
              <div className="space-y-3">
                <ContactLink
                  href={`mailto:${currentTexts.contact.email}`}
                  icon="✉️"
                  label={currentTexts.contact.email}
                />
                <ContactLink
                  href={currentTexts.contact.github}
                  icon="🐙"
                  label="GitHub"
                />
                <ContactLink
                  href={currentTexts.contact.twitter}
                  icon="🐦"
                  label="Twitter"
                />
                <ContactLink
                  href={currentTexts.contact.linkedin}
                  icon="💼"
                  label="LinkedIn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
