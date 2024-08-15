export async function GET(request: any) {
  const res = await fetch(
    "https://jaypostones-drumlessons.com/wp-json/wp/v2/posts?per_page=1&order=desc&orderby=date",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Prevent caching
      },
    }
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }

  const data = await res.json();
  const post = data[0];

  const filteredData = {
    date: post.date,
    title: post.title.rendered,
    link: post.link,
    excerpt: post.excerpt.rendered,
  };

  console.log("Filtered Data:", filteredData); // Debugging output

  return new Response(JSON.stringify(filteredData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store", // Prevent caching
    },
  });
}
