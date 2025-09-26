import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Tenant } from '@/payload-types'

export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      tenant: true,
    },
    depth: 1,
  })

  const params = pages.docs
    ?.filter((doc) => {
      if (doc.tenant === null || doc.tenant === undefined || typeof doc.tenant === 'number')
        return false
      else return doc.slug !== 'home' && typeof doc.tenant.domain === 'string'
    })
    .map(({ slug, tenant: t }) => {
      const tenant = t as Tenant
      return { tenant: tenant.domain, slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
    tenant: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', tenant } = await paramsPromise
  const url = '/' + slug
  // console.log('tenant:', tenant) //
  // console.log('slug:', slug) //
  const payload = await getPayload({ config: configPromise })
  try {
    const tenantsQuery = await payload.find({
      collection: 'tenants',
      overrideAccess: false,
      where: {
        domain: {
          equals: tenant,
        },
      },
    })
    // console.log('tenantsQuery.docs.length:', tenantsQuery.docs.length)
    if (tenantsQuery.docs.length === 0) {
      throw 'No such tenant'
    }
  } catch (_e) {
    // If the query fails, it means the user did not have access to query on the domain field
    // console.log('_e:', _e)
    redirect('/admin')
  }
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug,
    tenant,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home', tenant } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
    tenant,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, tenant }: { slug: string; tenant: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      and: [
        {
          'tenant.domain': {
            equals: tenant,
          },
        },
        {
          slug: {
            equals: slug,
          },
        },
      ],
    },
  })

  return result.docs?.[0] || null
})
