"use client"

import { useState, useEffect } from "react"
import PostCard from "../components/PostCard"
import AddPostForm from "../components/AddPostForm"
import { useAuth } from "../components/AuthContext"

interface Post {
  id: number
  title: string
  content: string
  author_name: string
  is_guest: boolean
  created_at: string
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPost, setShowAddPost] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostAdded = () => {
    fetchPosts()
    setShowAddPost(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Full Stack Blog
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Share your thoughts with the world
        </p>
        
        <button
          onClick={() => setShowAddPost(!showAddPost)}
          className="btn-primary"
        >
          {showAddPost ? "Cancel" : "Write a Post"}
        </button>
      </div>

      {showAddPost && (
        <div className="mb-8">
          <AddPostForm onPostAdded={handlePostAdded} />
        </div>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No posts yet
            </h2>
            <p className="text-gray-500">
              Be the first to share something amazing!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}