import MainLayout from '@/components/layout/MainLayout';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButton from '@/components/ui/ShareButton';
import { prisma } from '@/lib/prisma';

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  const classes = course
    ? await prisma.courseClass.findMany({ where: { courseId: course.id }, orderBy: { index: 'asc' } })
    : [];
  const courseFormat: 'video' | 'text' = classes.length > 0
    ? (classes[0].contentType === 'video' ? 'video' : 'text')
    : 'video';

  // Function to format YouTube URLs for embedding if needed
  const formatVideoUrl = (url: string) => {
    // Check if it's already an embed URL
    if (url.includes('/embed/')) {
      return url;
    }
    
    // Convert YouTube watch URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Return original URL for other sources
    return url;
  };

  if (!course) {
    notFound();
  }

  return (
    <MainLayout>
      {/* Course Header */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3">
              <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={course.imageUrl || '/placeholder-course.svg'}
                  alt={course.title}
                  fill
                  unoptimized={Boolean(course.imageUrl && course.imageUrl.endsWith('.svg'))}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 text-white">
              <div className="flex items-center mb-4">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-accent text-white mr-3">
                  {course.category}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-white text-primary`}>
                  {course.level}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-heading font-bold">{course.title}</h1>
              </div>
              <p className="text-secondary text-lg mb-6">{course.description}</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center">
                  <Image
                    src="/user-avatar.svg"
                    alt={course.instructor}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <span className="block text-white font-semibold">{course.instructor}</span>
                    <span className="text-secondary text-sm">Instructor</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white">
                    {(course.rating ?? 0).toFixed(1)} ({course.reviewCount ?? 0} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-secondary mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-white">{course.duration}</span>
                </div>
                <ShareButton url={`/courses/${slug}`} title={course.title} description={course.description} showLabel={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-primary">Course Content</h2>
            
            {/* Format Badge */}
            <div className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center ${
              courseFormat === 'video' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {courseFormat === 'video' ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                  </svg>
                  Video Course
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                  </svg>
                  Text Course
                  {/* Provider removed – not in schema */}
                </>
              )}
            </div>
          </div>

          {/* Class List */}
          <div className="space-y-4">
              {classes.length > 0 ? (
                classes.map((classItem: CourseClass) => (
                  <Link 
                    href={`/courses/${slug}/${classItem.id}`}
                    key={classItem.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer block"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-text">
                        {classItem.index}. {classItem.title}
                      </h3>
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
                        {classItem.index < 10 ? `0${classItem.index}` : classItem.index}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
              <div className="text-center py-8 text-neutral-700">
                No classes added yet for this course.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
