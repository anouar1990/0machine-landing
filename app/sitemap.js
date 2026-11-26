import localBlogs from "./content/blogs.json";

export default function sitemap() {
  const baseUrl = "https://www.0machine.com";
  const now = new Date();

  // Core static & free tool routes
  const staticRoutes = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/tools/box-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/tools/test-matrix`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/tools/living-hinge`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/tools/nesting`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/tools/photo-to-svg`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/tools/image-to-dxf`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/compare/sendcutsend-alternative`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/designs`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/designs/dxf-files-laser-cutting`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/designs/svg-files-laser-cutting`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/designs/free-laser-cut-files`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/designs/layered-svg-files`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  // Blog dynamic articles
  const blogRoutes = localBlogs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...blogRoutes];
}

