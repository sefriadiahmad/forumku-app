// Create Thread Page - Create new thread
// ForumKu Thread Feature
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft } from 'lucide-react'

import { createThreadAsync, selectThreadsLoading } from '../features/threads/threadsSlice'
import { Button, Input, Textarea } from '../components/ui'
import { CategoryDropdown } from '../features/threads/components'
import { useToast } from '../components/ui/Toast'

// Available categories for thread creation
const THREAD_CATEGORIES = [
  'general',
  'tech',
  'lifestyle',
  'entertainment',
  'education',
]

const CreateThreadPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const loading = useSelector(selectThreadsLoading)

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'general',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Judul tidak boleh kosong'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Judul minimal 5 karakter'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Judul maksimal 200 karakter'
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Konten tidak boleh kosong'
    } else if (formData.body.length < 10) {
      newErrors.body = 'Konten minimal 10 karakter'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      const result = await dispatch(createThreadAsync(formData)).unwrap()
      toast.success('Thread berhasil dibuat!')
      navigate(`/thread/${result.id}`)
    } catch (err) {
      toast.error(err.message || 'Gagal membuat thread')
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Buat Thread Baru
        </h1>
        <p className="text-text-secondary">
          Bagikan ide, pertanyaan, atau topik diskusi dengan komunitas
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Judul"
          placeholder="Judul thread Anda"
          value={formData.title}
          onChange={handleChange('title')}
          error={errors.title}
          required
          helperText={`${formData.title.length}/200 karakter`}
        />

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Kategori
          </label>
          <CategoryDropdown
            value={formData.category}
            onChange={handleCategoryChange}
            categories={THREAD_CATEGORIES}
          />
          <p className="text-sm text-text-tertiary">
            Pilih kategori yang sesuai dengan thread Anda
          </p>
        </div>

        {/* Body */}
        <Textarea
          label="Konten"
          placeholder="Tulis konten thread Anda di sini..."
          value={formData.body}
          onChange={handleChange('body')}
          error={errors.body}
          rows={8}
          required
          showCount
          maxLength={10000}
        />

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Posting Thread
          </Button>
          <Link to="/">
            <Button type="button" variant="ghost">
              Batal
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default CreateThreadPage
