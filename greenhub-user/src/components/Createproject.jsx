import React, { useState } from "react";
import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";

const filters = [
  {
    id: "category",
    name: "Project Type",
    options: [
      {
        value: "tree-planting",
        label: "Tree Planting Projects",
        checked: false,
      },
      {
        value: "recycling",
        label: "Recycling & Upcycling Projects",
        checked: false,
      },
      { value: "clean-energy", label: "Clean Energy Projects", checked: false },
      {
        value: "water-conservation",
        label: "Water Conservation Projects",
        checked: false,
      },
      {
        value: "community-crafts",
        label: "Community Eco Crafts",
        checked: false,
      },
      {
        value: "organic-farming",
        label: "Organic Farming Initiatives",
        checked: false,
      },
      {
        value: "wildlife-protection",
        label: "Wildlife Protection Projects",
        checked: false,
      },
      {
        value: "green-tech",
        label: "Green Tech Innovation Projects",
        checked: false,
      },
    ],
  },
];

const CreateProjectPost = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [desc, setDesc] = useState("");
  const [mediaPreview, setMediaPreview] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      type: file.type.includes("image") ? "image" : "video",
      url: URL.createObjectURL(file),
    }));
    setMediaFiles(files);
    setMediaPreview(previews);
  };

  const submitPost = () => {
    onSubmit({
      title,
      description: desc,
      media: mediaPreview,
      date: new Date().toDateString(),
      author: {
        name: "You",
        role: "EcoMember",
        avatar: "https://via.placeholder.com/40",
      },
    });
    setTitle("");
    setDesc("");
    setMediaPreview([]);
  };

  const removeMedia = (index) => {
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-4 mb-6 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src="../../public/images/profile1.png"
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800">You</p>
          <p className="text-xs text-gray-500">EcoMember</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Project Title"
        className="w-full mb-2 p-3 rounded-lg border-none outline-none focus:border-none focus:outline-none text-gray-800"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Description */}
      <textarea
        placeholder="Describe your project..."
        className="w-full mb-3 p-3 rounded-lg border border-slate-300 focus:ring-1 focus:ring-lime-500 focus:outline-none text-gray-800"
        rows="3"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      {filters.map((section) => (
        <Disclosure
          key={section.id}
          as="div"
          className="p-3 pb-5 mb-5 border-b border-gray-200"
        >
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white  text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-950">{section.name}</span>
              <span className="ml-6 flex items-center">
                <PlusIcon
                  aria-hidden="true"
                  className="size-5 group-data-open:hidden"
                />
                <MinusIcon
                  aria-hidden="true"
                  className="size-5 group-not-data-open:hidden"
                />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6 space-y-2">
            {section.options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedCategories.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([
                        ...selectedCategories,
                        option.value,
                      ]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== option.value)
                      );
                    }
                  }}
                  className="w-4 h-4"
                />
                {option.label}
              </label>
            ))}
          </DisclosurePanel>
        </Disclosure>
      ))}

      {/* Media Preview */}
      {mediaPreview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          {mediaPreview.map((m, i) => (
            <div key={i} className="relative">
              {/* Remove Button */}
              <button
                onClick={() => removeMedia(i)}
                className="absolute top-1 right-1 bg-white/80 hover:bg-white
                     rounded-full w-6 h-6 flex items-center justify-center shadow-md"
              >
                ✕
              </button>

              {m.type === "image" ? (
                <img
                  src={m.url}
                  className="w-full h-40 object-cover rounded-lg border border-slate-300"
                />
              ) : (
                <video
                  controls
                  className="w-full h-40 rounded-lg border border-slate-300"
                >
                  <source src={m.url} />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Media upload like Facebook */}
      <div className="flex space-x-4 mb-3 justify-between items-center">
        <label
          className="flex flex-col items-center justify-center gap-1 px-3 py-1 md:py-2 md:px-6 rounded-lg border
         border-slate-300 hover:bg-slate-100 cursor-pointer shadow-lg font-semibold"
        >
          <PhotoIcon className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-xs md:text-sm">Gallery</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleMediaUpload}
          />
        </label>
        {/* <label className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
          <VideoCameraIcon className="w-6 h-6 text-green-600" />
          <span className="text-sm text-gray-500">Video</span>
          <input
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            onChange={handleMediaUpload}
          />
        </label> */}

        {/* Post Button */}
        <button
          onClick={submitPost}
          className="w-40 h-12 bg-lime-500 hover:bg-lime-600 text-white rounded-xl font-semibold transition"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default CreateProjectPost;
