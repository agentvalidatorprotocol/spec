import { Markdown } from '@/components/ui/Markdown'
import { ValidatorCard } from '@/components/validators/ValidatorCard'
import { validators } from '@/data/validators'
import content from '@/content/validators/overview.md?raw'

const tagInfo: Record<string, { title: string }> = {
  security: { title: 'Security' },
  quality: { title: 'Code Quality' },
  docs: { title: 'Documentation' },
  testing: { title: 'Testing' },
}

// Group validators by their primary tag (first tag)
const validatorsByPrimaryTag = validators.reduce((acc, validator) => {
  const primaryTag = validator.tags[0] || 'other'
  if (!acc[primaryTag]) {
    acc[primaryTag] = []
  }
  acc[primaryTag].push(validator)
  return acc
}, {} as Record<string, typeof validators>)

export function ValidatorsOverview() {
  return (
    <div>
      <Markdown content={content} />

      {Object.entries(validatorsByPrimaryTag).map(([tag, tagValidators]) => (
        <section key={tag} className="mt-12">
          <h2 id={tag} className="text-2xl font-semibold text-primary dark:text-white mb-4">
            {tagInfo[tag]?.title || tag}
          </h2>

          <div className="grid grid-cols-1 gap-4 mt-6">
            {tagValidators.map(validator => (
              <ValidatorCard
                key={validator.name}
                validator={validator}
                href={`/validators/${tag}/${validator.name}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
