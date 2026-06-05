import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShareButton from '@/components/ui/ShareButton'

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tip = await prisma.tip.findUnique({ where: { slug } })
  if (!tip) {
    notFound()
  }

  const recommended = await prisma.tip.findMany({
    where: { category: tip.category, NOT: { id: tip.id } },
    take: 3,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-600 hover:text-primary">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <Link href="/tips-tricks" className="text-gray-600 hover:text-primary ml-1 md:ml-2">Tips & Tricks</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="text-gray-500 ml-1 md:ml-2">{tip.title}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg mb-6">
        {tip.category && (
          <span className="inline-block bg-primary text-white text-sm font-semibold py-1 px-3 rounded-full mb-4">{tip.category}</span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{tip.title}</h1>
        {tip.description && <p className="text-lg text-gray-600 mb-4">{tip.description}</p>}
      </div>

      <article className="prose max-w-none mt-6" suppressHydrationWarning={true}>
        {tip.content ? (
          <div dangerouslySetInnerHTML={{ __html: tip.content }} />
        ) : (
          <p>{tip.description || ''}</p>
        )}
      </article>

      {recommended.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((rt) => (
              <div key={rt.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all">
                <Link href={`/tips-tricks/${rt.slug}`} className="block">
                  <div className="p-4">
                    {rt.category && (
                      <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-sm">{rt.category}</span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-1">{rt.title}</h3>
                    {rt.description && <p className="text-gray-500 text-sm line-clamp-2">{rt.description}</p>}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/tips-tricks" className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tips & Tricks
        </Link>
      </div>
    </div>
  )
}
