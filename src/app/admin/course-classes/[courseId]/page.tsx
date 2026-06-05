import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CourseClassesManager({ params, searchParams }: { params: Promise<{ courseId: string }>, searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { courseId: courseIdParam } = await params;
  const courseId = Number(courseIdParam)
  const resolvedSearchParams = await searchParams;
  
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) {
    notFound()
  }

  async function addClass(formData: FormData) {
    'use server'
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
    revalidatePath(`/courses/${course!.slug}`)
    revalidatePath(`/admin/course-classes/${courseId}`)
    revalidatePath('/admin')
    redirect(`/admin/course-classes/${courseId}?added=1`)
  }

  async function deleteClass(formData: FormData) {
    'use server'
    const id = Number(formData.get('id'))
    await prisma.courseClass.delete({ where: { id } })
    revalidatePath(`/courses/${course!.slug}`)
    revalidatePath(`/admin/course-classes/${courseId}`)
    revalidatePath('/admin')
    redirect(`/admin/course-classes/${courseId}?deleted=1`)
  }

  const classes = await prisma.courseClass.findMany({ where: { courseId }, orderBy: { index: 'asc' } })
  const added = typeof resolvedSearchParams?.added === 'string' && resolvedSearchParams.added === '1'
  const deleted = typeof resolvedSearchParams?.deleted === 'string' && resolvedSearchParams.deleted === '1'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Classes: {course.title}</h2>
        <Link href="/admin/courses" className="text-primary">Back to Courses</Link>
      </div>

      {added && (
        <div className="p-3 rounded bg-green-50 text-green-700 border border-green-200">Class added successfully</div>
      )}
      {deleted && (
        <div className="p-3 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">Class deleted successfully</div>
      )}

      <form action={addClass} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <button className="text-red-600">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
