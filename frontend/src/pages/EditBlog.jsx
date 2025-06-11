import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../axios'
import useAuth from '../context/AuthContext'
import { useSnackbar } from 'notistack'

const EditBlog = () => {
  const { slug } = useParams()
  const { token } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [blogId, setBlogId] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const blog = res.data.blog
        setFormData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
        })
        setBlogId(blog._id)
        setLoading(false)
      } catch (err) {
        enqueueSnackbar('Failed to fetch blog', { variant: 'error' })
        setLoading(false)
      }
    }
    fetchBlog()
    // eslint-disable-next-line
  }, [slug, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('category', formData.category)
    if (image) data.append('blogImage', image)

    try {
      await axios.put(`/blogs/${blogId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      enqueueSnackbar('Blog updated successfully', { variant: 'success' })
      navigate('/dashboard')
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update blog', {
        variant: 'error',
      })
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Description"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Category"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Update Blog
        </button>
      </form>
    </div>
  )
}

export default EditBlog