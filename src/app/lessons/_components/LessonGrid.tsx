import Image from "next/image";

export default function LessonGrid({ lessons }: { lessons: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((course) => (
        <div
          key={course.title}
          className="bg-[var(--secondary-color)] rounded-lg shadow-md overflow-hidden min-w-[300px] min-h-[200px] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:bg-[#3D3F5D]"
        >
          {course.imageUrl && (
            <div className="relative w-full pt-[56.25%] overflow-hidden">
              <Image
                src={course.imageUrl}
                alt={course.title}
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2 transition-colors duration-300 ease-in-out hover:text-[var(--accent-color)]">
              {course.title.toUpperCase()}
            </h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {course.tags &&
                course.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-semibold bg-[var(--accent-color)] text-[var(--primary-color)] rounded-full transition-colors duration-300 ease-in-out hover:bg-opacity-80"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <p className="text-[var(--text-color)] mb-4 text-sm italic">
              {course.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[var(--accent-color)] transition-colors duration-300 ease-in-out hover:text-opacity-80">
                {course.level}
              </span>
              {course.lessons && course.lessons.length > 0 && (
                <span className="text-sm text-[var(--accent-color)] transition-colors duration-300 ease-in-out hover:text-opacity-80">
                  {course.lessons.length} lessons
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
