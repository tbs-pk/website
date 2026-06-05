import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminClasses({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const courses = await prisma.course.findMany({ orderBy: { title: 'asc' } })
  const selectedIdRaw = typeof searchParams?.courseId === 'string' ? searchParams?.courseId : ''
  const selectedId = Number(selectedIdRaw || 0)
  const selectedCourse = selectedId ? await prisma.course.findUnique({ where: { id: selectedId } }) : null
  const classes = selectedCourse
    ? await prisma.courseClass.findMany({ where: { courseId: selectedCourse.id }, orderBy: { index: 'asc' } })
    : []

  async function addClass(formData: FormData) {
    'use server'
    const courseId = Number(formData.get('courseId') || 0)
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return
    const index = Number(formData.get('index') || 0)
    const title = String(formData.get('title') || '')
    const contentType = String(formData.get('contentType') || 'text')
    const videoUrl = String(formData.get('videoUrl') || '')
    const textContent = String(formData.get('textContent') || '')
    await prisma.courseClass.create({
      data: {
        courseId,
        index,
        title,
        contentType,
        videoUrl: videoUrl || null,
        textContent: textContent || null,
      },
    })
    revalidatePath(`/courses/${course.slug}`)
    revalidatePath('/admin/classes')
    revalidatePath('/admin')
    redirect(`/admin/classes?courseId=${courseId}&added=1`)
  }

  async function deleteClass(formData: FormData) {
    'use server'
    const id = Number(formData.get('id'))
    const courseId = Number(formData.get('courseId'))
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    await prisma.courseClass.delete({ where: { id } })
    if (course) revalidatePath(`/courses/${course.slug}`)
    revalidatePath('/admin/classes')
    revalidatePath('/admin')
    redirect(`/admin/classes?courseId=${courseId}&deleted=1`)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Classes</h2>
        <Link href="/admin/courses" className="text-primary">Back to Courses</Link>
      </div>

      {typeof searchParams?.added === 'string' && (
        <div className="px-4 py-2 rounded bg-green-50 text-green-700 border border-green-200">Class added successfully</div>
      )}
      {typeof searchParams?.deleted === 'string' && (
        <div className="px-4 py-2 rounded bg-amber-50 text-amber-800 border border-amber-200">Class deleted</div>
      )}

      <form method="get" className="flex items-center gap-3">
        <select name="courseId" defaultValue={selectedIdRaw} className="border rounded px-3 py-2">
          <option value="">Select course</option>
          {courses.map(c => (
            <option key={c.id} value={String(c.id)}>{c.title}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-neutral-200 rounded">Load</button>
      </form>

      {selectedCourse && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Course: {selectedCourse.title}</h3>
            <p className="text-sm text-neutral-500">Slug: {selectedCourse.slug}</p>
          </div>

          <form action={addClass} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="hidden" name="courseId" value={String(selectedCourse.id)} />
            <input name="index" type="number" placeholder="Index" className="border rounded px-3 py-2" required />
            <input name="title" placeholder="Title" className="border rounded px-3 py-2" required />
            <select name="contentType" className="border rounded px-3 py-2">
              <option value="text">Text</option>
              <option value="video">Video</option>
            </select>
            <input name="videoUrl" placeholder="Video URL (optional)" className="border rounded px-3 py-2" />
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Text Content</label>
              <textarea name="textContent" className="w-full border rounded px-3 py-2" rows={4}></textarea>
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded md:col-span-2">Add Class</button>
          </form>

          <div>
            <h3 className="font-semibold mb-2">Existing Classes</h3>
            <ul className="divide-y">
              {classes.map((cls) => (
                <li key={cls.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{cls.index}. {cls.title}</div>
                    <div className="text-sm text-neutral-500">{cls.contentType}</div>
                  </div>
                  <form action={deleteClass}>
                    <input type="hidden" name="id" value={String(cls.id)} />
                    <input type="hidden" name="courseId" value={String(selectedCourse.id)} />
                    <button className="text-red-600">Delete</button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
