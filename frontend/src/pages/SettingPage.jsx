import React from "react";

const PREVIEW_MESSAGE = [
  {
    id: 1,
    content: "Hey! How it's going?",
    isSent: false,
  },
  {
    id: 2,
    content: "I'm doing well, thanks!",
    isSent: true,
  },
];
const SettingPage = () => {
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70"></p>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
