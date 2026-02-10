import { MetadataRoute } from 'next'
import pageData from '@/lib/initial-data.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ajazhs.vercel.app'
  
  // Base home page
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ]

  // Add section anchors for SEO visibility
  const sections = pageData.pages.map((page) => ({
    url: `${baseUrl}/#${page.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...sections]
}
