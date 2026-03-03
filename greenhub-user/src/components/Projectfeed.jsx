import React from "react";
import ProjectCard from "./Projectcard";

const samplePosts = [
  {
    date: "Jan 12, 2025",
    category: "Plastic-Free Initiative",
    title: "Community Plastic-Free Market",
    description:
      "Our weekly plastic-free market encourages biodegradable packaging and reusable bags. Volunteers help visitors borrow and return eco-bags.",
    media: [
      {
        type: "video",
        url: "../../public/videos/plasticFree.mp4"
      }
    ],
    author: {
      name: "Mya Thiri",
      role: "Eco Volunteer",
      avatar: "../../public/images/profile3.png"
    }
  },
  {
    date: "Feb 02, 2025",
    category: "Tree Planting",
    title: "Urban Tree Planting & Care Program",
    description:
      "We planted native trees in urban areas, and each member adopts a plant to water weekly. Growth updates are shared with photos and short clips.",
    media: [
      {
        type: "video",
        url: "../../public/videos/treePlanting.mp4"
      }
    ],
    author: {
      name: "Aye Chan",
      role: "Youth Leader",
      avatar: "../../public/images/profile2.png"
    }
  },
  {
    date: "Mar 01, 2025",
    category: "Recycling",
    title: "Eco-Brick Community Project",
    description:
      "Residents collected non-recyclable plastics and turned them into eco-bricks. These bricks are used to build benches and garden borders.",
    media: [
      {
        type: "image",
        url: "../../public/images/download (2).jpg"
      }
    ],
    author: {
      name: "Ko Zaw Min",
      role: "Community Organizer",
      avatar: "../../public/images/profile4.jpg"
    }
  }
];



const ProjectFeed = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
      {samplePosts.map((post, index) => (
        <ProjectCard key={index} post={post} />
      ))}
    </div>
  );
};

export default ProjectFeed;
