import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { client } from "../../../lib/sanityClient";
import {
  fetchProgress,
  fetchUserId,
  handleProgressUpdate,
} from "@/app/utils/supabaseService";
import { PortableText } from "@portabletext/react";
import { Exercise, Lesson, ProgressList } from "../../../../types/types";
import { components } from "./_components/LessonSection";
import { createClient } from "@/app/utils/supabase/client";

const supabase = createClient();

interface LessonContextType {
  lesson: Lesson | null;
  userNotes: string;

  setUserNotes: (notes: string) => void;

  handleMarkComplete: (exerciseId: string) => Promise<void>;
  handleMarkTooDifficult: (exerciseId: string) => Promise<void>;
  isMarkCompleteLoading: boolean;
  isTooDifficultLoading: boolean;

  // exercise state
  selectedExerciseTitle: string | null;
  setSelectedExerciseTitle: (title: string | null) => void;
  exerciseId: string | null;
  setExerciseId: (id: string | null) => void;
  exerciseContent: React.ReactNode;
  setExerciseContent: (content: React.ReactNode) => void;
  completedExerciseIds: string[];
  difficultExerciseIds: string[];
  setCompletedExerciseIds: React.Dispatch<React.SetStateAction<string[]>>;
  setDifficultExerciseIds: React.Dispatch<React.SetStateAction<string[]>>;
  lessonExercises: Exercise[];
  loadExerciseContent: (exercise: Exercise) => void;
  isPageLoading: boolean;
  userId: string | null;
  isInPracticeList: boolean;
  setIsInPracticeList: React.Dispatch<React.SetStateAction<boolean>>;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

interface LessonProviderProps {
  children: ReactNode;
  lessonId: string;
}

export const LessonProvider = ({ children, lessonId }: LessonProviderProps) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [userNotes, setUserNotes] = useState<string>(
    "enter your own notes here..."
  );
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [exerciseContent, setExerciseContent] = useState<React.ReactNode>(null);
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(
    []
  );
  const [difficultExerciseIds, setDifficultExerciseIds] = useState<string[]>(
    []
  );
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState<
    string | null
  >(null);
  const [isMarkCompleteLoading, setIsMarkCompleteLoading] = useState(false);
  const [isTooDifficultLoading, setIsTooDifficultLoading] = useState(false);
  const [lessonExercises, setLessonExercises] = useState<Exercise[]>([]);
  const [isInPracticeList, setIsInPracticeList] = useState<boolean>(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const fetchedLesson = await client.fetch<Lesson>(
          `*[_type == "lesson" && _id == "${lessonId}"][0]`
        );

        setLesson(fetchedLesson);

        const firstExercise = fetchedLesson?.exercises?.[0];
        if (firstExercise) {
          loadExerciseContent(firstExercise);
        } else {
          console.error("No exercises found for this lesson.");
        }

        const userId = await fetchUserId();

        if (!userId) {
          console.warn("User is not logged in");
          setUserId(null); // Explicitly set userId to null
          return; // Stop execution if no user is logged in
        }

        setUserId(userId);

        const { data, error } = await supabase
          .from("practice_list")
          .select("id") // Only select the ID or any column for existence check
          .eq("user_id", userId)
          .eq("lesson_id", lessonId) // Match the specific lesson ID
          .limit(1); // Optimize query to stop after finding one match

        if (error) {
          console.error("Error checking practice list:", error);
        }

        // Check if any data is returned
        const lessonExists = data && data.length > 0;
        console.log("Lesson exists in practice list:", lessonExists);
        setIsInPracticeList(lessonExists || false);

        const progress = await fetchProgress(firstExercise.id, userId);
        if (!progress) {
          console.error("Failed to fetch progress data.");
        } else {
          setCompletedExerciseIds(returnCompletedExercises(progress));
          setDifficultExerciseIds(returnDifficultExercises(progress));
        }
        setLessonExercises(fetchedLesson?.exercises);
      } catch (error) {
        console.error("Unexpected error in fetchLesson:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const loadExerciseContent = (exercise: Exercise) => {
    setExerciseId(exercise.id);
    setSelectedExerciseTitle(exercise.title);

    if (exercise.type === "portableText") {
      setExerciseContent(
        <div className="w-10/12 flex flex-col m-auto">
          <PortableText
            value={exercise.content || []}
            components={components}
          />
        </div>
      );
    } else if (exercise.type === "soundslice") {
      setExerciseContent(
        <iframe
          src={exercise.soundsliceUrl}
          width="100%"
          height="400"
          allowFullScreen
        ></iframe>
      );
    } else if (exercise.type === "video") {
      setExerciseContent(
        <iframe
          src={exercise.videoUrl?.replace(
            "https://vimeo.com/",
            "https://player.vimeo.com/video/"
          )}
          width="100%"
          height="480"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Exercise Video"
        />
      );
    } else {
      setExerciseContent(<p>No exercises available for this lesson.</p>);
    }
  };

  const returnCompletedExercises = (progressData: ProgressList): string[] => {
    const data = progressData
      .filter((progress) => progress.status === "complete")
      .map((progress) => progress.exercise_id);
    console.log("exercise IDs:", data);
    return data;
  };

  const returnDifficultExercises = (progressData: ProgressList): string[] =>
    progressData
      .filter((progress) => progress.status === "too difficult")
      .map((progress) => progress.exercise_id);

  const handleMarkComplete = async (exerciseId: string) => {
    setIsMarkCompleteLoading(true);

    const response = await handleProgressUpdate(exerciseId, "complete");
    if (response.success) {
      console.log("Exercise marked as complete!");
      setCompletedExerciseIds((prev) => [...prev, exerciseId]);
      setDifficultExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
    } else {
      alert("Failed to mark exercise as complete.");
    }
    setIsMarkCompleteLoading(false);
  };

  const handleMarkTooDifficult = async (exerciseId: string) => {
    setIsTooDifficultLoading(true);

    const response = await handleProgressUpdate(exerciseId, "too difficult");
    if (response.success) {
      console.log("Exercise marked as too difficult!");
      setDifficultExerciseIds((prev) => [...prev, exerciseId]);
      setCompletedExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
    } else {
      alert("Failed to mark exercise as too difficult.");
    }
    setIsTooDifficultLoading(false);
  };

  return (
    <LessonContext.Provider
      value={{
        lesson,
        userNotes,
        exerciseContent,
        setUserNotes,
        setExerciseContent,
        handleMarkComplete,
        handleMarkTooDifficult,
        isMarkCompleteLoading,
        isTooDifficultLoading,
        completedExerciseIds,
        difficultExerciseIds,
        setExerciseId,
        setSelectedExerciseTitle,
        selectedExerciseTitle,
        exerciseId,
        setCompletedExerciseIds,
        setDifficultExerciseIds,
        lessonExercises,
        loadExerciseContent,
        isPageLoading,
        userId,
        isInPracticeList,
        setIsInPracticeList,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error("useLessonContext must be used within a LessonProvider");
  }
  return context;
};
