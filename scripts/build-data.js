// scripts/build-data.js
// Run: node scripts/build-data.js
//
// Input : data/prompts.json  (API response with { items: [...] })
// Output: public/data.json   (structured for the React app)

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const IN  = resolve('data/prompts.json')
const OUT = resolve('public/data.json')

if (!existsSync(IN)) {
  console.error(`✗ Input file not found: ${IN}`)
  console.error('  Place your API JSON at data/prompts.json and re-run.')
  process.exit(1)
}

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function groupItems(items) {
  const data = {}

  for (const item of items) {
    const ref = item.referenceObject
    if (!ref) continue

    const subjectSlug = toSlug(ref.subjectName  || 'unknown')
    const bookSlug    = toSlug(ref.bookName      || 'unknown')
    const chapterSlug = ref.slug || toSlug(ref.title || 'unknown')

    if (!data[subjectSlug])                        data[subjectSlug] = {}
    if (!data[subjectSlug][bookSlug])              data[subjectSlug][bookSlug] = {}
    if (!data[subjectSlug][bookSlug][chapterSlug]) {
      data[subjectSlug][bookSlug][chapterSlug] = {
        meta: {
          id:             ref._id          || null,
          title:          ref.title        || null,
          slug:           chapterSlug,
          bookName:       ref.bookName     || null,
          subjectName:    ref.subjectName  || null,
          examSeoTitle:   ref.examSeoTitle || null,
          svgIcon:        ref.svgIcon      || null,
          bookSvgIcon:    item.bookSvgIcon    || null,
          subjectSvgIcon: item.subjectSvgIcon || null,
          startsOnPage:   item.startsOnPage   ?? null,
          endsOnPage:     item.endsOnPage     ?? null,
          topics:         ref.topics       || [],
          edzyColor:      item.edzyColor   || null,
        },
        prompts: [],
      }
    }

    if (item.promptText) {
      data[subjectSlug][bookSlug][chapterSlug].prompts.push({
        index:     item.promptTemplateIndex ?? null,
        heading:   categoryHeading(item.promptTemplateText, item.promptTemplateIndex),
        prompt:    item.promptText,
        template:  item.promptTemplateText || null,
        edzyColor: item.edzyColor          || null,
      })
    }
  }

  for (const subject of Object.values(data))
    for (const book of Object.values(subject))
      for (const chapter of Object.values(book))
        chapter.prompts.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

  return data
}

const TEMPLATE_SIGNATURES = [
  { category: 'Quick Understanding', match: 'simple and quick way' },
  { category: 'Quick Review',        match: 'quick revision guide' },
  { category: 'Find My Mistake',     match: 'identify and correct their mistake' },
  { category: 'Exam Prep',           match: 'exam preparation guide' },
  { category: 'Practice Questions',  match: 'generate practice questions' },
]

function categoryHeading(promptTemplateText, promptTemplateIndex) {
  if (promptTemplateText) {
    const text = promptTemplateText.toLowerCase()
    for (const { category, match } of TEMPLATE_SIGNATURES) {
      const hit = match.includes('.*')
        ? new RegExp(match, 'i').test(text)
        : text.includes(match.toLowerCase())
      if (hit) return category
    }
  }
  const byIndex = ['Quick Understanding', 'Practice Questions', 'Quick Review', 'Find My Mistake', 'Exam Prep']
  return byIndex[promptTemplateIndex] ?? `Prompt ${(promptTemplateIndex ?? 0) + 1}`
}

const raw   = readFileSync(IN, 'utf8')
const input = JSON.parse(raw)
const items = input.items || input

const data = groupItems(items)

writeFileSync(OUT, JSON.stringify(data, null, 2))

const subjects = Object.keys(data).length
const books    = Object.values(data).flatMap(s => Object.keys(s)).length
const chapters = Object.values(data).flatMap(s => Object.values(s)).flatMap(b => Object.keys(b)).length
const prompts  = Object.values(data).flatMap(s => Object.values(s)).flatMap(b => Object.values(b)).reduce((n, c) => n + c.prompts.length, 0)

console.log(`✓ data.json written → ${OUT}`)
console.log(`  subjects : ${subjects}`)
console.log(`  books    : ${books}`)
console.log(`  chapters : ${chapters}`)
console.log(`  prompts  : ${prompts}`)
