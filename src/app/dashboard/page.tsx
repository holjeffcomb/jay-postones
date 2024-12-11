// // app/profiles/page.js
// import { cookies } from "next/headers";
// import { createClient } from "../utils/supabase/server";

// export default async function DashboardPage() {
//   const cookieStore = await cookies();
//   const supabase = createClient(cookieStore);
//   const { data: profiles, error } = await supabase.from("profiles").select("*");

//   if (error) {
//     console.error(error);
//     return <div>Failed to load profiles.</div>;
//   }

//   return (
//     <div>
//       <h1>Profiles</h1>
//       <ul>
//         {profiles.map((profile) => (
//           <li key={profile.id}>
//             {profile.id} {profile.membership_level}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
