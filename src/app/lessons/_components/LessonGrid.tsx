import Image from "next/image";
import Link from "next/link";
export default function LessonGrid({ lessons }: { lessons: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {lessons.map((course) => (
        <Link href={`/lessons/${course._id}`} key={course._id}>
          <div className="bg-[var(--secondary-color)] rounded-lg shadow-[4px_4px_4px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:bg-[#3D3F5D] group min-w-[300px] w-full h-[400px]">
            {course.imageUrl && (
              <div className="relative w-full pt-[56.25%] overflow-hidden">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 w-full h-full"
                />
                <div
                  className={`absolute flex flex-row justify-center items-center top-0 right-0 px-2 rounded-sm m-2 text-[var(--text-color)] ${course.membershipLevel === "free" ? "bg-blue-500" : course.membershipLevel === "silver" ? "bg-gray-500" : course.membershipLevel === "gold" ? "bg-yellow-500" : course.membershipLevel === "platinum" ? "bg-purple-500" : "bg-[var(--accent-color)]"}`}
                >
                  <span className="text-sm font-normal">
                    {course.membershipLevel?.toUpperCase()}
                  </span>
                </div>
                <div
                  className="absolute bottom-0 left-0 p-2 text-[var(--text-color)] "
                  style={{ textShadow: "3px 2px 2px #2d2d2d" }}
                >
                  <h2 className="text-xl font-bold break-words">
                    {course.title.toUpperCase()}
                  </h2>
                  <h3 className="text-sm">{course.subtitle}</h3>
                </div>
              </div>
            )}
            <div className="p-3 flex flex-col gap-1 h-[calc(100%-56.25%)]">
              <span
                className={`text-sm font-normal ${course.level === "beginner" ? "text-green-500" : course.level === "intermediate" ? "text-yellow-500" : "text-red-500"}`}
              >
                {course.level}
              </span>
              <div className="flex flex-wrap gap-2">
                {course.tags &&
                  course.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-semibold bg-[var(--accent-color)] text-[var(--primary-color)] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
              <p className="text-[var(--text-color)] text-sm italic break-words flex-grow">
                {course.description}
              </p>
              <div className="flex justify-between items-center mt-auto">
                {course.lessons && course.lessons.length > 0 && (
                  <span className="text-sm text-[var(--accent-color)]">
                    {course.lessons.length} lessons
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
