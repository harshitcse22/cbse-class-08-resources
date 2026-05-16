import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description }) {
  const fullTitle = `${title} | CBSE Class 8 Prompts`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
    </Helmet>
  )
}
