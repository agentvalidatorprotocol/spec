import { Markdown } from '@/components/ui/Markdown'
import { ValidatorCard } from '@/components/validators/ValidatorCard'
import { validatorsByCategory } from '@/data/validators'
import content from '@/content/validators/overview.md?raw'

const categoryInfo: Record<string, { title: string }> = {
  security: { title: 'Security' },
  quality: { title: 'Code Quality' },
  docs: { title: 'Documentation' },
}

export function ValidatorsOverview() {
  return (
    <div>
      <Markdown content={content} />

      {Object.entries(validatorsByCategory).map(([category, categoryValidators]) => (
        <section key={category} className="mt-12">
          <h2 id={category} className="text-2xl font-semibold text-primary dark:text-white mb-4">
            {categoryInfo[category]?.title || category}
          </h2>

          <div className="grid grid-cols-1 gap-4 mt-6">
            {categoryValidators.map(validator => (
              <ValidatorCard
                key={validator.name}
                validator={validator}
                href={`/validators/${category}/${validator.name}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
