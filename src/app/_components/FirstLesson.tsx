import { client } from "../../lib/sanityClient";

// Assuming you are using a server component to fetch data
export default async function FirstLesson() {
  const query = `*[_type == "lesson"]{
    title,
    description,
    video,
    "exercises": exercises[]{
      title,
      description,
      soundslice
    },
    tags
  }`;

  const lessons = await client.fetch(query);

  return (
    <div>
      <h1>Lessons</h1>
      <ul>
        {lessons.map((lesson: any) => (
          <li key={lesson.title}>
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
            <div>
              <h3>Exercises:</h3>
              <ul>
                {lesson.exercises.map((exercise: any, index: any) => (
                  <li key={index}>
                    <h4>{exercise.title}</h4>
                    <p>{exercise.description}</p>
                    {/* Assuming soundslice is a URL or embed code */}
                    <div
                      dangerouslySetInnerHTML={{ __html: exercise.soundslice }}
                    />
                  </li>
                ))}
              </ul>
            </div>
            {/* Render the video if it's a URL or an embedded video */}
            {lesson.video && (
              <div>
                <h3>Video</h3>
                <video src={lesson.video} controls />
              </div>
            )}
            {lesson.tags && (
              <div>
                <h3>Tags</h3>
                <ul>
                  {lesson.tags.map((tag: any, index: any) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
