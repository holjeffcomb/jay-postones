"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GridItem } from "../../../../types/types";
import { BucketType } from "../page";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContext } from "@/app/_context/GlobalContext";
import { User } from "../../../../types/types";

export default function ItemGrid({
  items,
  bucket,
}: {
  items: GridItem[];
  bucket: BucketType;
}) {
  const [selectedCourse, setSelectedCourse] = useState<GridItem | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleItemClick = (item: GridItem, event: React.MouseEvent) => {
    if (bucket === "courses") {
      event.preventDefault(); // Prevent navigation if it's a course
      setSelectedCourse(item);
    }
  };

  const decideIfLocked = (userLevel: string, itemLevel: string): boolean => {
    const levels = ["free", "silver", "gold", "platinum"];
    return levels.indexOf(userLevel) < levels.indexOf(itemLevel);
  };

  const openUpgradeModal = () => {
    setShowUpgradeModal(true);
  };

  const { user } = useGlobalContext();

  return (
    <>
      {/* Grid Container with Fade-in Animation */}
      <motion.div
        key={items.length} // Triggers reanimation when filters change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {items?.map((item, index) => (
            <motion.div
              key={item._id} // Must be unique
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: index * 0.05,
              }}
            >
              <Link
                href={`/lessons/${item._id}`}
                onClick={(e) => {
                  const isLocked = decideIfLocked(
                    user?.membershipLevel,
                    item.membershipLevel
                  );
                  if (isLocked) {
                    e.preventDefault(); // Prevent navigation if locked
                    openUpgradeModal(); // Function to open upgrade modal
                    return;
                  }

                  handleItemClick(item, e);
                }}
              >
                <div className="flex flex-col bg-[var(--secondary-color)] rounded-lg shadow-[4px_4px_4px_rgba(0,0,0,0.8)] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:bg-[#3D3F5D] group min-w-[300px] w-full min-h-[460px] max-h-[none] overflow-hidden">
                  {item.imageUrl && (
                    <div className="relative w-full pt-[56.25%]">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        layout="fill"
                        objectFit="cover"
                        className="absolute top-0 left-0 w-full h-full"
                      />
                      {decideIfLocked(
                        user?.membershipLevel,
                        item.membershipLevel
                      ) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Image
                            src="/images/icons/lock_icon.svg"
                            width={50}
                            height={50}
                            alt="LOCKED"
                          />
                        </div>
                      )}
                      <div
                        className={`absolute top-0 right-0 px-2 rounded-sm m-2 text-[var(--text-color)] ${
                          item.membershipLevel === "frees"
                            ? "bg-blue-500"
                            : item.membershipLevel === "silver"
                            ? "bg-gray-500"
                            : item.membershipLevel === "gold"
                            ? "bg-yellow-500"
                            : item.membershipLevel === "platinum"
                            ? "bg-purple-500"
                            : "bg-[var(--accent-color)]"
                        }`}
                      >
                        <span className="text-sm font-normal">
                          {item.membershipLevel?.toUpperCase()}
                        </span>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 w-full p-2 text-[var(--text-color)]"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0, 0, 0, 0.85) 25%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.15) 85%, rgba(0, 0, 0, 0) 100%)",
                          textShadow: "3px 2px 2px #2d2d2d",
                        }}
                      >
                        <h2 className="text-xl font-bold break-words">
                          {item.title.toUpperCase()}
                        </h2>
                        <h3 className="text-sm">{item.subtitle}</h3>
                      </div>
                    </div>
                  )}
                  <div className="p-3 flex flex-col gap-1 flex-grow">
                    <span
                      className={`text-sm font-normal ${
                        item.level === "beginner"
                          ? "text-green-500"
                          : item.level === "intermediate"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {item.level}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.tags?.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-1 py-0.5 text-xs font-normal bg-[var(--accent-color)] text-[var(--primary-color)] rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[var(--text-color)] text-sm italic break-words flex-grow">
                      {item.summary}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      {(bucket === "courses" && item.lessons?.length) ??
                      0 > 0 ? (
                        <span className="text-sm text-[var(--accent-color)]">
                          {item.lessons?.length} lessons
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal for Courses */}
      {selectedCourse && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full relative 
             max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedCourse(null)}
            >
              ✖
            </button>
            <div className="flex bg-[var(--secondary-color)] p-4">
              <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            </div>
            <div className="flex flex-col bg-[var(--accent-color)] p-4">
              <h2 className="text-xl font-bold text-[var(--secondary-color)]">
                DESCRIPTION
              </h2>
              <p className="mt-2 text-sm text-[var(--secondary-color)] font-light whitespace-pre-line leading-tight">
                {selectedCourse.fullDescription}
              </p>
            </div>
            {/* "In This Course" Section */}
            <div className="p-4 bg-[var(--accent-color)] flex-grow overflow-auto scroll-container relative">
              <h2 className="text-xl font-bold text-[var(--secondary-color)]">
                IN THIS COURSE
              </h2>
              <div className="mt-4 bg-[var(--light-grey)] rounded-md p-4 max-h-[30vh] overflow-auto scroll-container relative">
                {selectedCourse.lessons?.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="flex text-[var(--secondary-color)] gap-3 py-3 relative"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {lesson.imageUrl && (
                        <Image
                          src={lesson.imageUrl}
                          alt={lesson.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <Link
                        className="font-bold text-sm"
                        href={`/lessons/${lesson._id}`}
                      >
                        {lesson.title.toUpperCase()}
                      </Link>
                      <p className="text-xs line-clamp-4">
                        {lesson.description}
                      </p>
                    </div>
                    {selectedCourse.lessons &&
                      index !== selectedCourse.lessons.length - 1 && (
                        <div className="absolute left-0 right-0 bottom-0 border-t border-dashed border-[var(--secondary-color)]"></div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="bg-[var(--secondary-color)] text-[var(--text-color)] rounded-lg shadow-lg max-w-md w-full p-6 relative border border-[var(--accent-color)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-[var(--accent-color)] hover:text-white transition"
              onClick={() => setShowUpgradeModal(false)}
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-center mb-4 text-[var(--accent-color)]">
              Upgrade Required
            </h2>

            <p className="text-sm text-[var(--text-color)] text-center font-light">
              This lesson is locked. Upgrade your membership to gain full
              access.
            </p>

            <div className="mt-6 flex justify-center">
              <Link href="/upgrade">
                <button className="bg-[var(--accent-color)] text-[var(--primary-color)] px-4 py-2 rounded hover:brightness-110 transition font-semibold">
                  View Membership Options
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
