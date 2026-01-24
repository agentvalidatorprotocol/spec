import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'

// Pages
import { Home } from '@/pages/Home'
import { GettingStarted } from '@/pages/docs/GettingStarted'
import { ValidatorsOverview } from '@/pages/validators/Overview'
import { ValidatorsLifecycle } from '@/pages/validators/Lifecycle'
import { ValidatorsTriggers } from '@/pages/validators/Triggers'
import { ValidatorsSeverity } from '@/pages/validators/Severity'
import { NoSecrets } from '@/pages/validators/builtin/security/NoSecrets'
import { SchemaReference } from '@/pages/reference/Schema'

function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 xl:mr-56">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* About AVP */}
      <Route path="/docs/getting-started" element={<DocsLayout><GettingStarted /></DocsLayout>} />

      {/* Core Concepts */}
      <Route path="/validators/lifecycle" element={<DocsLayout><ValidatorsLifecycle /></DocsLayout>} />
      <Route path="/validators/triggers" element={<DocsLayout><ValidatorsTriggers /></DocsLayout>} />
      <Route path="/validators/severity" element={<DocsLayout><ValidatorsSeverity /></DocsLayout>} />

      {/* Reference */}
      <Route path="/reference/schema" element={<DocsLayout><SchemaReference /></DocsLayout>} />

      {/* Examples */}
      <Route path="/validators/overview" element={<DocsLayout><ValidatorsOverview /></DocsLayout>} />
      <Route path="/validators/security/no-secrets" element={<DocsLayout><NoSecrets /></DocsLayout>} />
      <Route path="/validators/security/no-eval" element={<DocsLayout><NoSecrets /></DocsLayout>} />
      <Route path="/validators/security/sql-injection" element={<DocsLayout><NoSecrets /></DocsLayout>} />
      <Route path="/validators/quality/no-console" element={<DocsLayout><NoSecrets /></DocsLayout>} />
      <Route path="/validators/quality/function-length" element={<DocsLayout><NoSecrets /></DocsLayout>} />
      <Route path="/validators/quality/complexity" element={<DocsLayout><NoSecrets /></DocsLayout>} />
      <Route path="/validators/docs/jsdoc-required" element={<DocsLayout><NoSecrets /></DocsLayout>} />
      <Route path="/validators/docs/readme-updated" element={<DocsLayout><NoSecrets /></DocsLayout>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
