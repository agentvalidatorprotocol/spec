import { Link } from 'react-router-dom'
import { Shield, Sparkles, FileText, ArrowRight, BookOpen, Code2, Workflow } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Markdown } from '@/components/ui/Markdown'
import homeContent from '@/content/home.md?raw'

const sections = [
  {
    icon: BookOpen,
    title: 'Introduction',
    href: '/docs/getting-started',
  },
  {
    icon: Code2,
    title: 'VALIDATOR.md',
    href: '/reference/schema',
  },
  {
    icon: Workflow,
    title: 'Lifecycle',
    href: '/validators/lifecycle',
  },
]

const categories = [
  {
    icon: Shield,
    title: 'Security',
    href: '/validators/security/no-secrets',
    color: 'text-red-500',
  },
  {
    icon: Sparkles,
    title: 'Quality',
    href: '/validators/quality/no-console',
    color: 'text-amber-500',
  },
  {
    icon: FileText,
    title: 'Documentation',
    href: '/validators/docs/jsdoc-required',
    color: 'text-blue-500',
  },
]

export function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-background-dark dark:to-gray-900">
          <div className="max-w-4xl mx-auto">
            <Markdown content={homeContent} />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/docs/getting-started">
                <Button size="lg">
                  Read the Spec
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/reference/schema">
                <Button variant="secondary" size="lg">
                  VALIDATOR.md Schema
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Specification sections */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">
              Specification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sections.map(section => (
                <Link key={section.title} to={section.href}>
                  <Card hover className="h-full">
                    <CardContent className="p-6">
                      <section.icon className="w-8 h-8 text-accent-mint" />
                      <h3 className="mt-4 text-lg font-semibold text-primary dark:text-white">
                        {section.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-mint">
                        Read more <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Validator categories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">
              Example Validators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map(category => (
                <Link key={category.title} to={category.href}>
                  <Card hover className="h-full">
                    <CardContent className="p-6">
                      <category.icon className={`w-8 h-8 ${category.color}`} />
                      <h3 className="mt-4 text-lg font-semibold text-primary dark:text-white">
                        {category.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
