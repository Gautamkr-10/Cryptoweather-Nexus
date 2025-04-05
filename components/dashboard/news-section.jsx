"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchNewsData } from "@/redux/features/newsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink } from "lucide-react"

export default function NewsSection() {
  const dispatch = useDispatch()
  const { news, loading } = useSelector((state) => state.news)

  useEffect(() => {
    dispatch(fetchNewsData())
  }, [dispatch])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading
            ? Array(5)
                .fill()
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))
            : news.slice(0, 5).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium line-clamp-2">{item.title}</h3>
                    <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center mt-2">
                    <p className="text-xs text-gray-500">{formatDate(item.publishedAt)}</p>
                    {item.source && <p className="text-xs text-gray-500 ml-2">• {item.source}</p>}
                  </div>
                </a>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}

