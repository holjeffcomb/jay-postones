import Image from "next/image";
import Link from "next/link";
export default function LessonGrid({ lessons }: { lessons: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {lessons.map((course) => (
        <Link href={`/lessons/${course._id}`} key={course._id}>
          <div className="bg-[var(--secondary-color)] rounded-lg shadow-[4px_4px_4px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:bg-[#3D3F5D] group min-w-[300px] w-full">
            {course.imageUrl && (
              <div className="relative w-full pt-[56.25%] overflow-hidden">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            )}
            <div className="p-4 flex flex-col h-[calc(100%-56.25%)]">
              <h2 className="text-xl font-bold mb-2 group-hover:text-[var(--accent-color)] break-words">
                {course.title.toUpperCase()}
              </h2>
              <div className="flex flex-wrap gap-2 mb-2">
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
              <p className="text-[var(--text-color)] mb-4 text-sm italic break-words flex-grow">
                {course.description}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-sm font-semibold text-[var(--accent-color)]">
                  {course.level}
                </span>
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
