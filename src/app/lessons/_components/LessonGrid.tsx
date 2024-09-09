import Image from "next/image";

export default function LessonGrid({ lessons }: { lessons: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((course) => (
        <div
          key={course.title}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {course.imageUrl && (
            <Image
              src={course.imageUrl}
              alt={course.title}
              width={400}
              height={225}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-blue-600">
                {course.level}
              </span>
              <span className="text-sm text-gray-500">
                {course.lessons?.length || 0} lessons
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
